"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPage() {
  const { id } = useParams();
  const router = useRouter();
  const videoRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const quizTriggered = useRef(false);

  useEffect(() => {
    const initPlayer = () => {
      if (videoRef.current && window.YT && !player) {
        const newPlayer = new window.YT.Player(videoRef.current, {
          height: "500",
          width: "900",
          videoId: id as string,
          events: {
            onReady: (event: YT.PlayerEvent) => event.target.playVideo(),
            onStateChange: (event: YT.OnStateChangeEvent) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                if (intervalRef.current) clearInterval(intervalRef.current);

                intervalRef.current = setInterval(() => {
                  if (!quizTriggered.current && event.target.getCurrentTime() >= 10) {
                    quizTriggered.current = true;
                    event.target.pauseVideo();
                    clearInterval(intervalRef.current!);
                    setShowQuiz(true);
                  }
                }, 1000);
              }
            },
          },
        });
        setPlayer(newPlayer);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [id, player]);

  const handleContinueWatching = () => {
    setShowQuiz(false);
    if (player) {
      player.playVideo();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5dc] relative">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded z-50 hover:bg-gray-700 transition"
      >
        ⬅ Back
      </button>

      {/* Video Player */}
      <div className="flex-1 flex justify-center items-center">
        <div ref={videoRef} className="mt-16"></div>
      </div>

      {/*Quiz Sidebar */}
      {showQuiz && (
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
            What is the main topic of the video?
          </p>

          <ul className="w-full space-y-4">
            {["Topic 1", "Topic 2", "Topic 3", "Topic 4"].map((option, index) => (
              <li
                key={index}
                className="p-4 bg-[rgba(50,50,60,0.7)] backdrop-blur-lg rounded-xl text-white text-lg font-semibold cursor-pointer hover:bg-[rgba(80,80,90,0.8)] transition flex items-center justify-center shadow-md border border-gray-500"
              >
                {String.fromCharCode(65 + index)}) {option}
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
    </div>
  );
}
