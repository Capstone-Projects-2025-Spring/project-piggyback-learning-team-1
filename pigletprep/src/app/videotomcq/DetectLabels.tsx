"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import ImageDisplay from "../ObjectDetect/page";

interface Label {
  Name: string;
  Confidence: number;
  BoundingBox?: {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
  };
}

interface QuizData {
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
    Hint: string;
  };
  correctAnswer: string;
}

interface DetectLabelsProps {
  videoSrc: string;
  onQuizDataReceived?: (data: QuizData) => void;
}

const DetectLabels: React.FC<DetectLabelsProps> = ({ videoSrc, onQuizDataReceived }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [imageData, setImageData] = useState<string | null>(null);
  const [labels, setLabels] = useState<Label[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [videoDims, setVideoDims] = useState({ width: 640, height: 360 });
  const [showDetection, setShowDetection] = useState(true);
  const [showImageDetection, setShowImageDetection] = useState(true);

  const captureScreenshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    setVideoDims({ width: video.videoWidth, height: video.videoHeight });

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setImageData(dataUrl);

    sendImageToGPT(dataUrl);
  };

  const sendImageToGPT = async (base64Image: string) => {
    try {
      const base64String = base64Image.split(",")[1];

      const response = await fetch("/api/analyzeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBuffer: base64String }),
      });

      const data = await response.json();

      if (response.ok) {
        setQuizData(data);
        setShowQuiz(true);
        onQuizDataReceived?.(data);
        setLabels(data.labels || []);
        setShowDetection(true); // 👈 reset detection frame visibility when new labels come in
      } else {
        setError(data.error || "Error generating MCQ");
      }
    } catch (err) {
      setError((err as Error).message || "Error processing image");
    } finally {
      setLoading(false);
    }
  };

  const handleLabelClick = () => {
    setShowDetection(false);
  };

  const handleContinueWatching = () => {
    setShowQuiz(false);
    videoRef.current?.play();
  };

  return (
    <div style={{ textAlign: "center" }}>
      {showDetection && (
        <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ position: "relative", width: "640px", height: "360px" }}>
            <video
              ref={videoRef}
              width="640"
              height="360"
              controls
              crossOrigin="anonymous"
              style={{ display: "block" }}
              onLoadedMetadata={() => {
                const video = videoRef.current;
                if (video) {
                  setVideoDims({
                    width: video.videoWidth,
                    height: video.videoHeight,
                  });
                }
              }}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            {imageData && showImageDetection && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "640px",
                  height: "360px",
                  zIndex: 10,
                }}
              >
                <ImageDisplay
                  imageData={imageData}
                  onLabelClick={() => setShowImageDetection(false)}
                />
              </div>
            )}
          </div>

          {labels?.map((label, idx) => {
            const { width, height } = videoDims;
            const box = label.BoundingBox;

            const top = box ? box.Top * height : 40 + idx * 40;
            const left = box ? box.Left * width : 20;
            const boxWidth = box ? box.Width * width : undefined;
            const boxHeight = box ? box.Height * height : undefined;

            return (
              <div
                key={idx}
                onClick={handleLabelClick}
                style={{
                  position: "absolute",
                  top: `${top}px`,
                  left: `${left}px`,
                  width: boxWidth ? `${boxWidth}px` : "auto",
                  height: boxHeight ? `${boxHeight}px` : "auto",
                  background: "rgba(255, 255, 255, 0.85)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  fontWeight: "bold",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  zIndex: 10,
                }}
              >
                {label.Name} ({label.Confidence.toFixed(1)}%)
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={captureScreenshot}
        disabled={loading}
        style={{
          display: "block",
          margin: "10px auto",
          color: "black",
        }}
      >
        {loading ? "Processing..." : "Get Multiple Choice Question"}
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {showQuiz && quizData && (
        <motion.div
          className="fixed top-0 right-0 h-full w-96 backdrop-blur-xl bg-[rgba(20,20,20,0.7)] border border-gray-700 shadow-xl rounded-l-3xl p-8 flex flex-col justify-center items-center"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-extrabold text-[#f8f9fa] drop-shadow-lg mb-4">
            Quiz Time! 🎯
          </h2>
          <p className="text-lg text-gray-300 text-center mb-6">
            {quizData.question}
          </p>

          <ul className="w-full space-y-4">
            {Object.entries(quizData.choices).map(([letter, choice]) => (
              <li
                key={letter}
                className="p-4 bg-[rgba(50,50,60,0.7)] backdrop-blur-lg rounded-xl text-white text-lg font-semibold cursor-pointer hover:bg-[rgba(80,80,90,0.8)] transition flex items-center justify-center shadow-md border border-gray-500"
              >
                {letter}) {choice}
              </li>
            ))}
          </ul>

          <button
            className="mt-8 bg-green-500 text-white text-lg font-bold px-6 py-3 rounded-xl hover:bg-green-600 transition shadow-lg"
            onClick={handleContinueWatching}
          >
            Continue Watching
          </button>
        </motion.div>
      )}


      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DetectLabels;
