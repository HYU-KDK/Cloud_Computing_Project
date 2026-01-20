from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class QuizResponse(BaseModel):
    quiz_id: str
    paper_id: str
    version: int
    quiz_json: Dict
    created_at: datetime

    class Config:
        orm_mode = True
