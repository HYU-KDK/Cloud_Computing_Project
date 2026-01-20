import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import pg from 'pg';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const s3Client = new S3Client({ region: "us-east-1" });
const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false } // For RDS
});

export const handler = async (event) => {
  console.log("Processing event:", JSON.stringify(event));

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  
  // key format expected: "uploads/{paper_id}/{filename}.pdf" or just "{paper_id}.pdf"
  // Let's assume filename is the paperId for simplicity, or we parse metadata.
  // Ideally, we passed metadata on upload, but S3 events don't pass custom metadata easily.
  // Strategy: The key is the 'id' of the paper record in DB, e.g. "12345.pdf"
  const paperId = key.split('.')[0]; 

  try {
    // 1. Download PDF
    const s3Response = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const pdfBuffer = await s3Response.Body.transformToByteArray();
    
    // 2. Extract Text
    const data = await pdf(Buffer.from(pdfBuffer));
    const text = data.text.substring(0, 50000); // Limit context window
    
    // 3. Analyze with Bedrock
    const prompt = `
    Human: You are an expert academic research assistant.
    Analyze the following academic paper text and provide a structured summary and a quiz.
    
    Format the output as a valid JSON object with NO preamble or markdown code blocks.
    Structure:
    {
      "summary": {
        "tldr": "One sentence summary",
        "contributions": ["point 1", "point 2", "point 3"],
        "introduction": "summary...",
        "method": "summary...",
        "experiments": "summary...",
        "conclusion": "summary..."
      },
      "quiz": {
         "questions": [
            { "id": 1, "type": "multiple_choice", "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0 },
            { "id": 2, "type": "multiple_choice", "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 1 },
            { "id": 3, "type": "multiple_choice", "question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 2 },
            { "id": 4, "type": "short_answer", "question": "...", "answer": "..." },
            { "id": 5, "type": "short_answer", "question": "...", "answer": "..." }
         ]
      }
    }

    Paper Text:
    ${text}

    Assistant: {`;

    const bedrockResponse = await bedrockClient.send(new InvokeModelCommand({
      modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
    const aiContent = responseBody.content[0].text;
    const jsonStr = "{" + aiContent; // We prompted for it to start with { but Claude might duplicate or not.
    // Safe parse attempt: find first { and last }
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    const validJson = jsonStr.substring(firstBrace, lastBrace + 1);
    
    const analysisResult = JSON.parse(validJson);
    
    // 4. Update Database
    const updateQuery = `
      UPDATE "Paper"
      SET summary = $1, quiz = $2, status = 'COMPLETED'
      WHERE id = $3
    `;
    
    await pool.query(updateQuery, [
        JSON.stringify(analysisResult.summary), 
        JSON.stringify(analysisResult.quiz), 
        paperId
    ]);

    console.log(`Successfully processed paper ${paperId}`);
    return { statusCode: 200, body: "Success" };

  } catch (error) {
    console.error("Error processing paper:", error);
    // Optional: Update DB status to 'FAILED'
    return { statusCode: 500, body: error.message };
  }
};
