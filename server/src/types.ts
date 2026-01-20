export type Gender = 'male' | 'female';
export type AcademicLevel = 'beginner' | 'intermediate' | 'advanced';
export type AppLanguage = 'ko' | 'en';

export interface PaperSummary {
    tldr: string;
    contributions: string[];
    introduction: string;
    method: string;
    experiments: string;
    conclusion: string;
}

export interface QuizQuestion {
    id: string;
    type: 'mcq' | 'short';
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
    reference: string;
}

export interface Quiz {
    paperId: string;
    questions: QuizQuestion[];
}
