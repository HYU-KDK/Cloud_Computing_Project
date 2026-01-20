from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
from .base import Base

class UserInterest(Base):
    __tablename__ = "user_interests"

    user_id = Column(String, primary_key=True)
    keywords = Column(JSONB, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
