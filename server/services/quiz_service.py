import uuid
from datetime import datetime
from typing import Dict, List
from server.models.quiz import Quiz
from server.models.quiz_attempt import QuizAttempt


def generate_quiz_with_llm(extracted_text: str) -> Dict:
    """
    ⚠️ 더미 구현
    실제로는 Google AI Studio / Gemini API 호출로 교체
    contracts.md의 Quiz JSON Schema(v1)를 반드시 따를 것
    """

    return {
        "schema_version": "1.0",
        "paper_meta": {
            "title": "Dummy Paper",
            "authors": ["Author A"],
            "url": "",
            "source": "upload"
        },
        "quiz_meta": {
            "num_questions": 5,
            "recommended_time_sec": 420
        },
        "questions": [
            {
                "question_id": "q1",
                "type": "mcq",
                "skill": "claim",
                "prompt": "What is the main contribution of the paper?",
                "choices": [
                    {"id": "A", "text": "Proposes a new method"},
                    {"id": "B", "text": "Improves hardware"},
                    {"id": "C", "text": "Survey only"},
                    {"id": "D", "text": "No contribution"}
                ],
                "answer": {"correct_choice_id": "A"},
                "explanation": {
                    "text": "The paper clearly states its main contribution.",
                    "evidence_refs": []
                },
                "difficulty": "easy"
            }
        ],
        "generated_by": {
            "provider": "google_ai_studio",
            "model": "dummy-model",
            "prompt_version": "v1",
            "generated_at": datetime.utcnow().isoformat()
        }
    }


def create_quiz(db, paper_id: str, extracted_text: str) -> Quiz:
    quiz_json = generate_quiz_with_llm(extracted_text)

    quiz = Quiz(
        id=f"quiz_{uuid.uuid4().hex[:8]}",
        paper_id=paper_id,
        version=1,
        quiz_json=quiz_json
    )

    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


def grade_quiz(
    quiz_json: Dict,
    answers: List[Dict]
) -> Dict:
    questions = {q["question_id"]: q for q in quiz_json["questions"]}

    correct = 0
    result = {}

    for ans in answers:
        q = questions.get(ans["question_id"])
        if not q:
            continue

        is_correct = False

        if q["type"] == "mcq":
            is_correct = ans.get("choice_id") == q["answer"]["correct_choice_id"]

        elif q["type"] == "short_answer":
            keywords = q["grading"]["keywords"]
            text = ans.get("text", "").lower()
            is_correct = any(k.lower() in text for k in keywords)

        if is_correct:
            correct += 1

        result[ans["question_id"]] = {"is_correct": is_correct}

    return {
        "correct_count": correct,
        "total_count": len(questions),
        "answers_json": result
    }


def save_quiz_attempt(
    db,
    user_id: str,
    paper_id: str,
    quiz_id: str,
    grading_result: Dict
) -> QuizAttempt:

    attempt = QuizAttempt(
        id=f"att_{uuid.uuid4().hex[:8]}",
        user_id=user_id,
        paper_id=paper_id,
        quiz_id=quiz_id,
        correct_count=grading_result["correct_count"],
        total_count=grading_result["total_count"],
        answers_json=grading_result["answers_json"]
    )

    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt
