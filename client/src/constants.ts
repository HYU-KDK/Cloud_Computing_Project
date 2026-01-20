export const INTEREST_OPTIONS: string[] = [
  "Diffusion",
  "RAG",
  "Graph Neural Networks",
  "LLM Evaluation",
  "IR",
  "Agents",
  "Alignment",
  "Multimodal",
  "RLHF",
  "Vision Transformers",
  "Recommender Systems",
  "Retrieval",
  "Information Extraction",
  "NLP",
  "Computer Vision",
];

// ===== Growth (Stage) =====
// stage: 0~5
// thresholds are "total correct answers" required to reach next stage
export const STAGE_THRESHOLDS = [5, 15, 30, 50, 75] as const;

export const clampStage = (s: number) => Math.max(0, Math.min(5, s));

export const computeStageFromTotalCorrect = (totalCorrect: number) => {
  let stage = 0;
  for (let i = 0; i < STAGE_THRESHOLDS.length; i++) {
    if (totalCorrect >= STAGE_THRESHOLDS[i]) stage = i + 1;
  }
  return clampStage(stage);
};
