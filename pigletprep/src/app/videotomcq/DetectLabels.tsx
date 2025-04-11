"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import ImageDisplay from "@/components/ImageDisplay";

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
  };
  Hint: string;
  correctLetter: string;
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
  const [attempts, setAttempts] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  

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
        setStartTime(Date.now());
        speakQuestion(data.question);
        // Only call if the callback exists
        onQuizDataReceived?.(data);
        setShowDetection(true);
        setLabels(data.labels || []);
        videoRef.current?.pause(); // added a pause to video once MCQ is generated 
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
    window.speechSynthesis.cancel();
    setShowQuiz(false);
    setShowSkip(false);
    setAttempts(0);
    setFeedback(null);
    setWrongAnswer(null);
    videoRef.current?.play();
  };

  const handleAnswer = async (selectedLetter: string) => {
    const isCorrect = quizData?.correctLetter === selectedLetter;

    if (isCorrect) {
      setFeedback({ message: "Correct! 🎉", isCorrect: true });
      await saveQuizAttempt(selectedLetter, true);
      setTimeout(() => {
        handleContinueWatching();
      }, 1500);
    } else {
      setFeedback({ 
        message: `Incorrect! Try again. Hint: ${quizData?.Hint}`, 
        isCorrect: false 
      });
      setWrongAnswer(selectedLetter);
      setAttempts(prev => prev + 1);
      setHintsUsed(1);
      setTimeout(() => setWrongAnswer(null), 1000);
  
      // Show skip button after 2 attempts
      if (attempts >= 1) {
        setTimeout(() => setShowSkip(true), 1000);
      }
    }
  };

  const clickedSkip = async () => {
    await saveQuizAttempt("Skipped", false);
    handleContinueWatching();
  };

  const saveQuizAttempt = async ( selectedAnswer: string, isCorrect: boolean) => {
    const timeToAnswer = startTime ? (Date.now() - startTime) / 1000 : 0;
    
    try {
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId: videoSrc,
          question: quizData?.question,
          selectedAnswer,
          correctAnswer: quizData?.correctLetter,
          isCorrect,
          timeToAnswer,
          attempts: attempts + (isCorrect ? 1 : 0),
          metrics: {
            hints: {
              used: hintsUsed > 0,
              count: hintsUsed
            },
            attemptsBeforeSuccess: isCorrect ? attempts: null, // Track attempts if correct
            timePerAttempt: timeToAnswer / (attempts + (isCorrect ? 1 : 0)) // Average time per attempt
          }
        }),
      });

      if (!response.ok) {
        console.error('Failed to save quiz attempt');
      }
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
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

          <style jsx global>{`
            @keyframes wrongShake {
              0% { transform: translateX(0); box-shadow: 0 0 0 rgba(239, 68, 68, 0); }
              25% { transform: translateX(-5px); }
              50% { transform: translateX(5px); box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
              75% { transform: translateX(-5px); }
              100% { transform: translateX(0); box-shadow: 0 0 0 rgba(239, 68, 68, 0); }
            }
          `}</style>

          <div className="w-full space-y-4">
            {Object.entries(quizData.choices).map(([letter, choice]) => ( 
                <button
                  key={letter}
                  className={`w-full p-4 backdrop-blur-lg rounded-xl text-lg font-semibold cursor-pointer transition flex items-center justify-center shadow-md border text-white ${
                    feedback && quizData.correctLetter === letter && feedback.isCorrect
                      ? 'bg-green-600 hover:bg-green-700 border-green-400'
                      : 'bg-[rgba(50,50,60,0.7)] hover:bg-[rgba(80,80,90,0.8)] border-gray-500'
                  } ${
                    wrongAnswer === letter ? 'animate-[wrongShake_0.5s_ease-in-out] bg-red-600/50 border-red-400' : ''
                  }`}
                  onClick={() => handleAnswer(letter)}
                >
                  {letter}) {choice}
                </button>
            ))}
          </div>

          {feedback && (
            <div className={`mt-4 p-4 rounded-xl text-center ${
              feedback.isCorrect 
                ? 'bg-green-600/50 border border-green-400' 
                : 'bg-red-600/50 border border-red-400'
            }`}>
              <p className="text-white font-semibold">{feedback.message}</p>
            </div>
          )}

          {showSkip && (
            <button 
              className="w-full p-4 bg-[rgba(50,50,60,0.7)] backdrop-blur-lg rounded-xl text-white text-lg font-semibold cursor-pointer hover:bg-[rgba(80,80,90,0.8)] transition flex items-center justify-center shadow-md border border-gray-500 mt-4"
              onClick={clickedSkip}
            >
              Skip Question
            </button>
          )}
        </motion.div>
      )}

      {imageData && (
        <motion.div
          initial={{ opacity: 1 }} // added fade animation to the screenshot when get MCQ button is clicked
          animate={{ opacity: 0 }}
          transition={{ duration: 10, delay: 1 }}
          onAnimationComplete={() => setImageData(null)}
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
        </motion.div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DetectLabels;
