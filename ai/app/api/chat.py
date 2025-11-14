from app.models.chat_request import ChatRequest
from app.models.chat_response import ResponseModel
from app.services.chat_service import root, chat
from app.services.enhanced_chat_service import enhanced_chat_endpoint, get_user_profile_endpoint
from fastapi import APIRouter, Query, HTTPException
from typing import Optional

chat_router = APIRouter()
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import FileResponse
import requests
import tempfile
load_dotenv()

@chat_router.get("/")
async def graph():
    return await root()

@chat_router.post("/chat")
async def chat_endpoint(chat_request: ChatRequest):
    """Standard chat endpoint - maintains compatibility"""
    chat_result = await chat(chat_request)
    return ResponseModel(
        data=chat_result["data"],
        statusCode=chat_result["statusCode"],
    )

@chat_router.post("/chat/enhanced")
async def enhanced_chat_api(chat_request: ChatRequest):
    """Enhanced chat endpoint with personalization"""
    try:
        return await enhanced_chat_endpoint(chat_request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@chat_router.get("/user/{user_id}/profile")
async def get_user_profile_api(user_id: str):
    """Get user profile and progress"""
    try:
        return await get_user_profile_endpoint(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Giọng mặc định, có thể đổi

@chat_router.post("/chat-voice")
async def chat_voice_endpoint(chat_request: ChatRequest):
    # gọi chat service để lấy kết quả text
    chat_result = await chat(chat_request)
    text = chat_result["data"]["result"]

    # gọi ElevenLabs synthesize
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": os.getenv("ELEVENLABS_API_KEY"),
    }
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2"
    }
    response = requests.post(url, headers=headers, json=data)

    # lưu tạm file mp3
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tmp_file.write(response.content)
    tmp_file.close()

    # trả về audio
    return FileResponse(tmp_file.name, media_type="audio/mpeg", filename="chat_output.mp3")
