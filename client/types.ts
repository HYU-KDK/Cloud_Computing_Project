
export type Gender = 'male' | 'female';
export type AcademicLevel = 'beginner' | 'intermediate' | 'advanced';
export type AppLanguage = 'ko' | 'en';

export interface User {
  id: string;
  gender: Gender;
  level: AcademicLevel;
  language: AppLanguage;
  interestKeywords: string[];
  totalCorrectCount: number;
  currentStage: number;
  readList: Paper[];
  mustReadList: Paper[];
  masteredPaperIds: string[];
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  url: string;
  source: string;
  venue?: string;
  year?: string;
  recommendationReason?: string;
  abstract: string;
  isRead?: boolean;
  summary?: PaperSummary;
  quiz?: Quiz;
}

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

export enum AppState {
  LANDING = 'LANDING',
  ONBOARDING = 'ONBOARDING',
  DISCOVERY = 'DISCOVERY',
  DASHBOARD = 'DASHBOARD',
  WORKSPACE = 'WORKSPACE',
  CHARACTER_STATS = 'CHARACTER_STATS',
}
