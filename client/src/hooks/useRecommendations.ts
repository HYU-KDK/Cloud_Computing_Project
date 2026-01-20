// useRecommendations.ts
// coldstart / paper_based 추천 로드
import { useCallback, useEffect, useState } from "react";

type RecommendationContext = "coldstart" | "paper_based";

export type RecommendedPaper = {
  paper_id: string;
  title: string;
  authors: string[];
  url: string;
  source?: string;
  reason_label?: string;
};

export type RecommendationResponse = {
  recommendation_set: {
    id: string;
    context: RecommendationContext;
    seed_keywords: string[];
    seed_authors: string[];
    created_at: string;
  };
  papers: RecommendedPaper[];
};

type State = {
  data: RecommendationResponse | null;
  loading: boolean;
  error: string | null;
};

export function useRecommendations(initialContext: RecommendationContext = "coldstart") {
  const [context, setContext] = useState<RecommendationContext>(initialContext);
  const [state, setState] = useState<State>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchRecommendations = useCallback(async (ctx?: RecommendationContext) => {
    const nextContext = ctx ?? context;

    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/recommendations?context=${nextContext}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to fetch recommendations (${res.status}): ${text}`);
      }
      const json = (await res.json()) as RecommendationResponse;
      setState({ data: json, loading: false, error: null });
      return json;
    } catch (e: any) {
      setState({ data: null, loading: false, error: e?.message ?? "Unknown error" });
      return null;
    }
  }, [context]);

  // context 변경 시 자동 로드(원치 않으면 이 useEffect를 지워도 됨)
  useEffect(() => {
    void fetchRecommendations(context);
  }, [context, fetchRecommendations]);

  return {
    context,
    setContext,
    ...state,
    refresh: () => fetchRecommendations(context),
    fetchRecommendations,
  };
}
