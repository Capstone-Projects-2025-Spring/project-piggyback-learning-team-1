// import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition';

// const client = new RekognitionClient({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// export async function POST(req) {
//   try {
//     const { imageBuffer } = await req.json();  // Get the image buffer from the request body

//     const params = {
//       Image: {
//         Bytes: Buffer.from(imageBuffer, 'base64'),  // Convert image buffer to base64
//       },
//     };

//     const command = new DetectLabelsCommand(params);
//     const result = await client.send(command);  // Call Rekognition API

//     // Return response with status 200 and result
//     return new Response(JSON.stringify(result), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     // Return error response
//     return new Response(
//       JSON.stringify({ error: 'Error detecting labels', details: error.message }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }


import { OpenAI } from 'openai';
import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new RekognitionClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const { imageBuffer } = await req.json();  // Get the image buffer from the request body

    const params = {
      Image: {
        Bytes: Buffer.from(imageBuffer, 'base64'),
      },
    };

    const command = new DetectLabelsCommand(params);
    const rekognitionResult = await client.send(command);  // Get labels from Rekognition

    // Extract label names from Rekognition result
    const labels = rekognitionResult.Labels?.map(label => label.Name).slice(0, 4); // Top 4 labels

    if (!labels || labels.length === 0) {
      throw new Error('No labels detected.');
    }

    // Construct a prompt for GPT-4 to generate a multiple-choice question
    const prompt = `
    Given the following labels: ${labels.join(', ')}, 
    create a multiple-choice question with 4 options, 
    where only one option is correct. Make the question engaging and clear.`;

    // Generate MCQ using GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const mcq = completion.choices[0].message.content;

    // Return response with MCQ and labels
    return new Response(
      JSON.stringify({ labels, mcq }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Error generating MCQ', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
