
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { PaperSummary, Quiz, AcademicLevel, AppLanguage } from "../types";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });
const MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0";

const invokeClaude = async (system: string, userPrompt: string): Promise<any> => {
    // 1. Construct Payload based on Model Family
    let payload: any = {};
    const isNova = MODEL_ID.includes("nova");
    const isTitan = MODEL_ID.includes("titan");

    if (isNova) {
        // Amazon Nova Payload
        payload = {
            system: [{ text: system }],
            messages: [{ role: "user", content: [{ text: userPrompt }] }],
            inferenceConfig: {
                max_new_tokens: 4096,
                temperature: 0.5,
                top_p: 0.9,
            }
        };
    } else if (isTitan) {
        // Titan Text (Basic support)
        payload = {
            inputText: `${system}\n\n${userPrompt}`,
            textGenerationConfig: {
                maxTokenCount: 4096,
                temperature: 0.5,
            }
        };
    } else {
        // Anthropic Claude Payload (Default)
        payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4096,
            system: system,
            messages: [
                { role: "user", content: userPrompt }
            ],
            temperature: 0.5,
        };
    }

    const command = new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(payload),
    });

    try {
        const response = await client.send(command);
        const decodedBody = JSON.parse(new TextDecoder().decode(response.body));

        let text = "";

        // 2. Parse Response based on Model Family
        if (isNova) {
            // Nova response structure: output.message.content[0].text
            text = decodedBody.output?.message?.content?.[0]?.text || "";
        } else if (isTitan) {
            text = decodedBody.results?.[0]?.outputText || "";
        } else {
            // Claude response structure
            text = decodedBody.content?.[0]?.text || "";
        }

        // Extract JSON if wrapped in markdown code blocks
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/{[\s\S]*}/);
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Bedrock Invoke Error:", error);
        console.error("Used Model:", MODEL_ID);
        throw new Error("Failed to generate content from Bedrock");
    }
};

export const analyzePaper = async (
    paperTitle: string,
    abstract: string,
    lang: AppLanguage = 'ko'
): Promise<{ summary: PaperSummary; quiz: Quiz }> => {

    const langInstruction = lang === 'ko'
        ? "모든 요약과 퀴즈 내용, 설명은 반드시 '한국어'로 작성하세요. 단, 논문 제목이나 고유 명사는 영어로 유지해도 됩니다."
        : "Write all summaries, quiz questions, and explanations in English.";

    const system = `You are an expert academic research assistant. You output strict JSON only.`;
    const prompt = `
    Analyze the research paper titled "${paperTitle}".
    Abstract/Text: ${abstract}
    
    ${langInstruction}

    TASK 1: SUMMARY
    Provide a highly structured summary (JSON):
    - tldr: A 1-sentence high-level summary.
    - contributions: Exactly 3 core points.
    - introduction: Summarize the background and the problem.
    - method: Explain the technical approach and architecture.
    - experiments: Describe evaluation process and key results.
    - conclusion: Final takeaway and impact.

    TASK 2: QUIZ
    Generate exactly 5 questions based ONLY on the summary content you generated in TASK 1. 
    A user must be able to solve all 5 questions correctly just by reading the summary you provided.
    
    Ensure the questions follow this STRICT distribution:
    - Questions 1, 2, 3: Must be Multiple Choice (MCQ) with exactly 4 options.
    - Questions 4, 5: Must be Short Answer (주관식). Do NOT provide options. The answer should be a specific technical term or short phrase found in the summary.

    For Short Answer questions, set the "type" field to "short" and ensure "options" is an empty array or omitted.

    Output format MUST be a single JSON object with this structure:
    {
      "summary": { "tldr": "...", "contributions": ["..."], "introduction": "...", "method": "...", "experiments": "...", "conclusion": "..." },
      "quiz": { 
        "questions": [
          { 
            "id": "q1", "type": "mcq", "question": "...", "options": ["..."], "answer": "...", "explanation": "...", "reference": "..." 
          },
          ...
        ] 
      }
    }
  `;

    const data = await invokeClaude(system, prompt);
    return {
        summary: data.summary,
        quiz: { paperId: paperTitle, questions: data.quiz.questions }
    };
};

export const recommendPapers = async (readListTitles: string[], interests: string[], level: AcademicLevel, searchQuery?: string): Promise<any[]> => {
    const interestList = interests.join(", ");
    const readTitlesStr = readListTitles.join(", ");

    let levelInstruction = "";
    if (level === 'beginner') {
        levelInstruction = "Focus 80% on foundations, 20% on SOTA.";
    } else if (level === 'intermediate') {
        levelInstruction = "50/50 mix of classics and modern breakthroughs.";
    } else {
        levelInstruction = "90% on 2024-2025 niche trends.";
    }

    const system = `You are a research paper curator. You output strict JSON only.`;
    const prompt = `
    Find 8 academic papers based on: ${interestList}.
    User Level: ${levelInstruction}
    ${searchQuery ? `Search context: ${searchQuery}` : ""}
    Exclude already read: ${readTitlesStr}
    
    Return a JSON array of objects with keys: id, title, authors (array), url, source, venue, year, abstract, recommendationReason.
  `;

    return await invokeClaude(system, prompt);
};

export const getMustReadPapers = async (interests: string[], level: AcademicLevel, excludeTitles: string[] = []): Promise<any[]> => {
    const interestList = interests.join(", ");

    const system = `You are a research paper curator. You output strict JSON only.`;
    const prompt = `
    Identify 10 "Must-Read" papers for interests: ${interestList}.
    
    Focus: ${level} researchers.
    Exclude: ${excludeTitles.join(", ")}
    
    Return a JSON array of objects with keys: id, title, authors (array), url, source, venue, year, abstract, recommendationReason.
  `;

    return await invokeClaude(system, prompt);
};
