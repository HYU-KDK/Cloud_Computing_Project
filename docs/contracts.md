# Contracts — Summary / Quiz JSON Schema (v1)

이 문서는 LLM이 생성하는
- 논문 요약(Summary)
- 논문 퀴즈(Quiz)

의 **출력 JSON 계약(Contract)** 을 정의한다.

이 계약은 다음을 보장한다.
- 프론트엔드 렌더링 안정성
- DB(JSON/JSONB) 저장 안정성
- 프롬프트 버전 관리
- 근거(evidence) 기반 설명 제공

---

## 1. 공통 원칙

- 모든 산출물은 `schema_version`을 가진다.
- 모든 요약/퀴즈는 **논문 근거(evidence)** 를 포함한다.
- 근거는 업로드된 논문에서 추출한 단일 텍스트(`extracted_text`) 기준으로 참조한다.
- 서버는 추출 텍스트를 기준으로 `start_char`, `end_char`를 관리한다.
- “정답처럼 단정”하지 않고, 논문 근거 기반 서술을 원칙으로 한다.

---

## 2. Evidence Reference Schema

요약과 퀴즈에서 공통으로 사용되는 근거 참조 구조.

```json
{
  "source": "extracted_text",
  "section_hint": "Introduction | Method | Results | Conclusion | Optional",
  "start_char": 12345,
  "end_char": 12567,
  "quote": "원문 일부 발췌 (최대 240자)",
  "confidence": 0.6
}
