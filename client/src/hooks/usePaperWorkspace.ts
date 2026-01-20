// usePaperWorkspace.ts
// paperId 기준 summary/quiz 로드/생성
import { useCallback, useEffect, useMemo, useState } from "react";

type State<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type SummaryRecord = {
  paper_id: string;
  version: number;
  summary_json: any; // contracts.md 기반으로 나중에 타입 구체화 가능
  created_at: string;
};

type QuizRecord = {
  quiz_id: string;
  paper_id: string;
  version: number;
  quiz_json: any; // contracts.md 기반으로 나중에 타입 구체화 가능
  created_at: string;
};

export function usePaperWorkspace(paperId: string | undefined) {
  const [summary, setSummary] = useState<State<SummaryRecord>>({
    data: null,
    loading: false,
    error: null,
  });
  const [quiz, setQuiz] = useState<State<QuizRecord>>({
    data: null,
    loading: false,
    error: null,
  });

  const canRun = useMemo(() => Boolean(paperId && paperId.trim().length > 0), [paperId]);

  const fetchLatestSummary = useCallback(async () => {
    if (!canRun) return null;
    setSummary((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/papers/${paperId}/summaries/latest`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch summary (${res.status}): ${text}`);
      }
      const json = (await res.json()) as SummaryRecord;
      setSummary({ data: json, loading: false, error: null });
      return json;
    } catch (e: any) {
      setSummary({ data: null, loading: false, error: e?.message ?? "Unknown error" });
      return null;
    }
  }, [paperId, canRun]);

  const generateSummary = useCallback(async () => {
    if (!canRun) return null;
    setSummary((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/papers/${paperId}/summaries`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to generate summary (${res.status}): ${text}`);
      }
      const json = (await res.json()) as SummaryRecord;
      setSummary({ data: json, loading: false, error: null });
      return json;
    } catch (e: any) {
      setSummary({ data: null, loading: false, error: e?.message ?? "Unknown error" });
      return null;
    }
  }, [paperId, canRun]);

  const fetchLatestQuiz = useCallback(async () => {
    if (!canRun) return null;
    setQuiz((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/papers/${paperId}/quizzes/latest`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch quiz (${res.status}): ${text}`);
      }
      const json = (await res.json()) as QuizRecord;
      setQuiz({ data: json, loading: false, error: null });
      return json;
    } catch (e: any) {
      setQuiz({ data: null, loading: false, error: e?.message ?? "Unknown error" });
      return null;
    }
  }, [paperId, canRun]);

  const generateQuiz = useCallback(async () => {
    if (!canRun) return null;
    setQuiz((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/papers/${paperId}/quizzes`, { method: "POST" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to generate quiz (${res.status}): ${text}`);
      }
      const json = (await res.json()) as QuizRecord;
      setQuiz({ data: json, loading: false, error: null });
      return json;
    } catch (e: any) {
      setQuiz({ data: null, loading: false, error: e?.message ?? "Unknown error" });
      return null;
    }
  }, [paperId, canRun]);

  // 페이지 진입 시 최신값 로드 (없으면 generate로 이어가게 구성 가능)
  useEffect(() => {
    if (!canRun) return;
    void fetchLatestSummary();
    void fetchLatestQuiz();
  }, [canRun, fetchLatestSummary, fetchLatestQuiz]);

  return {
    summary,
    quiz,
    fetchLatestSummary,
    generateSummary,
    fetchLatestQuiz,
    generateQuiz,
  };
}
