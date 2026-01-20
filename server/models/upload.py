from sqlalchemy import Column, String, DateTime
from datetime import datetime
from .base import Base

class Upload(Base):
    __tablename__ = "uploads"

    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    paper_id = Column(String)
    pdf_url = Column(String)
    status = Column(String)  # parsed | failed
    extracted_text_length = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
