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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image and generate a multiple-choice question based on its contents that a kindergartener can answer. Respond with this format only after the colon here: Insert Question Here, A) Choice A B) Choice B C) Choice C D) Choice D Correct Answer: Correct Answer Here Hint: Hint Here" },
            { type: "image_url", image_url: { url: `data:image/png;base64,${imageBuffer}` } }
          ]
        }
      ],
    });

    console.log("GPT Response:", completion.choices[0].message.content);
    const mcq = completion.choices[0].message.content;
    const pattern = /^(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)\s*Correct Answer:\s*([A-D])\)[^)]+Hint:\s*(.*)$/; // changed regex to match new format, since I only need the correct letter choice to check answer
    const matches = mcq.match(pattern);
    if (matches) {
      const question = matches[1].trim();
      const choiceA = matches[2].trim();
      const choiceB = matches[3].trim();
      const choiceC = matches[4].trim();
      const choiceD = matches[5].trim();
      const correctLetter = matches[6].trim();
      const Hint = matches[7].trim();

      return new Response(
        JSON.stringify({
          question,
          choices: {
            A: choiceA,
            B: choiceB,
            C: choiceC,
            D: choiceD,
          },
          Hint, // moved the Hint to its own object
          correctLetter
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to parse MCQ response" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
