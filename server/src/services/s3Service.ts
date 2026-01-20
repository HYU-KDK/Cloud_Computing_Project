import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' });
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export const uploadPdfToS3 = async (fileBuffer: Buffer, paperId: string) => {
  if (!BUCKET_NAME) throw new Error("S3_BUCKET_NAME is not defined");

  const key = `${paperId}.pdf`;
  
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: 'application/pdf'
  }));

  return key;
};
