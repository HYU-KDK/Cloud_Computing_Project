from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from .base import Base

class Paper(Base):
    __tablename__ = "papers"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    authors = Column(JSONB, nullable=False)
    url = Column(String)
    source = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
