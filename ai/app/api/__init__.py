"""The main APIRouter is defined to include all the sub routers from each
module inside the API folder"""
from fastapi import APIRouter
from .chat import chat_router
# TODO: import your modules here.

api_router = APIRouter()
api_router.include_router(chat_router, tags=["chat"])
# TODO: include the routers from other modules
