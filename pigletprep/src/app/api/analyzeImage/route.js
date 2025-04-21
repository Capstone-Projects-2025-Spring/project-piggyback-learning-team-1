import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { imageBuffer, videoInfo } = await req.json();

    if (!imageBuffer) {
      return NextResponse.json({ error: "No image provided." }, { status: 400 });
    }

    // Try to get transcript for the current timestamp
    let transcriptText = null;
    if (videoInfo?.transcriptName && videoInfo?.currentTime !== undefined) {
      try {
        const transcriptPath = path.join(
          process.cwd(),
          'public',
          'transcripts',
          `${videoInfo.transcriptName}.json`
        );

        if (fs.existsSync(transcriptPath)) {
          const transcriptData = JSON.parse(fs.readFileSync(transcriptPath, 'utf8'));
          
          // Find entries around the current timestamp (±15 seconds)
          const currentTime = videoInfo.currentTime;
          const windowStart = Math.max(0, currentTime - 15);
          const windowEnd = currentTime;

          console.log(`Searching for transcript entries between ${windowStart}s and ${windowEnd}s`);
          
          const relevantEntries = transcriptData.filter(entry => {
            const startTime = typeof entry.start === 'number' 
              ? entry.start 
              : parseFloat(entry.start || '0');
            return startTime >= windowStart && startTime <= windowEnd;
          });
          
          transcriptText = relevantEntries.map(entry => entry.text).join(' ');
        }
      } catch (err) {
        console.error("Error loading transcript:", err);
        // Continue without transcript
      }
    }

    // Build prompt with transcript if available
    let promptText = "Analyze this image and generate a multiple-choice question based on its contents that a kindergartener can answer.";
    
    if (transcriptText) {
      promptText = `
        You are creating a quiz for children watching an educational video.

        The transcript at this moment in the video says:
        "${transcriptText}"

        Based on this transcript and the image from this part of the video, generate a multiple-choice question that a kindergartener can understand and answer.

        Your question should be directly related to what's being discussed at this moment in the video.
      `.trim();
    }
    

    // Add the required format
    promptText += " Respond with this format only after the colon here: Insert Question Here, A) Choice A B) Choice B C) Choice C D) Choice D Correct Answer: Correct Answer Here Hint: Hint Here";

    // Send to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or your preferred model
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: promptText },
            { type: "image_url", image_url: { url: `data:image/png;base64,${imageBuffer}` } }
          ]
        }
      ],
    });

    // Parse the response
    const mcq = completion.choices[0].message.content;
    const pattern = /^(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)\s*Correct Answer:\s*([A-D])\).*?Hint:\s*(.*)$/s;
    const matches = mcq.match(pattern);
    
    if (matches) {
      const question = matches[1].trim();
      const choiceA = matches[2].trim();
      const choiceB = matches[3].trim();
      const choiceC = matches[4].trim();
      const choiceD = matches[5].trim();
      const correctLetter = matches[6].trim();
      const Hint = matches[7].trim();

      return NextResponse.json({
        question,
        choices: {
          A: choiceA,
          B: choiceB,
          C: choiceC,
          D: choiceD,
        },
        Hint,
        correctLetter
      });
    } else {
      return NextResponse.json({ 
        error: "Failed to parse MCQ response",
        raw: mcq
      }, { status: 400 });
    }

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ 
      error: "Error analyzing image", 
      details: error.message 
    }, { status: 500 });
  }
}