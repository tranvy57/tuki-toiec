from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Any, Optional
import voyageai
import os
from dotenv import load_dotenv
load_dotenv()
import numpy as np
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class QdrantService:
    """
    QdrantService: tiện ích quản lý collection, upsert, và search vector.
    Dùng cho RAG, knowledge retrieval, và AI embeddings.
    """

    def __init__(self):
        self.url = "http://34.87.152.106:6333"
        self.collection_name = "toeic_speaking_knowledge"
        self.dimension = 1024
        self.client = QdrantClient(url=self.url)
        self.vo = voyageai.Client(api_key=os.environ.get("VOYAGE_API_KEY"))


    def connect(self, auto_create: bool = True):
        """
        Kết nối tới Qdrant và VoyageAI, kiểm tra cấu hình cơ bản.
        - auto_create=True: tự tạo collection nếu chưa có.
        """
        print("🔗 Checking Qdrant and VoyageAI connection...")

        try:
            health = self.client.get_collections()
            if health:
                print(f"✅ Connected to Qdrant at {self.url}")
        except Exception as e:
            raise ConnectionError(f"❌ Cannot connect to Qdrant at {self.url} — {e}")

        try:
            info = self.client.get_collection(self.collection_name)
            vector_size = info.config.params.vectors.size
            print(f"📦 Collection '{self.collection_name}' exists with {vector_size} dims.")
        except Exception:
            if auto_create:
                self.create_collection(vector_size=self.dimension)
            else:
                raise RuntimeError(
                    f"⚠️ Collection '{self.collection_name}' not found and auto_create=False."
                )

        # try:
        #     test_vec = self.vo.embed(
        #         model="voyage-3-large",
        #         texts=["connection test"],
        #         output_dimension=self.dimension
        #     )
        #     if test_vec and hasattr(test_vec, "embeddings"):
        #         print("✅ VoyageAI API is active and returning embeddings.")
        # except Exception as e:
        #     raise ConnectionError(f"❌ VoyageAI API check failed — {e}")

        print("🚀 Connection and setup complete!")
        return True

    def get_embedding(self, text: str) -> List[float]:
        """Generate embedding using VoyageAI"""
        response = self.vo.embed(
            model="voyage-3-large", 
            texts=[text], 
            output_dimension=self.dimension
        )
        return response.embeddings[0]

    def create_collection(
        self,
        vector_size: int = 1024,
        distance: models.Distance = models.Distance.COSINE,
        recreate: bool = False
    ):
        """
        Tạo hoặc tái tạo collection (nếu recreate=True).
        """
        if recreate:
            self.client.recreate_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=vector_size, distance=distance)
            )
            print(f"♻️ Recreated collection '{self.collection_name}' with {vector_size} dims.")
        else:
            try:
                self.client.get_collection(self.collection_name)
                print(f"✅ Collection '{self.collection_name}' already exists.")
            except Exception:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(size=vector_size, distance=distance)
                )
                print(f"✨ Created new collection '{self.collection_name}' ({vector_size} dims).")

   
    def upsert_points(self, points: List[Dict[str, Any]]):
        """
        Upsert dữ liệu vector vào collection.
        points phải có dạng:
        [
          { "id": 1, "vector": [...], "payload": {...} },
          ...
        ]
        """
        qdrant_points = [
            models.PointStruct(id=p["id"], vector=p["vector"], payload=p["payload"])
            for p in points
        ]
        if not qdrant_points:
            print("⚠️ No points to upsert — skipping.")
            return

        self.client.upsert(collection_name=self.collection_name, points=qdrant_points)
        print(f"✅ Upserted {len(qdrant_points)} points into '{self.collection_name}'.")

    
    def search(
        self,
        question: str,
        limit: int = 3,
        score_threshold: Optional[float] = 0
    ) -> List[Dict[str, Any]]:
        """
        Truy vấn các vector gần nhất trong Qdrant.
        """
        query = refine_query_with_tfidf_mmr(question)
        query_vector = self.get_embedding(query)

        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=limit
        )

        formatted = []
        for r in results:
            if score_threshold and r.score < score_threshold:
                continue
            formatted.append({
                "id": r.id,
                "score": r.score,
                "payload": r.payload
            })

        print(f"🔍 Search returned {len(formatted)} results for question: '{question}'")
        return formatted

    
    def delete_collection(self):
        """Xoá collection hoàn toàn."""
        self.client.delete_collection(self.collection_name)
        print(f"🗑️ Deleted collection '{self.collection_name}'.")


def mmr_select(query_vec, candidate_vecs, λ=0.7, top_k=5):
    """Chọn top_k vector bằng Maximum Marginal Relevance"""
    sim_query = cosine_similarity([query_vec], candidate_vecs)[0]
    sim_cand = cosine_similarity(candidate_vecs)

    selected = []
    candidates = list(range(len(candidate_vecs)))

    while len(selected) < top_k and candidates:
        scores = [
            λ * sim_query[i] - (1 - λ) * max([sim_cand[i][j] for j in selected] or [0])
            for i in candidates
        ]
        chosen = candidates[np.argmax(scores)]
        selected.append(chosen)
        candidates.remove(chosen)

    return selected

def refine_query_with_tfidf_mmr(query: str, corpus: list[str] = None, top_n=10, λ=0.7) -> str:
    """
    Làm giàu query trước khi embedding:
    - TF-IDF để chọn cụm quan trọng
    - MMR để giữ các cụm đa dạng nhất
    """
    if corpus is None:
        corpus = [query]

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
    tfidf = vectorizer.fit_transform(corpus + [query])
    feature_names = vectorizer.get_feature_names_out()
    query_vec = tfidf[-1].toarray()[0]

    top_indices = np.argsort(query_vec)[::-1][:top_n]
    top_terms = [feature_names[i] for i in top_indices if query_vec[i] > 0]

    if not top_terms:
        return query  # fallback

    term_vecs = vectorizer.transform(top_terms).toarray()
    query_center = np.mean(term_vecs, axis=0)
    selected_ids = mmr_select(query_center, term_vecs, λ=λ, top_k=min(5, len(term_vecs)))

    selected_terms = [top_terms[i] for i in selected_ids]
    refined_query = query + ". " + ". ".join(selected_terms)
    return refined_query


# --------------------------------------------------------------------------
# 🧠 Example usage
# --------------------------------------------------------------------------
if __name__ == "__main__":
    service = QdrantService(
        url="http://34.87.152.106:6333",
        collection_name="toeic_speaking_knowledge"
    )

    # service.create_collection(vector_size=1024, recreate=False)

    # # Upsert example
    # service.upsert_points([
    #     {
    #         "id": 1,
    #         "vector": [0.1, 0.2, 0.3, 0.4] * 256,  # 1024 dims
    #         "payload": {"title": "Example", "content": "Hello Qdrant!"}
    #     }
    # ])

    # Search example
    result = service.search(question='what is hope?')
    print(result)
