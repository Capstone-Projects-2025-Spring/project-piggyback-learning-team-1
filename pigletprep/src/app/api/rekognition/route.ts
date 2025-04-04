// import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition';

// const client = new RekognitionClient({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId:"AKIAYSE4OENEFFLZ4HP7",
//     secretAccessKey: "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",
//   },
// });

// export async function POST(req) {
//   try {
//     // Parse the incoming request
//     const { imageBuffer } = await req.json();
//     if (!imageBuffer) {
//       throw new Error("No image buffer provided");
//     }

//     const params = {
//       Image: {
//         Bytes: Buffer.from(imageBuffer, 'base64'), // Convert image buffer to base64
//       },
//     };

//     const command = new DetectLabelsCommand(params);
//     const result = await client.send(command); // Call Rekognition API

//     // Return successful response
//     return new Response(JSON.stringify(result), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     // Log the error to the console for debugging
//     console.error('Error during Rekognition API call:', error);

//     // Return error response with details
//     return new Response(
//       JSON.stringify({
//         error: 'Error detecting labels',
//         details: error.message,
//       }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { RekognitionClient, DetectLabelsCommand } from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient({
  region: "us-east-1",
  credentials: {
    accessKeyId:"AKIAYSE4OENEFFLZ4HP7",
    secretAccessKey: "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",
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
