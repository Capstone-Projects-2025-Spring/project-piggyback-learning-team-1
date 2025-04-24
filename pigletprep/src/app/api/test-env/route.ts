import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ACCESSKEY: process.env.ACCESSKEY,
    SECRETKEY: process.env.SECRETKEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AWS_REGION: process.env.OPENAI_API_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    HELLO: process.env.HELLO,
  });
}