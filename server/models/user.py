from sqlalchemy import Column, String, DateTime
from datetime import datetime
from .base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    character_gender = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
