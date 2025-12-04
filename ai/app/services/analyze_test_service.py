"""
Standalone service for analyzing TOEIC test results with personalization support.
This service uses utilities from RouteNode but is independent from chat workflow.
"""

from typing import Dict, Any, Optional, List
from app.configs.model_config import Gemini
from app.services.qdrant_service import QdrantService
from app.db.session import get_db_session
import json
import re

try:
    from app.models.user_profile import get_personalization_context
    from app.services.db_profile_service import DatabaseProfileService
    PERSONALIZATION_AVAILABLE = True
except ImportError:
    PERSONALIZATION_AVAILABLE = False
    get_personalization_context = None
    DatabaseProfileService = None

# Optional sklearn imports for TF-IDF/MMR
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    TfidfVectorizer = None
    cosine_similarity = None
    np = None


class AnalyzeTestService:
    """
    Standalone service for analyzing TOEIC test results.
    Provides personalized feedback based on user profile and RAG-enhanced context.
    """
    
    def __init__(self):
        """Initialize the service with AI model and supporting services."""
        try:
            self._gemini = Gemini()
            self._llm = self._gemini.llm()
            self._vector_service = QdrantService()
            self._db_session = get_db_session()
            
            # Initialize profile service if available
            if PERSONALIZATION_AVAILABLE and self._db_session:
                self._db_profile_service = DatabaseProfileService(self._db_session)
            else:
                self._db_profile_service = None
                
        except Exception as e:
            raise Exception(f"Failed to initialize AnalyzeTestService: {str(e)}")
    
    def _refine_query_with_tfidf_mmr(self, query: str, corpus: List[str] = None, top_n=10, λ=0.7) -> str:
        """
        Enhance query using TF-IDF and MMR for better RAG results.
        Reused from RouteNode implementation.
        """
        if not SKLEARN_AVAILABLE or not query.strip():
            return query
        
        try:
            # TOEIC-specific corpus
            if corpus is None:
                toeic_corpus = [
                    "TOEIC listening comprehension practice",
                    "TOEIC reading comprehension strategies", 
                    "TOEIC grammar rules and examples",
                    "TOEIC vocabulary building exercises",
                    "TOEIC test preparation tips",
                    "TOEIC common mistakes and patterns",
                    "TOEIC score improvement strategies"
                ]
                corpus = toeic_corpus

            vectorizer = TfidfVectorizer(
                ngram_range=(1, 2), 
                stop_words='english',
                max_features=1000,
                min_df=1,
                lowercase=True
            )
            
            all_texts = corpus + [query]
            tfidf = vectorizer.fit_transform(all_texts)
            feature_names = vectorizer.get_feature_names_out()
            query_vec = tfidf[-1].toarray()[0]

            # Get top terms
            top_indices = np.argsort(query_vec)[::-1][:top_n]
            top_terms = [feature_names[i] for i in top_indices if query_vec[i] > 0]

            if len(top_terms) < 2:
                return query

            # Apply MMR for diversity
            term_vecs = vectorizer.transform(top_terms).toarray()
            query_center = np.mean(term_vecs, axis=0)
            
            selected_ids = self._mmr_select(
                query_center, 
                term_vecs, 
                λ=λ, 
                top_k=min(5, len(term_vecs))
            )

            selected_terms = [top_terms[i] for i in selected_ids]
            refined_query = f"{query}. Related TOEIC concepts: {', '.join(selected_terms)}"
            
            print(f"🔍 Query refinement: {query} -> {len(selected_terms)} terms added")
            return refined_query

        except Exception as e:
            print(f"❌ TF-IDF/MMR Error: {e}")
            return query
    
    def _mmr_select(self, query_vec, candidate_vecs, λ=0.7, top_k=5):
        """Maximum Marginal Relevance selection for diversity."""
        if not SKLEARN_AVAILABLE:
            return list(range(min(top_k, len(candidate_vecs))))
        
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
    
    def _get_user_profile(self, user_id: str):
        """Get user profile from database."""
        if not self._db_profile_service or not user_id:
            return None
        try:
            profile = self._db_profile_service.get_user_with_progress(user_id)
            return profile
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return None
    
    def _search_context(self, query: str) -> str:
        """Search for relevant TOEIC context using RAG with enhancement."""
        try:
            # Refine query with TF-IDF/MMR
            refined_query = self._refine_query_with_tfidf_mmr(
                query=query,
                corpus=None,
                top_n=12,
                λ=0.7
            )

            # Search Qdrant
            results = self._vector_service.search(
                question=refined_query,
                limit=5,
                score_threshold=0.3
            )
            
            # Extract content
            retrieved = [r["payload"].get("content", "") for r in results]
            context_text = "\n".join(f"- {txt}" for txt in retrieved if txt)
            
            return context_text or "No specific context found."
            
        except Exception as e:
            print(f"❌ RAG Error: {e}")
            return "No context available."
    
    def _create_analysis_prompt(self, test_data: dict, context: str, user_profile=None) -> str:
        """Create personalized analysis prompt."""
        
        # Base prompt
        base_prompt = """
Bạn là một **chuyên gia TOEIC và trợ lý học tập thông minh**. 
Nhiệm vụ của bạn là **phân tích kết quả làm bài TOEIC của người học** bên dưới và **trả về phản hồi bằng JSON, viết hoàn toàn bằng tiếng Việt**.

Cấu trúc của bài thi TOEIC gồm hai phần (điểm tối đa 990): Listening (điểm tối đa 495) và Reading (điểm tối đa 495).
"""
        
        # Add personalization if available
        if user_profile and PERSONALIZATION_AVAILABLE:
            personalization_ctx = get_personalization_context(user_profile)
            user_name = user_profile.display_name if hasattr(user_profile, 'display_name') else "bạn"
            learning_style = personalization_ctx.get("learning_style", "balanced")
            skill_focus = personalization_ctx.get("skill_focus", [])
            
            base_prompt += f"""
**Thông tin người học:**
- Tên: {user_name}
- Phong cách học: {learning_style}
- Kỹ năng cần tập trung: {', '.join(skill_focus) if skill_focus else 'Chưa xác định'}

Hãy cá nhân hóa feedback dựa trên thông tin này.
"""
        
        base_prompt += f"""
**Ngữ cảnh tham khảo từ cơ sở dữ liệu:**
{context}

Phân tích của bạn cần:
- Đánh giá điểm mạnh, điểm yếu của người học theo từng kỹ năng (Listening, Reading, và kỹ năng con).
- Phát hiện các mẫu lỗi thường gặp (ví dụ: ngữ pháp, từ vựng, suy luận, nghe nhầm từ khóa...).
- Giải thích ngắn gọn nhưng sâu sắc, giúp người học hiểu nguyên nhân sai.
- Đưa ra các gợi ý học tập cụ thể (như "luyện Part 3 - hội thoại có 3 người nói", hoặc "ôn lại cấu trúc giới từ chỉ nguyên nhân").

Kết quả trả về phải đúng cấu trúc sau:
{{
  "summary": {{
    "totalScore": number, // tổng điểm (0-990)
    "listeningScore": number, // điểm Listening (0-495)
    "readingScore": number, // điểm Reading (0-495)
    "accuracy": string, // độ chính xác chung (%)
    "comment": string // nhận xét tổng quan về bài thi
  }},
  "weakSkills": [string], // liệt kê kỹ năng yếu
  "mistakePatterns": [string], // mô tả dạng lỗi phổ biến
  "recommendations": [string] // gợi ý học tập cụ thể, rõ ràng
}}

Hãy viết phản hồi bằng **tiếng Việt tự nhiên, thân thiện, khích lệ người học**, không dùng thuật ngữ quá hàn lâm.

**Dữ liệu cần phân tích:**
{json.dumps(test_data, ensure_ascii=False, indent=2)}
"""
        
        return base_prompt
    
    def _parse_ai_response(self, response_text: str) -> dict:
        """Parse and clean AI response."""
        try:
            if not response_text or not response_text.strip():
                raise Exception("AI response is empty")
            
            # Log the raw response for debugging
            print(f"📝 Raw AI response (first 500 chars): {response_text[:500]}")
            
            # Try to extract JSON from markdown code block first
            json_match = re.search(r'```json\s*\n(.*?)\n```', response_text, re.DOTALL)
            if json_match:
                cleaned = json_match.group(1).strip()
                print(f"✅ Extracted JSON from markdown code block")
            else:
                # Fallback: remove markdown code blocks if present
                cleaned = re.sub(r"^```json\n|```$", "", response_text.strip(), flags=re.MULTILINE)
                print(f"⚠️ No markdown code block found, using fallback cleaning")
            
            # Try to parse JSON
            result = json.loads(cleaned)
            print(f"✅ Successfully parsed JSON")
            return result
            
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {str(e)}")
            print(f"📄 Failed response text: {response_text[:1000]}")
            raise Exception(f"Failed to parse AI response as JSON: {str(e)}")
        except Exception as e:
            print(f"❌ Unexpected error in parsing: {str(e)}")
            raise Exception(f"Failed to parse AI response: {str(e)}")
    
    async def analyze_test_result(
        self, 
        test_data: dict, 
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze TOEIC test results with optional personalization.
        
        Args:
            test_data: Test results including scores, answers, questions
            user_id: Optional user ID for personalization
            
        Returns:
            Structured analysis result with summary, weak skills, patterns, and recommendations
        """
        try:
            # Get user profile if available
            user_profile = None
            if user_id:
                user_profile = self._get_user_profile(user_id)
            
            # Search for relevant context
            search_query = f"TOEIC test analysis common mistakes patterns score {test_data.get('totalScore', 0)}"
            context = self._search_context(search_query)
            
            # Create personalized prompt
            prompt = self._create_analysis_prompt(test_data, context, user_profile)
            
            # Call Gemini for analysis
            from langchain.schema.messages import HumanMessage
            result = self._llm.invoke([HumanMessage(content=prompt)])
            
            # Parse response
            analysis = self._parse_ai_response(result.content)
            
            # Add metadata
            analysis["metadata"] = {
                "personalized": user_profile is not None,
                "user_id": user_id,
                "context_used": bool(context and context != "No context available.")
            }
            
            return analysis
            
        except Exception as e:
            print(f"❌ Analysis failed: {e}")
            raise Exception(f"Failed to analyze test result: {str(e)}")
