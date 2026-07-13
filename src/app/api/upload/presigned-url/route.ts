import { NextRequest, NextResponse } from 'next/server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const runtime = 'nodejs';

const AWS_REGION = process.env.AWS_REGION;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const S3_PUBLIC_URL = process.env.NEXT_PUBLIC_S3_PUBLIC_URL;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const sanitizeFileName = (fileName: string) => {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9а-яіїєґ._-]/gi, '');
};

export async function POST(request: NextRequest) {
  if (!AWS_REGION || !AWS_S3_BUCKET || !S3_PUBLIC_URL) {
    return NextResponse.json(
      {
        message: 'S3 environment variables are not configured',
      },
      {
        status: 500,
      },
    );
  }

  const body = await request.json();

  const fileName = String(body.fileName ?? '');
  const fileType = String(body.fileType ?? 'application/octet-stream');

  if (!fileName) {
    return NextResponse.json(
      {
        message: 'fileName is required',
      },
      {
        status: 400,
      },
    );
  }

  const safeFileName = sanitizeFileName(fileName);
  const key = `products/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}-${safeFileName}`;

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60,
  });

  return NextResponse.json({
    uploadUrl,
    fileUrl: `${S3_PUBLIC_URL}/${key}`,
    key,
  });
}
