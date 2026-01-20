from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from .base import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(String, primary_key=True)
    paper_id = Column(String, ForeignKey("papers.id"))
    version = Column(Integer, default=1)
    quiz_json = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
