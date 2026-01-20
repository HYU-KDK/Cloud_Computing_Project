import uuid
from datetime import datetime
from server.models.summary import Summary

def generate_summary_with_llm(extracted_text: str) -> dict:
    """
    ⚠️ 현재는 더미 구현
    실제로는 Google AI Studio / Gemini API 호출로 교체
    """

    return {
        "schema_version": "1.0",
        "paper_meta": {
            "title": "Dummy Paper Title",
            "authors": ["Author A", "Author B"],
            "year": 2024,
            "venue": "arXiv",
            "url": "",
            "source": "upload"
        },
        "tldr": "This paper proposes a novel approach to ...",
        "key_contributions": [
            {
                "text": "Proposes a new method for ...",
                "evidence_refs": [
                    {
                        "source": "extracted_text",
                        "start_char": 0,
                        "end_char": 200
                    }
                ]
            }
        ],
        "method_overview": {
            "text": "The method is based on ...",
            "evidence_refs": [
                {
                    "source": "extracted_text",
                    "start_char": 200,
                    "end_char": 500
                }
            ]
        },
        "results_overview": {
            "text": "Experiments show that ...",
            "evidence_refs": [
                {
                    "source": "extracted_text",
                    "start_char": 500,
                    "end_char": 800
                }
            ]
        },
        "limitations": [],
        "caveats": [],
        "generated_by": {
            "provider": "google_ai_studio",
            "model": "dummy-model",
            "prompt_version": "v1",
            "generated_at": datetime.utcnow().isoformat()
        }
    }

def create_summary(db, paper_id: str, extracted_text: str) -> Summary:
    summary_json = generate_summary_with_llm(extracted_text)

    summary = Summary(
        id=f"sum_{uuid.uuid4().hex[:8]}",
        paper_id=paper_id,
        version=1,
        summary_json=summary_json
    )

    db.add(summary)
    db.commit()
    db.refresh(summary)

    return summary
