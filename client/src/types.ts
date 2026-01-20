export type Gender = "female" | "male";
export type AcademicLevel = "beginner" | "intermediate" | "advanced";
export type User = {
  id: string;
  gender: Gender;
  interestKeywords: string[];

  totalCorrectCount: number; // 누적 정답
  currentStage: number;      // 0~5

  // 라이브러리
  readList: PaperInLibrary[];
  masteredPaperIds: string[];
};

export type Paper = {
  id: string;
  title: string;
  authors: string[];
  url?: string;
  source?: string;
  year?: number;
  venue?: string;
  abstract?: string;
};

export type PaperInLibrary = Paper & {
  isRead?: boolean;
  summary?: any;
  quiz?: any;
};

export type PaperSummary = {
  tldr: string;
  contributions: string[];
  methodology: string;
  results: string;
};

export type Quiz = {
  questions: Array<{
    question_id: string;
    type: "mcq" | "short_answer";
    prompt: string;
    choices?: Array<{ id: string; text: string }>;
  }>;
};
