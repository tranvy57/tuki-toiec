"""
Enhanced Chat Service sử dụng existing database và RouteNode được cải tiến
"""

from typing import Dict, Any, Optional
from app.workflow.nodes.route_node import RouteNode
from app.models.state import State
from app.models.chat_request import ChatRequest
from app.models.chat_response import ResponseModel
from app.db.session import get_db_session


class EnhancedChatService:
    """
    Service chat được enhance với personalization sử dụng existing database
    """
    
    def __init__(self):
        try:
            self.db_session = get_db_session()
            # Check if db_session is valid
            if isinstance(self.db_session, dict) or not hasattr(self.db_session, 'query'):
                print(f"Warning: Invalid database session type: {type(self.db_session)}")
                self.db_session = None
                
            self.route_node = RouteNode(db_session=self.db_session)
        except Exception as e:
            print(f"Warning: Database session creation failed: {e}")
            self.db_session = None
            self.route_node = RouteNode()  # Fallback without db session
    
    async def enhanced_chat(self, chat_request: ChatRequest) -> Dict[str, Any]:
        """
        Main chat function với personalization
        """
        try:
            # Tạo state từ request
            state = State(
                chat_id=chat_request.chat_id,
                user_input=chat_request.user_input,
                user_id=chat_request.user_id,
                chat_history=[],
                context="",
                final_generation="",
                error=[],
                is_relevant=True,
                next_state="generate",
                last_keywords=[],
                meta={}
            )
            
            # Sử dụng enhanced route node
            result_state = self.route_node.generate(state)
            
            # Check if personalization was used
            personalized = bool(state.user_id and self.db_session)
            
            return {
                "statusCode": 200,
                "data": {
                    "result": result_state.final_generation or "No response generated",
                    "personalized": personalized,
                    "context_used": bool(result_state.context),
                    "chat_id": chat_request.chat_id
                }
            }
            
        except Exception as e:
            print(f"Enhanced chat error: {e}")
            return {
                "statusCode": 500,
                "data": {
                    "result": "Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Bạn có thể thử lại không?",
                    "personalized": False,
                    "context_used": False,
                    "error": str(e)
                }
            }

    def get_user_profile_summary(self, user_id: str) -> Dict[str, Any]:
        """
        Lấy summary của user profile
        """
        try:
            user_profile = self.route_node.get_user_profile(State(user_id=user_id))
            
            if not user_profile:
                return {"error": "User not found"}
            
            return {
                "user_id": user_profile.user_id,
                "display_name": user_profile.display_name,
                "learning_goal": user_profile.learning_goal.value,
                "learning_style": user_profile.learning_style.value,
                "personality_type": user_profile.personality_type.value,
                "skill_levels": user_profile.skill_levels,
                "total_conversations": user_profile.total_conversations
            }
            
        except Exception as e:
            return {"error": str(e)}


# Convenience functions cho API endpoints
async def enhanced_chat_endpoint(chat_request: ChatRequest) -> ResponseModel:
    """
    Enhanced chat endpoint
    """
    service = EnhancedChatService()
    result = await service.enhanced_chat(chat_request)
    
    return ResponseModel(
        data=result["data"],
        statusCode=result["statusCode"],
        message=result["message"]
    )


async def get_user_profile_endpoint(user_id: str) -> Dict[str, Any]:
    """
    Get user profile endpoint
    """
    service = EnhancedChatService()
    result = await service.get_user_profile_summary(user_id)
    
    return {
        "data": result,
        "statusCode": 200 if "error" not in result else 404,
        "message": "User profile retrieved" if "error" not in result else "User not found"
    }


# Example usage
async def test_enhanced_chat():
    """
    Test function
    """
    service = EnhancedChatService()
    
    test_request = ChatRequest(
        chat_id="test_123",
        user_input="How can I improve my TOEIC grammar?",
        user_id="existing_user_id"  # ID của user có trong database
    )
    
    result = await service.enhanced_chat(test_request)
    print(f"Result: {result}")
    
    # Test profile
    profile = await service.get_user_profile_summary("existing_user_id")
    print(f"Profile: {profile}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(test_enhanced_chat())