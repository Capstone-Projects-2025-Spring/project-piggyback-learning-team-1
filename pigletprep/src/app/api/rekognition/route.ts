import { NextRequest, NextResponse } from "next/server";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.accessKeyId ?? (() => { throw new Error("Missing ACCESSKEYIDANDREW"); })(),
    secretAccessKey: process.env.secretAccessKey ?? (() => { throw new Error("Missing SECRETACCESSKEYANDREW"); })(),
  },
});

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      console.error("Error: Missing image data");
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");

    if (imageBuffer.length === 0) {
      console.error("Error: Empty image buffer");
      return NextResponse.json({ error: "Invalid image data" }, { status: 400 });
    }

    const params = {
      Image: { Bytes: imageBuffer },
      MaxLabels: 10,
      MinConfidence: 90,
    };

    const command = new DetectLabelsCommand(params);
    const data = await rekognition.send(command);

    console.log("Rekognition Response:", JSON.stringify(data, null, 2));

    if (!data.Labels || !Array.isArray(data.Labels)) {
      console.error("Error: No labels detected");
      return NextResponse.json({ error: "No labels detected" }, { status: 500 });
    }

    return NextResponse.json(data.Labels);
  } catch (error: unknown) { 
    console.error("Rekognition Error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Rekognition failed due to an unknown error" },
      { status: 500 }
    );
  }
}
