from fastapi import FastAPI
from server.db import init_db
from server.api.papers import router as papers_router

app = FastAPI(
    title="Paper Growth System API",
    version="0.1.0"
)


@app.on_event("startup")
def on_startup():
    init_db()


# API Routers
app.include_router(papers_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
