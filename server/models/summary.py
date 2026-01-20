from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from .base import Base

class Summary(Base):
    __tablename__ = "summaries"

    id = Column(String, primary_key=True)
    paper_id = Column(String, ForeignKey("papers.id"))
    version = Column(Integer, default=1)
    summary_json = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
