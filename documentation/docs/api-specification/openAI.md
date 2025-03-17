# Image Analysis API

Processes an **image input** and generates a **multiple-choice question (MCQ)** based on its contents using OpenAI's GPT-4o model.

---

## Instance Variables

### Environment Variables
- `OPENAI_API_KEY` – The API key for authenticating requests to OpenAI's API.

---

## Public API Methods

### `POST /api/analyze-image`
Analyzes the provided image and generates a multiple-choice question.

#### Parameters

| Parameter      | Type   | Required | Description |
|---------------|--------|----------|-------------|
| `imageBuffer` | String | ✅ Yes   | Base64-encoded string representing the image content. |

#### Example Usage

```ts
const response = await fetch('/api/analyze-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ imageBuffer: '<BASE64_IMAGE_STRING>' }),
});

const data = await response.json();
console.log(data.mcq); // Multiple-choice question generated from the image
```

#### Returns

| Field   | Type   | Description |
|---------|--------|-------------|
| `mcq`   | String | The generated multiple-choice question based on the image. |
| `error` | String | Error message if something goes wrong. |

#### Example Response (Success)

```json
{
  "mcq": "What object is most prominently displayed in the image?\nA) Apple\nB) Banana\nC) Carrot\nD) Orange"
}
```

#### Example Response (Error)

```json
{
  "error": "No image provided."
}
```

---

## Private Methods

### `generateMCQ(String imageBuffer)`
Processes the provided image and generates a multiple-choice question using OpenAI.

#### Parameters

| Parameter      | Type   | Description |
|---------------|--------|-------------|
| `imageBuffer` | String | Base64-encoded image data. |

#### Returns

| Type   | Description |
|--------|-------------|
| String | A multiple-choice question based on the image. |

#### Example Usage

```ts
const mcq = generateMCQ('<BASE64_IMAGE_STRING>');
console.log(mcq);
```

---

## Implementation

### File: `src/app/api/analyze-image/route.ts`

```ts
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
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error analyzing image", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
```

---

## Error Handling

| Error                  | Status Code | Description |
|------------------------|-------------|-------------|
| **No Image Provided**  | `400`      | The request must include an `imageBuffer` parameter. |
| **OpenAI API Failure** | `500`      | An error occurred while processing the image and generating the question. |

---

## Notes

- The API accepts **base64-encoded images** as input.
- Ensure **OPENAI_API_KEY** is correctly set in the environment variables.
- The response is a text-based multiple-choice question derived from the image content.