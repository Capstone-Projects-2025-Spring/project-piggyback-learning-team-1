//Image to MCQ

"use client";

import { useRef, useState } from "react";

interface Label {
  Name: string;
  Confidence: number;
}

const DetectLabels = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [labels, setLabels] = useState<Label[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mcq, setMcq] = useState<string | null>(null); // State for the generated MCQ

  const captureScreenshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // convert screenshot to a base64 image
    const dataUrl = canvas.toDataURL("image/png");
    setImageData(dataUrl);

    processImage(dataUrl);
  };

  const resizeImage = (base64Image: string, maxWidth: number = 1024, maxHeight: number = 1024) => {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        if (ctx) {
          let width = img.width;
          let height = img.height;
  
          // resize the image to fit rekognition
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
  
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
  
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject("Error resizing image");
        }
      };
      img.onerror = reject;
    });
  };

  const processImage = async (base64Image: string) => {
    try {
      const resizedImage = await resizeImage(base64Image);
  
      const base64String = resizedImage.split(",")[1];
  
      const response = await fetch("/api/detectLabels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBuffer: base64String }),
      });
  
      const data = await response.json();
      console.log("AWS Rekognition Response:", data);
  
      if (response.ok) {
        setLabels(data.Labels);
        // generate MCQ using rekognition labels
        const mcqResponse = await fetch("/api/detectLabels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBuffer: base64String }),  // send the image to generate make the MCQ
        });
        
        const mcqData = await mcqResponse.json();
        if (mcqResponse.ok) {
          setMcq(mcqData.mcq);
        } else {
          setError(mcqData.error || "Error generating MCQ");
        }
      } else {
        setError(data.error || "Error detecting labels");
      }
    } catch (err) {
      setError((err as Error).message || "Error processing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* video */}
      <video ref={videoRef} width="640" height="360" controls crossOrigin="anonymous">
        <source src="/testvideo.mp4" type="video/mp4" />
      </video>

      <button onClick={captureScreenshot} disabled={loading} style={{ display: "block", margin: "10px auto" }}>
        {loading ? "Processing..." : "Capture Screenshot"}
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {/* screenshot Preview */}
      {imageData && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "white",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <img src={imageData} alt="Screenshot" style={{ width: "150px", height: "auto", borderRadius: "5px" }} />
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {labels && (
        <div>
          <h2>Detected Labels:</h2>
          <ul>
            {labels.map((label, index) => (
              <li key={index}>
                {label.Name} - Confidence: {label.Confidence.toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {mcq && (
        <div>
          <h2>Generated Multiple-Choice Question:</h2>
          <p>{mcq}</p>
        </div>
      )}

    </div>
  );
};

export default DetectLabels;