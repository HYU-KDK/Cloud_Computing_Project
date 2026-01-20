// useQuizAttempt.ts
// 퀴즈 제출 + 결과/성장 반영
import { useCallback, useState } from "react";
import { useUser } from "../context/UserContext";

type AttemptAnswer =
  | { question_id: string; choice_id: string }
  | { question_id: string; text: string };

type SubmitPayload = {
  quizId: string;
  paperId: string;
  answers: AttemptAnswer[];
};

type SubmitResult = {
  attempt: {
    correct_count: number;
    total_count: number;
    // 서버가 ORM 그대로 반환하면 shape가 달라질 수 있으니, MVP에선 느슨하게 둠
    [k: string]: any;
  };
  progress: {
    total_correct: number;
    stage: number;
    stage_up: boolean;
    next_stage_at_total_correct: number | null;
  };
};

type State = {
  loading: boolean;
  error: string | null;
  result: SubmitResult | null;
};

export function useQuizAttempt() {
  const { user, setUser } = useUser();

  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    result: null,
  });

  const submitAttempt = useCallback(async (payload: SubmitPayload) => {
    if (!user?.id) {
      setState({ loading: false, error: "User not set. Complete onboarding first.", result: null });
      return null;
    }

    setState({ loading: true, error: null, result: null });

    try {
      const res = await fetch(`/api/papers/quizzes/${payload.quizId}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          paper_id: payload.paperId,
          answers: payload.answers,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to submit quiz (${res.status}): ${text}`);
      }

      const json = (await res.json()) as SubmitResult;
      setState({ loading: false, error: null, result: json });

      // 서버 progress를 프론트 user에도 반영 (필드명이 너희 User 타입과 다를 수 있어 최소만 반영)
      // 아래는 "필드가 존재하면 업데이트" 방식으로 안전하게 처리
      const nextUser: any = { ...(user as any) };
      if (typeof (nextUser.totalCorrectCount) === "number") {
        nextUser.totalCorrectCount = json.progress.total_correct;
      }
      if (typeof (nextUser.currentStage) === "number") {
        nextUser.currentStage = json.progress.stage;
      }
      setUser(nextUser);

      return json;
    } catch (e: any) {
      setState({ loading: false, error: e?.message ?? "Unknown error", result: null });
      return null;
    }
  }, [user, setUser]);

  return {
    ...state,
    submitAttempt,
  };
}
