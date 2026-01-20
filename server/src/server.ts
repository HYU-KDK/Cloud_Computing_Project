
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import { analyzePaper, recommendPapers, getMustReadPapers } from './services/bedrockService';
import { AcademicLevel, AppLanguage } from './types';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const path = require('path');

// Serve static files from the React frontend app
const frontendPath = path.join(__dirname, '../../client/dist');
app.use(express.static(frontendPath));



// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// --- User Routes ---

// Get User (Load Dashboard)
app.get('/api/user/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: {
                userPapers: {
                    include: { paper: true }
                }
            }
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        // Transform to frontend expected format
        // Map userPapers back to readList/mustReadList
        const readList = user.userPapers.filter(up => up.isInLibrary || up.isRead).map(up => ({
            ...up.paper,
            isRead: up.isRead,
            summary: up.summary,
            quiz: up.quiz,
            recommendationReason: up.recommendationReason
        }));

        // Note: In this simple DB schema, we might store "Must Reads" differently or just re-fetch them.
        // For now, let's treat userPapers with isMustRead=true as the list.
        const mustReadList = user.userPapers.filter(up => up.isMustRead).map(up => ({
            ...up.paper,
            recommendationReason: up.recommendationReason
        }));

        res.json({
            ...user,
            readList,
            mustReadList
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// Create User / Onboarding
app.post('/api/user', async (req, res) => {
    const { gender, level, language, interestKeywords } = req.body;

    try {
        // 1. Get initial Must-Read from Bedrock
        const mustReads = await getMustReadPapers(interestKeywords, level);

        // 2. Create User
        const user = await prisma.user.create({
            data: {
                gender,
                level,
                language,
                interestKeywords,
                masteredPaperIds: [],
                currentStage: 0,
                totalCorrectCount: 0
            }
        });

        // 3. Save Papers and UserPapers (Must Reads)
        // We do this concurrently or loop
        for (const paperData of mustReads) {
            // Upsert paper to avoid duplicates
            const paper = await prisma.paper.upsert({
                where: { title: paperData.title },
                update: {},
                create: {
                    title: paperData.title,
                    authors: paperData.authors || [],
                    url: paperData.url || "#",
                    source: paperData.source || "Unknown",
                    venue: paperData.venue,
                    year: paperData.year,
                    abstract: paperData.abstract || "No abstract available"
                }
            });

            await prisma.userPaper.create({
                data: {
                    userId: user.id,
                    paperId: paper.id,
                    isMustRead: true,
                    recommendationReason: paperData.recommendationReason
                }
            });
        }

        res.json({ id: user.id }); // Return ID for frontend to store/redirect
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Update User Stats
app.patch('/api/user/:id/stats', async (req, res) => {
    const { totalCorrectCount, currentStage, masteredPaperId } = req.body;
    try {
        const updateData: any = {
            totalCorrectCount,
            currentStage
        };
        if (masteredPaperId) {
            updateData.masteredPaperIds = { push: masteredPaperId };
        }

        const updated = await prisma.user.update({
            where: { id: req.params.id },
            data: updateData
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Failed to update stats" });
    }
});


// --- Bedrock Routes ---

// Analyze Paper
app.post('/api/paper/analyze', async (req, res) => {
    const { title, abstract, language, userId } = req.body;
    try {
        const result = await analyzePaper(title, abstract, language as AppLanguage);

        // Determine if we should save this to DB immediately?
        // Frontend expects just the result. DB saving happens when user adds to library or completes quiz.
        // However, for optimization, we *could* save the paper now.

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Analysis failed" });
    }
});

// Discovery / Recommend
app.post('/api/paper/recommend', async (req, res) => {
    const { readListTitles, interests, level, query } = req.body;
    try {
        const papers = await recommendPapers(readListTitles, interests, level as AcademicLevel, query);
        res.json(papers);
    } catch (error) {
        res.status(500).json({ error: "Recommendation failed" });
    }
});

// Save User Paper Interaction (e.g., Mark as Read, Add to Library, Save Quiz Result)
app.post('/api/user/:userId/paper', async (req, res) => {
    const { userId } = req.params;
    const { paperData, isRead, isInLibrary, summary, quiz } = req.body;

    try {
        // 1. Ensure Paper Exists
        const paper = await prisma.paper.upsert({
            where: { title: paperData.title },
            update: {},
            create: {
                title: paperData.title,
                authors: paperData.authors || [],
                url: paperData.url || "#",
                source: paperData.source || "Unknown",
                venue: paperData.venue,
                year: paperData.year,
                abstract: paperData.abstract || "No abstract available"
            }
        });

        // 2. Upsert UserPaper
        const userPaper = await prisma.userPaper.upsert({
            where: {
                userId_paperId: {
                    userId,
                    paperId: paper.id
                }
            },
            update: {
                isRead: isRead !== undefined ? isRead : undefined,
                isInLibrary: isInLibrary !== undefined ? isInLibrary : undefined,
                summary: summary ? summary : undefined,
                quiz: quiz ? quiz : undefined,
            },
            create: {
                userId,
                paperId: paper.id,
                isRead: isRead || false,
                isInLibrary: isInLibrary || false,
                summary,
                quiz
            }
        });

        res.json(userPaper);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save paper interaction" });
    }
});

// Anything that doesn't match the above, send back index.html
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
