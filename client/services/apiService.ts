
import { Paper, PaperSummary, Quiz, User, AcademicLevel, AppLanguage } from "../types";

const API_BASE_URL = '/api'; // Proxied by Vite or relative in production

export const initializeUser = async (userProfile: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
    });
    if (!response.ok) throw new Error('Failed to initialize user');
    return response.json(); // Returns created user with ID
};

export const fetchUser = async (userId: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
};

export const analyzePaper = async (
    paperTitle: string,
    abstract: string,
    lang: AppLanguage = 'ko'
): Promise<{ summary: PaperSummary; quiz: Quiz }> => {
    const response = await fetch(`${API_BASE_URL}/paper/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: paperTitle, abstract, language: lang })
    });
    if (!response.ok) throw new Error('Analysis failed');
    return response.json();
};

export const recommendPapers = async (readList: Paper[], interests: string[], level: AcademicLevel, searchQuery?: string): Promise<Paper[]> => {
    const readListTitles = readList.map(p => p.title);
    const response = await fetch(`${API_BASE_URL}/paper/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readListTitles, interests, level, query: searchQuery })
    });
    if (!response.ok) throw new Error('Recommendation failed');
    return response.json();
};

export const getMustReadPapers = async (interests: string[], level: AcademicLevel, excludeTitles: string[] = []): Promise<Paper[]> => {
    const response = await fetch(`${API_BASE_URL}/paper/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readListTitles: excludeTitles, interests, level, query: "Must read seminal papers" })
    });
    if (!response.ok) throw new Error('Failed to fetch must reads');
    return response.json();
};

export const syncUserPaper = async (userId: string, paper: Paper, isRead: boolean, isInLibrary: boolean) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/paper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            paperData: {
                title: paper.title,
                authors: paper.authors,
                url: paper.url,
                source: paper.source,
                venue: paper.venue,
                year: paper.year,
                abstract: paper.abstract,
                recommendationReason: paper.recommendationReason
            },
            isRead,
            isInLibrary,
            summary: paper.summary,
            quiz: paper.quiz
        })
    });
    if (!response.ok) throw new Error('Sync failed');
    return response.json();
};

export const updateUserStats = async (userId: string, stats: { totalCorrectCount: number, currentStage: number, masteredPaperId?: string }) => {
    const response = await fetch(`${API_BASE_URL}/user/${userId}/stats`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stats)
    });
    if (!response.ok) throw new Error('Update stats failed');
    return response.json();
};
