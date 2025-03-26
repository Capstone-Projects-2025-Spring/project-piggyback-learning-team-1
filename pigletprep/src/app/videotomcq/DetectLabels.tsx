"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Label {
  Name: string;
  Confidence: number;
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

  const captureScreenshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    setImageData(dataUrl);

    sendImageToGPT(dataUrl);
  };

  const friendlyIntro = [
    "Here we go! Question time!",
    "Alright, challenge time!",
    "Ooo, this one's fun! Here it is:",
    "Quiz break! Can you solve this?",
    "Okay, listen up! Let's test your knowledge:",
  ];
  
  const getRandomIntro = () => friendlyIntro[Math.floor(Math.random() * friendlyIntro.length)];

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      const happyText = `${getRandomIntro()} ${text}`;
      const utterance = new SpeechSynthesisUtterance(happyText);
      utterance.rate = 1.1; //speed
      utterance.pitch = 1.4; //pitch
      utterance.volume = 1; //volume
      
      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice = voices.find((voice) => voice.name.includes("Google UK English Female")) 
                        || voices.find((voice) => voice.lang.includes("en") && voice.name.includes("WaveNet")) 
                        || voices[0];
  
      if (friendlyVoice) utterance.voice = friendlyVoice;
  
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-Speech not supported in this browser.");
    }
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
        speakQuestion(data.question);
        // Only call if the callback exists
        onQuizDataReceived?.(data);
        setLabels(data.labels || []);
      } else {
        setError(data.error || "Error generating MCQ");
      }
    } catch (err) {
      setError((err as Error).message || "Error processing image");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueWatching = () => {
    window.speechSynthesis.cancel();
    setShowQuiz(false);
    videoRef.current?.play();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <video ref={videoRef} width="640" height="360" controls crossOrigin="anonymous">
        <source src={videoSrc} type="video/mp4" />
      </video>

      <button 
        onClick={captureScreenshot} 
        disabled={loading} 
        style={{ display: "block", margin: "10px auto", color: "black" }}
      >
        {loading ? "Processing..." : "Get Multiple Choice Question"}
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    
      {/* Quiz Sidebar */}
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
    </div>
  );
};

export default DetectLabels;
