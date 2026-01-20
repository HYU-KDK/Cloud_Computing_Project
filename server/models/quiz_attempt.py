from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from .base import Base

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    paper_id = Column(String, nullable=False)
    quiz_id = Column(String, nullable=False)
    correct_count = Column(Integer, nullable=False)
    total_count = Column(Integer, nullable=False)
    answers_json = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
