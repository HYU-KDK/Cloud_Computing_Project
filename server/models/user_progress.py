from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
from .base import Base

class UserProgress(Base):
    __tablename__ = "user_progress"

    user_id = Column(String, primary_key=True)
    total_correct = Column(Integer, default=0)
    stage = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow)
