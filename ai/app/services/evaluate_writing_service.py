"""
Standalone service for evaluating TOEIC writing with personalization support.
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
    from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
    from sklearn.metrics.pairwise import cosine_similarity
    import numpy as np
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    TfidfVectorizer = None
    cosine_similarity = None
    np = None


class EvaluateWritingService:
    """
    Standalone service for evaluating TOEIC writing.
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
            raise Exception(f"Failed to initialize EvaluateWritingService: {str(e)}")
    
    def _refine_query_with_tfidf_mmr(self, query: str, corpus: List[str] = None, top_n=10, λ=0.7) -> str:
        """
        Làm giàu query:
        - TF-IDF lấy keywords quan trọng
        - MMR chọn keywords đa dạng
        - Loại bỏ conversational noise (hello, tuki, don know...)
        """
        if not SKLEARN_AVAILABLE or not query.strip():
            return query

        try:
            # ---------------------------
            # 1. STOPWORDS TÙY CHỈNH
            # ---------------------------
            custom_stopwords = {
                "hello", "hi", "hey", "tuki",
                "don", "dont", "don't", "know", "i", "me",
                "please", "tell", "explain", "help",
                "what", "how", "why", "when", "where", "who",
                "idk", "ok", "okay", "yeah", "yep",
                "uh", "um", "hmm"
            }

            stopwords = list(ENGLISH_STOP_WORDS.union(custom_stopwords))

            # ---------------------------
            # 2. CORPUS TOEIC mặc định
            # ---------------------------
            if corpus is None:
                corpus = [
                    "TOEIC listening comprehension practice",
                    "TOEIC reading comprehension strategies",
                    "TOEIC grammar rules and examples",
                    "TOEIC vocabulary building exercises",
                    "TOEIC test preparation tips",
                    "TOEIC speaking practice methods",
                    "TOEIC writing skills improvement"
                ]

            # ---------------------------
            # 3. TF-IDF CLEAN + UNIGRAM
            # ---------------------------
            vectorizer = TfidfVectorizer(
                ngram_range=(1, 1),      # chỉ lấy unigram → tránh bigram rác
                stop_words=stopwords,
                max_features=500,
                lowercase=True
            )

            all_texts = corpus + [query]
            tfidf = vectorizer.fit_transform(all_texts)

            feature_names = vectorizer.get_feature_names_out()
            query_vec = tfidf[-1].toarray()[0]

            # Top TF-IDF terms
            top_indices = np.argsort(query_vec)[::-1][:top_n]
            top_terms = [feature_names[i] for i in top_indices if query_vec[i] > 0]

            if len(top_terms) < 2:
                return query

            # ---------------------------
            # 4. MMR CHỌN KEYWORDS CHÍNH
            # ---------------------------
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

            print(f"🔍 Query refinement: {selected_terms} -> {len(selected_terms)} terms added")
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
        """Search for relevant TOEIC writing context using RAG with enhancement."""
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
    
    def _create_evaluation_prompt(
        self, 
        writing_type: str,
        content: str, 
        metadata: dict,
        context: str, 
        user_profile=None
    ) -> str:
        """Create personalized evaluation prompt based on writing type."""
        
        # Type-specific prompts
        type_prompts = {
            "email-response": """
Bạn là một **giám khảo chấm thi TOEIC Writing chuyên nghiệp** (nghiêm khắc và chuẩn xác).

Nhiệm vụ: **Đánh giá bài viết phản hồi email** (Email 2) dựa trên email nhận được (Email 1) và yêu cầu đề bài.

**Thông tin đề bài:**
1. **Email nhận được (Context):**
{context_info}

2. **Yêu cầu cho email phản hồi (Topic):**
{topic}

**Bài làm của thí sinh (Email 2):**
{title}
{content}

**Yêu cầu đánh giá:**
- Bài viết (Email 2) phải phản hồi phù hợp với nội dung Email 1.
- Bài viết phải đáp ứng ĐỦ và ĐÚNG các yêu cầu trong phần Topic (ví dụ: đặt câu hỏi, đưa ra thông tin...).
- **CHẤM ĐIỂM NGHIÊM KHẮC**: Không chấm nương tay. Điểm số phải phản ánh đúng trình độ thực tế.
    - Điểm cao (80-100): Hoàn hảo về ngữ pháp, từ vựng cao cấp, mạch lạc, đáp ứng mọi yêu cầu, văn phong chuyên nghiệp.
    - Điểm khá (60-79): Có lỗi nhỏ nhưng không ảnh hưởng hiểu, đáp ứng yêu cầu chính, từ vựng khá.
    - Điểm trung bình (40-59): Có lỗi ngữ pháp/từ vựng đáng kể, thiếu ý hoặc diễn đạt lủng củng.
    - Điểm thấp (<40): Lạc đề, sai ngữ pháp nghiêm trọng, không hiểu đề.

**Tiêu chí đánh giá chi tiết (thang điểm 0-100):**
1. **Content**: Mức độ hoàn thành yêu cầu (Task Fulfillment). Có trả lời đúng Email 1 và làm đủ yêu cầu Topic không?
2. **Structure**: Bố cục email (Chào hỏi - Mở đầu - Nội dung chính - Kết thúc - Ký tên). Mạch lạc và liên kết.
3. **Vocabulary**: Sự đa dạng và chính xác của từ vựng. Tránh lặp từ. Dùng đúng từ vựng thương mại/công sở.
4. **Grammar**: Độ chính xác ngữ pháp và sự đa dạng cấu trúc câu.
5. **Style**: Văn phong (Tone) có phù hợp không (trang trọng/thân mật tùy ngữ cảnh).
6. **Effectiveness**: Hiệu quả giao tiếp. Người nhận có hiểu rõ và hài lòng không?
""",
            "opinion-essay": """
Bạn là một **giáo viên tiếng Anh chuyên nghiệp** có kinh nghiệm đánh giá TOEIC Writing và IELTS Writing.

Nhiệm vụ: **Đánh giá chi tiết bài viết nêu quan điểm** theo tiêu chuẩn TOEIC Writing Task 2.

**Bài viết cần đánh giá:**
{title}
{topic}
{context_info}
{required_length}

**Nội dung bài viết:**
{content}

**Tiêu chí đánh giá chung (thang điểm 0–100):**
1. **Content**: Bài viết phản hồi đầy đủ và chính xác theo ngữ cảnh, thể hiện quan điểm rõ ràng
2. **Structure**: Mạch lạc, có bố cục rõ ràng (mở bài – thân bài – kết luận)
3. **Vocabulary**: Từ vựng đa dạng, chính xác, phù hợp với ngữ cảnh
4. **Grammar**: Cấu trúc ngữ pháp chính xác, linh hoạt
5. **Style**: Giọng văn phù hợp với thể loại bài
6. **Effectiveness**: Lập luận thuyết phục, có ví dụ hợp lý
""",
            "describe-picture": """
Bạn là một **giáo viên tiếng Anh chuyên nghiệp** có kinh nghiệm đánh giá **TOEIC Writing Task 1 (mô tả tranh)**.

Nhiệm vụ: **Đánh giá chi tiết bài viết mô tả tranh** theo tiêu chuẩn TOEIC Writing Task 1.

**Thông tin bài viết cần đánh giá:**
{title}
{topic}
{context_info}
{required_length}
{sample_answer}

**Nội dung bài viết:**
{content}

**Tiêu chí đánh giá chung (thang điểm 0–100):**
1. **Content**: Mô tả được các chi tiết chính của bức tranh
2. **Organization**: Bài viết có bố cục rõ ràng, trình tự hợp lý
3. **Vocabulary**: Sử dụng từ vựng đa dạng, chính xác
4. **Grammar**: Dùng cấu trúc ngữ pháp chính xác, linh hoạt
5. **Style**: Ngôn ngữ tự nhiên, phù hợp với văn phong miêu tả
6. **Clarity & Fluency**: Câu văn trôi chảy, dễ hiểu
"""
        }
        
        # Get base prompt for type
        base_prompt = type_prompts.get(writing_type, type_prompts["opinion-essay"])
        
        # Format with metadata
        title = f"Subject: {metadata.get('title')}" if metadata.get('title') else ""
        # Topic là yêu cầu đề bài
        topic = metadata.get('topic', "Không có yêu cầu cụ thể")
        # Context là nội dung email nhận được
        context_info = metadata.get('context', "Không có nội dung email gốc")
        
        required_length = f"Số từ yêu cầu: {metadata.get('requiredLength')}" if metadata.get('requiredLength') else ""
        sample_answer = f"Đáp án mẫu: {metadata.get('sampleAnswer')}" if metadata.get('sampleAnswer') else ""
        
        base_prompt = base_prompt.format(
            title=title,
            content=content,
            topic=topic,
            context_info=context_info,
            required_length=required_length,
            sample_answer=sample_answer
        )
        
        # Add personalization if available
        if user_profile and PERSONALIZATION_AVAILABLE:
            personalization_ctx = get_personalization_context(user_profile)
            user_name = user_profile.display_name if hasattr(user_profile, 'display_name') else "bạn"
            learning_style = personalization_ctx.get("learning_style", "balanced")
            personality_type = personalization_ctx.get("personality", "encouraging")
            
            base_prompt += f"""

**Thông tin người học:**
- Tên: {user_name}
- Phong cách học: {learning_style}
- Tính cách: {personality_type}

Hãy cá nhân hóa feedback theo phong cách {personality_type} và phù hợp với người học {learning_style}.
"""
        
        base_prompt += f"""

**Ngữ cảnh tham khảo từ cơ sở dữ liệu:**
{context}

**Yêu cầu phản hồi:**
- Đánh giá khách quan, công bằng
- Phản hồi xây dựng và khích lệ
- Cung cấp ví dụ cải thiện cụ thể
- Ước tính điểm TOEIC Writing (scale 0-200)

Trả về JSON theo cấu trúc:
{{
  "type": "{writing_type}",
  "overallScore": number,
  "breakdown": {{
    "content": number,
    "structure": number,
    "vocabulary": number,
    "grammar": number,
    "style": number,
    "effectiveness": number
  }},
  "strengths": [string],
  "weaknesses": [string],
  "grammarErrors": [
    {{
      "type": string,
      "error": string,
      "correction": string,
      "explanation": string
    }}
  ],
  "vocabularyFeedback": {{
    "range": number,
    "accuracy": number,
    "appropriateness": number,
    "improvements": [
      {{
        "original": string,
        "suggested": string,
        "reason": string
      }}
    ]
  }},
  "structureAnalysis": {{
    "organization": number,
    "flow": number,
    "transitions": number,
    "feedback": string
  }},
  "improvementSuggestions": [string],
  "rewrittenVersion": string (optional),
  "estimatedTOEICScore": number
}}
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
    
    def _update_user_writing_progress(self, user_id: str, evaluation: dict):
        """Update user's writing skill progress based on evaluation."""
        try:
            if not self._db_profile_service or not user_id:
                return
            
            # Calculate progress increment based on score
            overall_score = evaluation.get("overallScore", 0)
            progress_increment = 0.01 if overall_score >= 70 else 0.005
            
            # Update writing skill
            skill_updates = {
                "writing": progress_increment
            }
            
            # Also update grammar/vocabulary if scores are good
            breakdown = evaluation.get("breakdown", {})
            if breakdown.get("grammar", 0) >= 70:
                skill_updates["grammar"] = progress_increment * 0.5
            if breakdown.get("vocabulary", 0) >= 70:
                skill_updates["vocabulary"] = progress_increment * 0.5
            
            self._db_profile_service.update_user_progress(user_id, skill_updates)
            print(f"✅ Updated writing progress for user {user_id}")
            
        except Exception as e:
            print(f"Error updating writing progress: {e}")
    
    async def evaluate_writing(
        self, 
        content: str,
        writing_type: str,
        metadata: Optional[dict] = None,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Evaluate TOEIC writing with optional personalization.
        
        Args:
            content: The writing content to evaluate
            writing_type: Type of writing (email-response, opinion-essay, describe-picture)
            metadata: Additional metadata (title, topic, context, etc.)
            user_id: Optional user ID for personalization
            
        Returns:
            Structured evaluation result with scores, feedback, and suggestions
        """
        try:
            # Validate writing type
            valid_types = ["email-response", "opinion-essay", "describe-picture"]
            if writing_type not in valid_types:
                raise ValueError(f"Invalid writing type. Must be one of: {valid_types}")
            
            # Default metadata
            if metadata is None:
                metadata = {}
            
            # Get user profile if available
            user_profile = None
            if user_id:
                user_profile = self._get_user_profile(user_id)
            
            # Search for relevant context
            search_query = f"TOEIC writing {writing_type} evaluation criteria examples guidelines"
            context = self._search_context(search_query)
            
            # Create personalized prompt
            prompt = self._create_evaluation_prompt(
                writing_type, content, metadata, context, user_profile
            )
            
            print(f"🤖 Calling Gemini for writing evaluation...")
            print(f"📊 Writing type: {writing_type}, Content length: {len(content)} chars")
            
            # Call Gemini for evaluation
            from langchain.schema.messages import HumanMessage
            result = self._llm.invoke([HumanMessage(content=prompt)])
            
            print(f"✅ Gemini response received, length: {len(result.content) if result.content else 0} chars")
            
            # Parse response
            evaluation = self._parse_ai_response(result.content)
            
            # Update user progress if user_id provided
            if user_id:
                self._update_user_writing_progress(user_id, evaluation)
            
            # Add metadata
            evaluation["metadata"] = {
                "personalized": user_profile is not None,
                "user_id": user_id,
                "context_used": bool(context and context != "No context available."),
                "writing_type": writing_type
            }
            
            return evaluation
            
        except Exception as e:
            print(f"❌ Evaluation failed: {e}")
            raise Exception(f"Failed to evaluate writing: {str(e)}")
