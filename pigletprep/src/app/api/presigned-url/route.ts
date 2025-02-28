// src/app/api/presigned-url/route.ts
import { NextResponse } from "next/server";
import { S3 } from "aws-sdk";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const s3 = new S3({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: 'piglet-video-uploads',
    Key: id,
    Expires: 60, // URL expires in 60 seconds
  };

  try {
    const url = s3.getSignedUrl('getObject', params);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Error generating URL' }, { status: 500 });
  }
}