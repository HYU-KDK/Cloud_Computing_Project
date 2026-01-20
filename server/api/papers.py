from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from server.services.summary_service import create_summary
from server.services.quiz_service import (
    create_quiz,
    grade_quiz,
    save_quiz_attempt
)
from server.services.growth_service import apply_growth
from server.models.quiz import Quiz
from server.schemas.summary import SummaryResponse
from server.schemas.quiz import QuizResponse
from server.db import get_db

router = APIRouter(prefix="/api/papers", tags=["papers"])


@router.post("/{paper_id}/summaries", response_model=SummaryResponse)
def generate_summary(paper_id: str, db: Session = Depends(get_db)):
    extracted_text = "DUMMY TEXT"
    summary = create_summary(db, paper_id, extracted_text)
    return summary


@router.post("/{paper_id}/quizzes", response_model=QuizResponse)
def generate_quiz(paper_id: str, db: Session = Depends(get_db)):
    extracted_text = "DUMMY TEXT"
    quiz = create_quiz(db, paper_id, extracted_text)
    return quiz


@router.post("/quizzes/{quiz_id}/attempts")
def submit_quiz(
    quiz_id: str,
    payload: dict,
    db: Session = Depends(get_db)
):
    quiz: Quiz = db.get(Quiz, quiz_id)

    grading = grade_quiz(
        quiz.quiz_json,
        payload["answers"]
    )

    attempt = save_quiz_attempt(
        db=db,
        user_id=payload["user_id"],
        paper_id=payload["paper_id"],
        quiz_id=quiz_id,
        grading_result=grading
    )

    progress = apply_growth(
        db=db,
        user_id=payload["user_id"],
        attempt_correct=grading["correct_count"]
    )

    return {
        "attempt": attempt,
        "progress": progress
    }
