import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { imageBuffer } = await req.json();

    if (!imageBuffer) {
      throw new Error("No image provided.");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Look at the image from the learning video. Identify the most important object in the scene — the one the lesson is most likely about. Then print the following sentence, replacing {object name} with the name of that object: 'Click on the {object name}!'"
            },
            { type: "image_url", image_url: { url: `data:image/png;base64,${imageBuffer}` } }
          ]
        }
      ],
    });

    const gptResponse = completion.choices[0].message.content;

    return new Response(
      JSON.stringify({ output: gptResponse }),
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
