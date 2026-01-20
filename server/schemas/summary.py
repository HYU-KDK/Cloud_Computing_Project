from pydantic import BaseModel
from typing import Dict
from datetime import datetime

class SummaryResponse(BaseModel):
    paper_id: str
    version: int
    summary_json: Dict
    created_at: datetime

    class Config:
        orm_mode = True
