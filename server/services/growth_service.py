from server.models.user_progress import UserProgress

THRESHOLDS = [5, 15, 30, 50, 75]


def calculate_stage(total_correct: int) -> int:
    stage = 0
    for t in THRESHOLDS:
        if total_correct >= t:
            stage += 1
    return min(stage, 5)


def apply_growth(
    db,
    user_id: str,
    attempt_correct: int
) -> dict:

    progress = db.get(UserProgress, user_id)

    if not progress:
        progress = UserProgress(
            user_id=user_id,
            total_correct=0,
            stage=0
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)

    prev_stage = progress.stage
    progress.total_correct += attempt_correct
    progress.stage = calculate_stage(progress.total_correct)

    db.commit()

    return {
        "total_correct": progress.total_correct,
        "stage": progress.stage,
        "stage_up": progress.stage > prev_stage,
        "next_stage_at_total_correct": (
            THRESHOLDS[progress.stage]
            if progress.stage < 5 else None
        )
    }
