from app.configs.model_config import Gemini
from app.prompts.base_prompt import BasePrompt
from app.prompts.toeic_prompt import TOEICPrompt
from app.models.state import State
from app.exceptions.chat_exception import (
    InvalidInputException,
    ModelNotFoundException,
)
from langchain.schema.messages import AIMessage, HumanMessage, SystemMessage
import numpy as np
from typing import List, Optional

# Optional sklearn imports with fallback
try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    TfidfVectorizer = None
    cosine_similarity = None
from app.services.qdrant_service import QdrantService
from app.models.message import MessageRole
from app.models import ChatMessage

try:
    from app.models.user_profile import SimpleUserProfile, get_personalization_context
    from app.services.db_profile_service import DatabaseProfileService
    PERSONALIZATION_AVAILABLE = True
except ImportError:
    PERSONALIZATION_AVAILABLE = False
    SimpleUserProfile = None
    get_personalization_context = None
    DatabaseProfileService = None
import re
import json
import ast
from app.db.session import get_db_session


class RouteNode:
    def __init__(self):
        try:
            self._gemini = Gemini()
            self._llm = self._gemini.llm()
            self._prompt = BasePrompt()
            self._toeic_prompt = TOEICPrompt()
            # self._chat = Chat()
            # self._llm_bind_tools = self._chat.get_llm_binds_tools()
            # self._tool_node = self._chat.get_tool_node()
            self._vector_service = QdrantService()
            self._vector_store = QdrantService().connect()
            # self._postgres = PostgresDatabase()
            # self._define_order = DefineOrder()
            self._db_session = get_db_session()
            
            # Database service for user profiles (optional)
            print("PERSONALIZATION_AVAILABLE:", PERSONALIZATION_AVAILABLE)
            print("self._db_session provided:", self._db_session is not None)
            if PERSONALIZATION_AVAILABLE and self._db_session:
                print("Initializing DatabaseProfileService with provided self._db_session")
                self._db_profile_service = DatabaseProfileService(self._db_session)
            else:
                self._db_profile_service = None
        except Exception as e:
            raise ModelNotFoundException(f"Failed to initialize chat models: {str(e)}")

    @staticmethod
    def _ai_to_json(ai: AIMessage):
        if hasattr(ai, "content"):
            content = ai.content
        elif isinstance(ai, str):
            content = ai
        else:
            raise InvalidInputException("Invalid AI message format")

        content = re.sub(r"^```json\n|```$", "", content.strip(), flags=re.MULTILINE)
        

        try:
            cleaned = content.strip().lstrip('{').rstrip('}')
            json_data = json.loads('{' + cleaned + '}')
            return json_data
        except json.JSONDecodeError as e:
            raise InvalidInputException(f"Failed to parse AI response as JSON: {str(e)}")
    

    @staticmethod
    def str_to_list_of_str(data_str):
        return [str(item) for item in ast.literal_eval(data_str)]

    def mmr_select(self, query_vec, candidate_vecs, λ=0.7, top_k=5):
        """Chọn top_k vector bằng Maximum Marginal Relevance"""
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

    def refine_query_with_tfidf_mmr(self, query: str, corpus: List[str] = None, top_n=10, λ=0.7) -> str:
        """
        Làm giàu query trước khi embedding:
        - TF-IDF để chọn cụm quan trọng
        - MMR để giữ các cụm đa dạng nhất
        - Tối ưu hóa cho TOEIC domain
        """
        if not SKLEARN_AVAILABLE or not query.strip():
            return query
        
        try:
            # TOEIC-specific corpus nếu không có corpus
            if corpus is None:
                toeic_corpus = [
                    "TOEIC listening comprehension practice",
                    "TOEIC reading comprehension strategies", 
                    "TOEIC grammar rules and examples",
                    "TOEIC vocabulary building exercises",
                    "TOEIC test preparation tips",
                    "TOEIC speaking practice methods",
                    "TOEIC writing skills improvement"
                ]
                corpus = toeic_corpus

            # Sử dụng english stopwords cho TOEIC content
            vectorizer = TfidfVectorizer(
                ngram_range=(1, 2), 
                stop_words='english',
                max_features=1000,  # Giới hạn features
                min_df=1,  # Cho phép terms xuất hiện ít
                lowercase=True
            )
            
            # Fit với corpus + query
            all_texts = corpus + [query]
            tfidf = vectorizer.fit_transform(all_texts)
            feature_names = vectorizer.get_feature_names_out()
            query_vec = tfidf[-1].toarray()[0]

            # Lấy top terms có TF-IDF cao
            top_indices = np.argsort(query_vec)[::-1][:top_n]
            top_terms = [feature_names[i] for i in top_indices if query_vec[i] > 0]

            if len(top_terms) < 2:
                return query  # Không đủ terms để refine

            # Transform terms thành vectors để áp dụng MMR
            term_vecs = vectorizer.transform(top_terms).toarray()
            query_center = np.mean(term_vecs, axis=0)
            
            # Sử dụng MMR để chọn diverse terms
            selected_ids = self.mmr_select(
                query_center, 
                term_vecs, 
                λ=λ, 
                top_k=min(5, len(term_vecs))
            )

            selected_terms = [top_terms[i] for i in selected_ids]
            
            # Tạo refined query với TOEIC context
            refined_query = f"{query}. Related TOEIC concepts: {', '.join(selected_terms)}"
            
            print(f"🔍 Query refinement: {query} -> {len(selected_terms)} terms added")
            return refined_query

        except Exception as e:
            print(f"❌ TF-IDF/MMR Error: {e}")
            return query  # Fallback về original query

    def get_user_profile(self, state: State):
        """
        Lấy user profile từ database dựa trên user_id
        """
        if not self._db_profile_service or not state.user_id:
            return None
        try:
            profile = self._db_profile_service.get_user_with_progress(state.user_id)
            return profile
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return None
    
    def personalized_similarity_search(self, state: State, user_profile=None):
        """
        Tìm các đoạn văn/ngữ cảnh liên quan từ Qdrant với personalization và TF-IDF/MMR enhancement
        """
        try:
            if not state.user_input or not isinstance(state.user_input, str):
                raise ValueError("User input invalid or empty")

            # Step 1: Refine query với TF-IDF và MMR
            refined_query = self.refine_query_with_tfidf_mmr(
                query=state.user_input,
                corpus=None,  # Sử dụng TOEIC corpus mặc định
                top_n=12,
                λ=0.7  # Balance between relevance và diversity
            )

            # Step 2: Enhanced search với refined query
            results = self._vector_service.search(
                question=refined_query,  # Sử dụng refined query thay vì original
                limit=8,  # Lấy nhiều hơn để có options tốt hơn
                score_threshold=0.25  # Threshold thấp hơn vì refined query tốt hơn
            )
            
            # Step 3: Filter và rank dựa trên user profile
            if user_profile and results:
                filtered_results = self._filter_results_by_profile(results, user_profile, state.user_input)
            else:
                filtered_results = results[:3]

            # Step 4: Extract content và update state
            retrieved = [r["payload"].get("content", "") for r in filtered_results]
            context_text = "\n".join(f"- {txt}" for txt in retrieved if txt)

            state.context = context_text or "Không tìm thấy thông tin phù hợp trong cơ sở dữ liệu."
            state.meta = getattr(state, "meta", {})
            state.meta["retrieved_docs"] = filtered_results
            state.meta["personalized"] = user_profile is not None
            state.meta["refined_query"] = refined_query  # Lưu refined query để debug
            state.meta["original_query"] = state.user_input

            print(f"✅ RAG Enhanced: {len(filtered_results)} docs retrieved")
            return state

        except Exception as e:
            state.context = "Không thể truy vấn ngữ cảnh."
            state.error.append(str(e))
            print(f"❌ RAG Error: {e}")
            return state
    
    def similarity_search(self, state: State):
        """
        Backward compatibility wrapper
        """
        user_profile = self.get_user_profile(state)
        return self.personalized_similarity_search(state, user_profile)

    def route(self, state: State):
        decision = self._llm.invoke([
            SystemMessage(content=self._prompt.route_instructions),
            HumanMessage(content=state.user_input),
        ])

        state.next_state = self._ai_to_json(decision).get("datasource")

        if state.next_state == "tools" and not state.is_relevant:
            return {"next_state": "generate"}

        return {"next_state": state.next_state}

    def summarize_history(self, state: State):
        try:
            summarize_prompt = self._prompt.summarize_history

            result = self._llm.invoke([
                SystemMessage(content=summarize_prompt),
                *state.chat_history,
                HumanMessage(content=state.user_input),
            ])

            state.context = result.content.strip() if hasattr(result, "content") else str(result)

            if not state.context:
                state.context = "Không có thông tin tranh cụ thể."
            return state

        except Exception as e:
            state.context = "Không có thông tin tranh cụ thể."
            state.error.append(str(e))
            return state

    def evaluate_history(self, state: State):
        prompt = self._prompt.evaluate_history.format(
            user_input=state.user_input,
            history=state.context,
        )

        decision = self._llm.invoke([
            SystemMessage(content=prompt),
            *state.chat_history,  
            HumanMessage(content=state.user_input),
        ])

        try:
            result = self._ai_to_json(decision)
        except InvalidInputException:
            result = None

        if not result or not isinstance(result, dict):
            state.final_generation = decision.content
            state.next_state = "end"
            return state

        state.next_state = "generate" if result.get("datasource") in [True, "true"] else "summarize_history"
        return state
    
    def generate(self, state: State):
        # Get user profile
        user_profile = self.get_user_profile(state)
        print("User profile:", user_profile)
        
        # Personalized similarity search
        self.personalized_similarity_search(state, user_profile)
        
        # Get personalization context
        personalization_ctx = {}
        if user_profile:
            personalization_ctx = get_personalization_context(user_profile)
            # Update user progress based on interaction
            self._update_user_interaction(state, user_profile)
        
        # Enhanced prompt with personalization
        user_name = personalization_ctx.get("user_name", "bạn")
        prompt = self._get_personalized_prompt(
            state.user_input,
            state.context,
            user_profile,
            personalization_ctx
        )

        generation = self._llm.invoke([
            SystemMessage(content=prompt),
            *state.chat_history,
            HumanMessage(content=state.user_input),
        ])

        state.final_generation = generation.content
        state.chat_history += [HumanMessage(content=state.user_input), generation]
        
        # Save enhanced metadata
        state.meta = state.meta or {}
        state.meta["personalized"] = user_profile is not None
        state.meta["user_profile"] = {
            "learning_style": personalization_ctx.get("learning_style", "balanced"),
            "difficulty": personalization_ctx.get("difficulty_level", "intermediate")
        } if user_profile else None
        
        # self._save_chat(state)
        return state

    def _filter_results_by_profile(self, results: List, user_profile, user_input: str) -> List:
        """
        Filter và rank kết quả RAG dựa trên user profile
        """
        try:
            scored_results = []
            
            for result in results:
                content = result.get("payload", {}).get("content", "")
                base_score = result.get("score", 0)
                
                # Bonus score dựa trên user's weak areas
                bonus_score = 0
                content_lower = content.lower()
                
                # Nếu nội dung liên quan đến skill yếu của user
                for skill, level in user_profile.skill_levels.items():
                    if skill.lower() in content_lower and level < 0.5:
                        bonus_score += 0.1  # Bonus cho weak skills
                
                # Nếu nội dung phù hợp với learning style
                if user_profile.learning_style.value == "visual" and any(
                    word in content_lower for word in ["image", "chart", "diagram", "visual"]
                ):
                    bonus_score += 0.05
                elif user_profile.learning_style.value == "auditory" and any(
                    word in content_lower for word in ["listen", "audio", "pronunciation", "sound"]
                ):
                    bonus_score += 0.05
                
                final_score = base_score + bonus_score
                scored_results.append((final_score, result))
            
            # Sort by final score và return top 3
            scored_results.sort(key=lambda x: x[0], reverse=True)
            return [result for _, result in scored_results[:3]]
            
        except Exception as e:
            print(f"Error filtering results: {e}")
            return results[:3]
    
    def _get_personalized_prompt(self, user_input: str, context: str, user_profile: any, personalization_ctx: dict) -> str:
        """
        Tạo personalized prompt dựa trên user profile - short, friendly English responses
        """
        if not user_profile:
            
            return self._toeic_prompt.get_basic_prompt(user_input, context)
        
        return self._toeic_prompt.get_personalized_prompt(user_input, context, user_profile, personalization_ctx)
    
    def _update_user_interaction(self, state: State, user_profile: any):
        """
        Cập nhật thông tin tương tác của user
        """
        try:
            if not self._db_profile_service:
                return
            
            # Phân tích input để xác định skill đang practice
            user_input_lower = state.user_input.lower()
            skill_keywords = {
                "grammar": ["grammar", "tense", "verb", "sentence", "structure"],
                "vocabulary": ["vocabulary", "word", "meaning", "definition"], 
                "pronunciation": ["pronunciation", "pronounce", "speak", "sound"],
                "listening": ["listening", "listen", "hear", "audio"]
            }
            
            # Tìm skills được practice trong interaction này
            practiced_skills = []
            for skill, keywords in skill_keywords.items():
                if any(keyword in user_input_lower for keyword in keywords):
                    practiced_skills.append(skill)
            
            # Cập nhật progress cho các skills được practice
            if practiced_skills:
                skill_updates = {}
                for skill in practiced_skills:
                    current_level = user_profile.skill_levels.get(skill, 0.0)
                    # Tăng nhẹ progress (0.01 = 1%)
                    new_level = min(1.0, current_level + 0.01)
                    skill_updates[skill] = new_level
                
                # Update database
                self._db_profile_service.update_user_progress(state.user_id, skill_updates)
                
                # Update local profile
                user_profile.skill_levels.update(skill_updates)
                user_profile.total_conversations += 1
        
        except Exception as e:
            print(f"Error updating user interaction: {e}")

    # def using_tools(self, state: State):
    #     if not state.user_input or not isinstance(state.user_input, str) or not state.user_input.strip():
    #         raise ValueError("User input is empty or invalid. Please provide a valid input.")

    #     tool_prompt = self._prompt.using_tools_prompt.format(
    #         user_id=state.user_id,
    #         user_input=state.user_input,
    #     )

    #     result = self._llm_bind_tools.invoke([
    #         SystemMessage(content=tool_prompt),
    #         HumanMessage(content=state.user_input),
    #     ])

    #     if not result.tool_calls or len(result.tool_calls) == 0:
    #         state.error.append("No tool calls found in the result.")
    #         state.final_generation = "Không tìm thấy thông tin phù hợp."
    #         return state
    #     tool_call = result.tool_calls[0]
    #     tool_call = self.normalize_tool_args(tool_call)
    #     tool_call = self.normalize_keywords(tool_call, state)

    #     # print("Cleaned keywords:", tool_call["args"]["keyword"])


    #     ai_msg = AIMessage(
    #         content=result.content,
    #         additional_kwargs=result.additional_kwargs,
    #         tool_calls=[tool_call]
    #     )

    #     final_result = self._tool_node.invoke([ai_msg])

    #     prompt_map = {
    #         "search_paintings_by_keyword": self._prompt.search_paintings_prompt,
    #         "order_painting": self._prompt.order_prompt,
    #         "get_size_available": self._prompt.size_prompt,
    #         "get_category_available": self._prompt.category_prompt,
    #         "get_coupons_available": self._prompt.coupon_prompt,
    #         "search_popular_paintings": self._prompt.search_paintings_prompt,
    #         "get_price_available": self._prompt.price_prompt
    #     }

    #     prompt_template = prompt_map.get(tool_call['name'], self._prompt.generate_prompt)

    #     convert_prompt = prompt_template.format(
    #         tool_run=final_result,
    #         history=state.context,
    #         question=state.user_input,
    #         context=state.context
    #     )

    #     generation = self._llm.invoke([
    #         SystemMessage(content=convert_prompt),
    #         HumanMessage(content=state.user_input),
    #     ])


    #     state.final_generation = generation.content
    #     state.chat_history += [HumanMessage(content=state.user_input), generation]
    #     self._save_chat(state)
    #     state.next_state = "end"
    #     return state

    

    # def normalize_tool_args(self, tool_call):
    #     args = tool_call.get("args", {})
    #     state = args.get("state", {})

    #     # Bỏ chat_history vì LLM có lúc nhồi list object vào
    #     if "chat_history" in state:
    #         state.pop("chat_history")

    #     # Nếu cần bạn có thể filter thêm field không mong muốn khác
    #     # state = {k: v for k, v in state.items() if k in {"user_id", "user_input", "search_params"}}

    #     args["state"] = state
    #     tool_call["args"] = args
    #     return tool_call

    # def is_context_relevant(self, state: State) -> bool:
    #     check_prompt = self._prompt.check_context_relevance.format(
    #         context=state.context or "Không có",
    #         question=state.user_input
    #     )

    #     result = self._llm.invoke([
    #         SystemMessage(content=check_prompt),
    #         HumanMessage(content=state.user_input),
    #     ])

    #     answer = result.content.strip().lower()
    #     if answer == "yes":
    #         state.is_relevant = True
    #     else:
    #         state.is_relevant = False
    #     return state

    # def normalize_keywords(self, tool_call, state):
    #     """
    #     Chuẩn hóa keyword trong tool_call:
    #     - Bỏ stopword 'tranh', 'bức tranh' ở đầu.
    #     - Nếu không có keyword mới thì fallback sang state.last_keywords.
    #     - Nếu tool không có args.keyword thì bỏ qua.
    #     """
    #     def clean_kw(kw: str) -> str:
    #         kw = kw.strip()
    #         # bỏ "tranh" hoặc "bức tranh" ở đầu (case-insensitive)
    #         kw = re.sub(r'^(tranh|bức tranh)\s+', '', kw, flags=re.IGNORECASE)
    #         return kw.strip()

    #     # Nếu tool không có args hoặc không có keyword thì bỏ qua
    #     if not tool_call.get("args") or "keyword" not in tool_call["args"]:
    #         return tool_call  

    #     new_keywords = tool_call["args"].get("keyword", [])
    #     if isinstance(new_keywords, str):
    #         new_keywords = [new_keywords]

    #     clean_keywords = [clean_kw(kw) for kw in new_keywords if clean_kw(kw)]

    #     if clean_keywords:
    #         state.last_keywords = clean_keywords
    #         tool_call["args"]["keyword"] = clean_keywords
    #     else:
    #         if state.last_keywords:
    #             tool_call["args"]["keyword"] = state.last_keywords

    #     return tool_call
 
