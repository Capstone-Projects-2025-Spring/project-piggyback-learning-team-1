# Presigned URL API

Generates a **presigned URL** for accessing videos stored in an **Amazon S3 bucket**. The presigned URL allows temporary access to the video without exposing the S3 credentials.

---

## Instance Variables

### Bucket Configuration
- **Bucket Name:** `piglet-video-uploads`

### Environment Variables
- `AWS_ACCESS_KEY_ID` – The AWS access key for authentication.
- `AWS_SECRET_ACCESS_KEY` – The AWS secret key for authentication.

---

## Public API Methods

### `GET /api/presigned-url`
Generates a presigned URL for a given video ID stored in **AWS S3**.

#### Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `id`      | String | ✅ Yes   | The **S3 Key** (filename) of the requested video. |

#### Example Usage

```ts
const res = await fetch(`/api/presigned-url?id=giant_pandas`);
const data = await res.json();
console.log(data.url); // The presigned URL to access the video
```

#### Returns

| Field   | Type   | Description |
|---------|--------|-------------|
| `url`   | String | The temporary presigned URL allowing access to the requested video. |
| `error` | String | Error message if something goes wrong. |

#### Example Response (Success)

```json
{
  "url": "https://s3.amazonaws.com/piglet-video-uploads/giant_pandas?AWSAccessKeyId=..."
}
```

#### Example Response (Error)

```json
{
  "error": "Missing id parameter"
}
```

---

## Private Methods

### `generatePresignedUrl(String id)`
Generates a presigned URL for a given **S3 object key**.

#### Parameters

| Parameter | Type   | Description |
|-----------|--------|-------------|
| `id`      | String | The S3 key (filename) of the requested video. |

#### Returns

| Type   | Description |
|--------|-------------|
| String | A presigned URL granting temporary access to the S3 object. |

#### Example Usage

```ts
const url = generatePresignedUrl("giant_pandas");
console.log(url);
```

---

## Implementation

### File: `src/app/api/presigned-url/route.ts`

```ts
import { NextResponse } from "next/server";
import { S3 } from "aws-sdk";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }

  const s3 = new S3({
    region: "us-east-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const params = {
    Bucket: "piglet-video-uploads",
    Key: id,
    Expires: 60, // URL expires in 60 seconds
  };

  try {
    const url = s3.getSignedUrl("getObject", params);
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: "Error generating URL" }, { status: 500 });
  }
}
```

---

## Error Handling

| Error                  | Status Code | Description |
|------------------------|-------------|-------------|
| **Missing ID Parameter** | `400`      | The request must include an `id` parameter. |
| **AWS SDK Failure**     | `500`      | An error occurred while generating the presigned URL. |

---

## Notes

- The presigned URL is **valid for 60 seconds**.
- Ensure **AWS credentials** are set up correctly in the environment variables.

