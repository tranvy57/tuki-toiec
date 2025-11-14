from pydantic import BaseModel
from typing import Any, Dict, Optional

class ResponseModel(BaseModel):
    data: Any
    statusCode: int

    class Config:
        json_schema_extra = {
            "example": {
                "data": {},
                "statusCode": 200,
            }
        } 