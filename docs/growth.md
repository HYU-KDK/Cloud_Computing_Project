# Character Growth Rules (v1)

## Stage 정의
- Stage: 0 ~ 5 (총 6단계)
- Stage + 1 → 캐릭터 스프라이트 단계

---

## 성장 기준: 누적 정답 수

| Stage From | Stage To | Required Total Correct |
|-----------:|---------:|------------------------:|
| 0 | 1 | 5 |
| 1 | 2 | 15 |
| 2 | 3 | 30 |
| 3 | 4 | 50 |
| 4 | 5 | 75 |

---

## 규칙

- 오답 패널티 없음
- 정답 수는 절대 감소하지 않음
- 한 번의 퀴즈로 여러 단계 상승 가능

---

## 계산 로직 (의사코드)

```text
thresholds = [5, 15, 30, 50, 75]

new_total = prev_total + attempt_correct
new_stage = count(thresholds where new_total >= threshold)

stage_up = new_stage > prev_stage
next_stage_at = thresholds[new_stage] if new_stage < 5 else null
