import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { imageBuffer } = await req.json(); // Receive base64 image

    if (!imageBuffer) {
      throw new Error("No image provided.");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image and generate a multiple-choice question based on its contents." },
            { type: "image_url", image_url: { url: `data:image/png;base64,${imageBuffer}` } }
          ]
        }
      ],
    });

    const mcq = completion.choices[0].message.content;

    return new Response(
      JSON.stringify({ mcq }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error analyzing image", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
