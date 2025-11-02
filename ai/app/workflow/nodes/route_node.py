from app.configs.model_config import Gemini
from app.prompts.base_prompt import BasePrompt
from app.models.state import State
from app.exceptions.chat_exception import (
    InvalidInputException,
    ModelNotFoundException,
)
from langchain.schema.messages import AIMessage, HumanMessage, SystemMessage
import numpy as np
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
# from app.workflow.tools.chat_tools import Chat
# from app.constants.define_order import DefineOrder
# from app.database import PineconeDatabase, PostgresDatabase
from app.services.qdrant_service import QdrantService
from app.models.message import MessageRole
from app.models import ChatMessage
import re
import json
import ast


class RouteNode:
    def __init__(self):
        try:
            self._gemini = Gemini()
            self._llm = self._gemini.llm()
            self._prompt = BasePrompt()
            # self._chat = Chat()
            # self._llm_bind_tools = self._chat.get_llm_binds_tools()
            # self._tool_node = self._chat.get_tool_node()
            self._vector_service = QdrantService()
            self._vector_store = QdrantService().connect()
            # self._postgres = PostgresDatabase()
            # self._define_order = DefineOrder()
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

    def similarity_search(self, state: State):
        """
        Tìm các đoạn văn/ngữ cảnh liên quan từ Qdrant để hỗ trợ RAG.
        """
        try:
            if not state.user_input or not isinstance(state.user_input, str):
                raise ValueError("User input invalid or empty")

            results = self._vector_service.search(
                question=state.user_input,
                limit=3,
                score_threshold=0.4  
            )

            retrieved = [r["payload"].get("content", "") for r in results]
            context_text = "\n".join(f"- {txt}" for txt in retrieved if txt)

            state.context = context_text or "Không tìm thấy thông tin phù hợp trong cơ sở dữ liệu."
            state.meta = getattr(state, "meta", {})
            state.meta["retrieved_docs"] = results

            return state

        except Exception as e:
            state.context = "Không thể truy vấn ngữ cảnh."
            state.error.append(str(e))
            print(f"❌ RAG Error: {e}")
            return state

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
        self.similarity_search(state)

        prompt = self._prompt.generate_prompt.format(
            question=state.user_input,
            context=state.context,
            history=[],
            meta=state.meta,
            user_name="Tu",
            errors=""
        )

        generation = self._llm.invoke([
            SystemMessage(content=prompt),
            *state.chat_history,
            HumanMessage(content=state.user_input),
        ])

        state.final_generation = generation.content
        state.chat_history += [HumanMessage(content=state.user_input), generation]
        # self._save_chat(state)
        return state

    def _save_chat(self, state: State):
        if not state.user_id or not state.user_id.strip():
            return

        # self._postgres.save_message(ChatMessage(
        #     user_id=state.user_id,
        #     role=MessageRole.USER,
        #     content=state.user_input
        # ))

        # self._postgres.save_message(ChatMessage(
        #     user_id=state.user_id,
        #     role=MessageRole.AI,
        #     content=state.final_generation
        # ))

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
 
