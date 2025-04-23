"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import ImageDisplay from "@/components/ImageDisplay";
import { useRouter } from "next/navigation";
import { getVideoConfig } from "@/config/videoConfig";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDetection, setShowDetection] = useState(true);
  const [showImageDetection, setShowImageDetection] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null);
  const [objectDetectionPrompt, setObjectDetectionPrompt] = useState<string | null>(null);
  const [questionComplete, setQuestionComplete] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [showContinueQuizButton, setShowContinueQuizButton] = useState(false);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lastQuestionTime, setLastQuestionTime] = useState<number>(0);

  const router = useRouter();

  // Replace the hardcoded arrays with values from config
  const videoConfig = getVideoConfig(videoSrc);
  const MCQtimes = videoConfig.MCQtimes;
  const ObjectTimes = videoConfig.ObjectTimes;

  const getTranscriptNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const segments = pathname.split('/');
      return segments[segments.length - 1];
    } catch (error) {
      console.debug("Error parsing URL:", error);
      const match = url.match(/\/video\/([^/?]+)/);
      if (match && match[1]) {
        return match[1];
      }
      const parts = url.split('/');
      const lastPart = parts[parts.length - 1].split('?')[0];
      return lastPart.replace(/\.[^/.]+$/, "");
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!video) return;

      const currentTime = Math.floor(video.currentTime);

      if (MCQtimes.includes(currentTime) && !showQuiz && currentTime !== lastQuestionTime) {
        setLastQuestionTime(currentTime);
        captureScreenshotForQuiz();
        console.log(`Quiz triggered at predefined time: ${currentTime}s`);
      }

      if (ObjectTimes.includes(currentTime) && !showImageDetection && currentTime !== lastQuestionTime) {
        setLastQuestionTime(currentTime);
        captureScreenshotForObjectDetection();
        console.log(`Object detection triggered at: ${currentTime}s`);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [MCQtimes, ObjectTimes, lastQuestionTime, showQuiz, showImageDetection]);

  useEffect(() => {
    if (showImageDetection) {
      const timer = setTimeout(() => {
        setShowContinueButton(true);
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setShowContinueButton(false);
    }
  }, [showImageDetection]);

  const captureScreenshotForQuiz = () => {
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

  const captureScreenshotForObjectDetection = () => {
    setLoading(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setLoading(false);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setLoading(false);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");

    const currentTime = Math.floor(video.currentTime);
    const targetObject = videoConfig.objectTargets?.[currentTime] || "tiger";

    setImageData(dataUrl);
    setObjectDetectionPrompt(`Click on the ${targetObject}`);
    setShowImageDetection(true);
    videoRef.current?.pause();

    setLoading(false);
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
      utterance.rate = 1.1;
      utterance.pitch = 1.4;
      utterance.volume = 1;

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
      const transcriptName = getTranscriptNameFromUrl(videoSrc);
      const currentTime = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;

      const response = await fetch("/api/analyzeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          imageBuffer: base64String,
          videoInfo: {
            transcriptName,
            currentTime
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setQuizData(data);
        setShowQuiz(true);
        setStartTime(Date.now());
        speakQuestion(data.question);
        onQuizDataReceived?.(data);
        setShowDetection(true);
        setShowImageDetection(false);
        videoRef.current?.pause();
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
    setShowSkip(false);
    setAttempts(0);
    setFeedback(null);
    setWrongAnswer(null);
    setShowContinueQuizButton(false);
    setQuestionComplete(false);
    videoRef.current?.play();
  };

  const handleAnswer = async (selectedLetter: string) => {
    if (questionComplete) return;
    const isCorrect = quizData?.correctLetter === selectedLetter;

    if (isCorrect) {
      setFeedback({ message: "Correct! 🎉", isCorrect: true });
      setQuestionComplete(true);
      await saveQuizAttempt(selectedLetter, true);
      setShowSkip(false);
      setShowContinueQuizButton(true);
      setQuestionComplete(false);
      // setTimeout(() => {
      //   handleContinueWatching();
      //   setQuestionComplete(false);
      // }, 1500);
    } else {
      setFeedback({ 
        message: `Incorrect! Try again. Hint: ${quizData?.Hint}`, 
        isCorrect: false 
      });
      setWrongAnswer(selectedLetter);
      setAttempts(prev => prev + 1);
      setHintsUsed(1);
      setTimeout(() => setWrongAnswer(null), 1000);

      if (attempts >= 1) {
        setTimeout(() => setShowSkip(true), 1000);
      }
    }
  };

  const clickedSkip = async () => {
    if (questionComplete) return; 
    setFeedback({ message: "Nice try. The correct answer was...", isCorrect: true });
    setQuestionComplete(true);
    await saveQuizAttempt("Skipped", false);
    setShowContinueQuizButton(true);
    // setTimeout(() => {
    //   handleContinueWatching(); 
    //   setQuestionComplete(false);
    // }, 3000);
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
            attemptsBeforeSuccess: isCorrect ? attempts: null,
            timePerAttempt: timeToAnswer / (attempts + (isCorrect ? 1 : 0))
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

  const handleVideoEnd = async () => {
    if (!videoSrc) {
      console.error("Video source is missing");
      return;
    }
    router.push(`/Recap?videoId=${videoSrc}`);
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
              onEnded={handleVideoEnd}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            {imageData && showImageDetection && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 20,
                }}
              >
                {objectDetectionPrompt && (
                  <div 
                    className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg text-2xl font-bold z-30"
                  >
                    {objectDetectionPrompt}
                  </div>
                )}

                <ImageDisplay
                  imageData={imageData}
                  targetObject={videoConfig.objectTargets?.[lastQuestionTime] || "tiger"}
                  onLabelClick={() => {
                    const targetObject = videoConfig.objectTargets?.[lastQuestionTime] || "tiger";
                    setObjectDetectionPrompt(`Great job! You found the ${targetObject}!`);
                    setTimeout(() => {
                      setShowImageDetection(false);
                      setObjectDetectionPrompt(null);
                      setShowContinueButton(false);
                      videoRef.current?.play();
                    }, 1500);
                  }}
                />

                {showContinueButton && (
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
                    <button
                      onClick={() => {
                        setShowImageDetection(false);
                        setObjectDetectionPrompt(null);
                        videoRef.current?.play();
                      }}
                      className="px-6 py-3 bg-gray-600/70 hover:bg-gray-700/90 text-white rounded-lg shadow-lg font-medium transition-colors"
                    >
                      Skip Detection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    
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

          {showContinueQuizButton && (
            <button
              className="w-full p-4 mt-6 bg-yellow-400 hover:bg-yellow-500 rounded-xl text-black text-lg font-semibold shadow-md border border-yellow-600 transition-colors"
              onClick={handleContinueWatching}
            >
              Continue Watching
            </button>
          )}
        </motion.div>
      )}

      {imageData && (
        <motion.div
          initial={{ opacity: 1 }}
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

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg">Loading...</p>
          </div>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DetectLabels;