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
  preferences: {
    enableOD: boolean;
    subjects: string[];
    penaltyOption: string;
  };
  onQuizDataReceived?: (data: QuizData) => void;
}

const DetectLabels: React.FC<DetectLabelsProps> = ({ videoSrc, preferences, onQuizDataReceived }) => {
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
  const [typeQuestion, setTypeQuestion] = useState<string>("MCQ");

  // NEW: track which answers have already been clicked
  const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(new Set());

  const router = useRouter();

  // Replace the hardcoded arrays with values from config
  const videoConfig = getVideoConfig(videoSrc);
  const MCQtimes = videoConfig.MCQtimes;
  const ObjectTimes = videoConfig.ObjectTimes;

  const getTranscriptNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const segments = pathname.split("/");
      return segments[segments.length - 1];
    } catch (error) {
      console.debug("Error parsing URL:", error);
      const match = url.match(/\/video\/([^/?]+)/);
      if (match && match[1]) {
        return match[1];
      }
      const parts = url.split("/");
      const lastPart = parts[parts.length - 1].split("?")[0];
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
        setTypeQuestion("MCQ");
        captureScreenshotForQuiz();
        console.log(`Quiz triggered at: ${currentTime}s`);
      }

      // Only trigger OD if enabled in preferences
      if (preferences.enableOD && ObjectTimes.includes(currentTime) && !showImageDetection && currentTime !== lastQuestionTime) {
        setLastQuestionTime(currentTime);
        setTypeQuestion("OD");
        captureScreenshotForObjectDetection();
        console.log(`Object detection triggered at: ${currentTime}s`);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [MCQtimes, ObjectTimes, lastQuestionTime, showQuiz, showImageDetection, preferences.enableOD]);

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

  useEffect(() => {
    if (showImageDetection) {
      console.log("Object detection visible");

      // This is important: protect against anything that might hide the overlay
      const protectOverlay = setInterval(() => {
        if (!document.querySelector('[data-image-display="active"]')) {
          console.log("Detection disappeared! Forcing visibility...");
          setShowImageDetection(true);
        }
      }, 1000);

      return () => clearInterval(protectOverlay);
    }
  }, [showImageDetection]);

  const captureScreenshotForQuiz = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    video.pause();

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
    const targetObject = videoConfig.objectTargets?.[currentTime];

    // Set the start time for measuring response time
    setStartTime(Date.now());

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
    if ("speechSynthesis" in window) {
      const happyText = `${getRandomIntro()} ${text}`;
      const utterance = new SpeechSynthesisUtterance(happyText);
      utterance.rate = 1.1;
      utterance.pitch = 1.4;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice =
        voices.find(
          (voice) =>
            voice.lang.includes("en") &&
            (voice.name.toLowerCase().includes("friendly") ||
              voice.name.toLowerCase().includes("natural") ||
              voice.name.toLowerCase().includes("female"))
        ) ||
        voices.find((voice) => voice.lang.includes("en")) ||
        voices[0];

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
            currentTime,
          },
          subjectFocus: preferences.subjects
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
    setSelectedAnswers(new Set());
    videoRef.current?.play();
  };

  const handleAnswer = async (selectedLetter: string) => {
    if (questionComplete) return;

    const isCorrect = quizData?.correctLetter === selectedLetter;

    // NEW: mark wrong answer as used
    if (!isCorrect) {
      setSelectedAnswers((prev) => {
        const next = new Set(prev);
        next.add(selectedLetter);
        return next;
      });
    }

    if (isCorrect) {
      setShowSkip(false);
      setFeedback({ message: "Correct! 🎉", isCorrect: true });
      setQuestionComplete(true);
      await saveQuizAttempt(selectedLetter, true);
      setShowContinueQuizButton(true);
    } else {
      setWrongAnswer(selectedLetter);
      setAttempts((prev) => prev + 1);
      setHintsUsed(1);

      // Delay feedback message by 1 second
      setTimeout(() => {
        setFeedback({
          message: `Incorrect! Hint: ${quizData?.Hint}`,
          isCorrect: false,
        });
      }, 2000);

      // Apply penalty based on preference
      if (preferences.penaltyOption === "rewind") {
        // Existing rewind behavior
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 20, 0);
            setShowQuiz(false);
            videoRef.current.play();
          }
        }, 1500);

        setTimeout(() => {
          setShowQuiz(true);
          videoRef.current?.pause();
        }, 21000);

        setTimeout(() => setWrongAnswer(null), 1000);

        // Only show skip button if using rewind penalty
        if (attempts >= 1 && !questionComplete) {
          setTimeout(() => setShowSkip(true), 2000);
        }
      } else {
        // Auto-skip behavior for "skip" penalty option
        setTimeout(() => {
          setWrongAnswer(null);
          if (questionComplete) return;
          setShowSkip(false);
          setFeedback({ message: "Nice try. The correct answer was...", isCorrect: true });
          setQuestionComplete(true);
          saveQuizAttempt("Auto-Skipped", false);
          setShowContinueQuizButton(true);
        }, 3000); // Give them time to see they were wrong
      }
    }
  };

  const clickedSkip = async () => {
    if (questionComplete) return;
    setShowSkip(false);
    setFeedback({ message: "Nice try. The correct answer was...", isCorrect: true });
    setQuestionComplete(true);
    await saveQuizAttempt("Skipped", false);
    setShowContinueQuizButton(true);
  };

  const saveQuizAttempt = async (
    selectedAnswer: string,
    isCorrect: boolean,
    questionOverride?: string,
    correctAnswerOverride?: string
  ) => {
    const timeToAnswer = startTime ? (Date.now() - startTime) / 1000 : 0;
    const questionType = typeQuestion || (showImageDetection ? "OD" : "MCQ");
    const usedHints = questionType === "OD" ? 0 : hintsUsed;

    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoSrc,
          typeOf: questionType,
          question: questionOverride || quizData?.question,
          selectedAnswer,
          correctAnswer: correctAnswerOverride || quizData?.correctLetter,
          isCorrect,
          timeToAnswer,
          attempts: attempts + (isCorrect ? 1 : 0),
          metrics: {
            hints: {
              used: usedHints > 0,
              count: usedHints,
            },
            attemptsBeforeSuccess: isCorrect ? attempts : null,
            timePerAttempt: timeToAnswer / (attempts + (isCorrect ? 1 : 0) || 1),
          },
        }),
      });

      if (!response.ok) {
        console.error("Failed to save quiz attempt");
      }
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
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
          <div style={{ position: "relative", width: "960px", height: "540px" }}>
            <video
              ref={videoRef}
              width="960"
              height="540"
              controls
              crossOrigin="anonymous"
              style={{ display: "block" }}
              onEnded={handleVideoEnd}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>

            {imageData && showImageDetection && (
              <div
                data-image-display="active"
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
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-8 py-4 rounded-lg text-3xl font-bold z-30">
                    {objectDetectionPrompt}
                  </div>
                )}

                <ImageDisplay
                  imageData={imageData}
                  targetObject={videoConfig.objectTargets?.[lastQuestionTime]}
                  onLabelClick={async () => {
                    const targetObject = videoConfig.objectTargets?.[lastQuestionTime];
                    setObjectDetectionPrompt(`Great job! You found the ${targetObject}!`);
                    await saveQuizAttempt("Clicked", true, `Click on the ${targetObject}`, "Clicked");
                    setTimeout(() => {
                      setShowImageDetection(false);
                      setObjectDetectionPrompt(null);
                      setShowContinueButton(false);
                      videoRef.current?.play();
                    }, 1500);
                  }}
                />

                {/* Position the skip button appropriately for the larger video */}
                {showContinueButton && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30">
                    <button
                      onClick={async () => {
                        const t = Math.floor(videoRef.current!.currentTime);
                        const obj = videoConfig.objectTargets?.[t];
                        await saveQuizAttempt("Skipped", false, `Click on the ${obj}`, "Clicked");
                        setShowImageDetection(false);
                        setObjectDetectionPrompt(null);
                        videoRef.current?.play();
                      }}
                      className="px-8 py-4 bg-gray-600/70 hover:bg-gray-700/90 text-white text-xl rounded-lg shadow-lg"
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
          <p className="text-lg text-gray-300 text-center mb-6">{quizData.question}</p>

          <style jsx global>{`
            @keyframes wrongShake {
              0% { transform: translateX(0); }
              25% { transform: translateX(-5px); }
              50% { transform: translateX(5px); box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
              75% { transform: translateX(-5px); }
              100% { transform: translateX(0); }
            }
          `}</style>

          <div className="w-full space-y-4">
            {Object.entries(quizData.choices).map(([letter, choice]) => (
              <button
                key={letter}
                disabled={selectedAnswers.has(letter)}
                onClick={() => handleAnswer(letter)}
                className={`
                  w-full p-4 backdrop-blur-lg rounded-xl text-lg font-semibold flex items-center justify-center shadow-md border text-white transition
                  ${
                    feedback && quizData.correctLetter === letter && feedback.isCorrect
                      ? "bg-green-600 hover:bg-green-700 border-green-400"
                      : selectedAnswers.has(letter)
                      ? "bg-gray-600 border-gray-500 cursor-not-allowed opacity-50"
                      : "bg-[rgba(50,50,60,0.7)] hover:bg-[rgba(80,80,90,0.8)] border-gray-500"
                  }
                  ${wrongAnswer === letter ? "animate-[wrongShake_0.5s_ease-in-out] bg-red-600/50 border-red-400" : ""}
                `}
              >
                {letter}) {choice}
              </button>
            ))}
          </div>

          {feedback && (
            <div
              className={`mt-4 p-4 rounded-xl text-center ${
                feedback.isCorrect ? "bg-green-600/50 border-green-400" : "bg-red-600/50 border-red-400"
              }`}
            >
              <p className="text-white font-semibold">{feedback.message}</p>
            </div>
          )}

          {/* Only show skip button if penalty is rewind */}
          {showSkip && preferences.penaltyOption === "rewind" && (
            <button
              className="w-full p-4 mt-4 bg-[rgba(50,50,60,0.7)] rounded-xl text-white hover:bg-[rgba(80,80,90,0.8)]"
              onClick={clickedSkip}
            >
              Skip Question
            </button>
          )}

          {showContinueQuizButton && (
            <button
              className="w-full p-4 mt-6 bg-yellow-400 hover:bg-yellow-500 rounded-xl text-black"
              onClick={handleContinueWatching}
            >
              Continue Watching
            </button>
          )}
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
