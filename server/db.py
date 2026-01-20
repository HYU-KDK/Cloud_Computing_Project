from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from server.models.base import Base

# 👉 개발용 기본값 (Postgres 권장)
# 예: postgresql://user:password@localhost:5432/paper_growth
DATABASE_URL = "sqlite:///./dev.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite 전용
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
