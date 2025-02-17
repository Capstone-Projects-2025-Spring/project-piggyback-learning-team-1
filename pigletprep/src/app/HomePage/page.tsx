"use client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function HomePage() {
  const [player, setPlayer] = useState<any>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.body.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        if (videoRef.current) {
          const newPlayer = new window.YT.Player(videoRef.current, {
            events: {
              onReady: (event: any) => event.target.playVideo(),
              onStateChange: (event: any) => checkVideoTime(event),
            },
          });
          setPlayer(newPlayer);
        }
      };
    };

    loadYouTubeAPI();
  }, []);

  const checkVideoTime = (event: any) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      const interval = setInterval(() => {
        const time = event.target.getCurrentTime();
        if (time >= 10) {
          event.target.pauseVideo();
          clearInterval(interval);
          setShowQuestion(true);
        }
      }, 1000);
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen min-w-screen"
      initial={{ backgroundColor: "#e9ccd1", color: "#000000" }}
      animate={{ backgroundColor: "#f5f5dc", color: "#006400" }}
      transition={{ duration: 8 }}
    >
      <motion.h1
        className="text-4xl font-bold border-b-4 border-[#FFC0CB] pb-1 m-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
        }}
      >
        Start Watching
      </motion.h1>

      <div className="flex flex-col justify-center p-16 gap-y-24">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeInOut" }}
        >
          <iframe
            ref={videoRef}
            className="rounded-3xl border-10 hover:shadow-2xl transition-all duration-700 ease-out"
            width="900"
            height="500"
            src="https://www.youtube.com/embed/vCkhJeom7zU?enablejsapi=1"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>

      {showQuestion && (
        <div className="p-8 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">Quiz Time!</h2>
          <p>What is the main topic of the video?</p>
          <ul className="list-disc text-left">
            <li>A) Topic 1</li>
            <li>B) Topic 2</li>
            <li>C) Topic 3</li>
            <li>D) Topic 4</li>
          </ul>
        </div>
      )}

      <footer className="w-full p-4 bg-darkgreen text-white flex justify-center items-center mt-20">
        <p>&copy; Piglet Prep 2025. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}


//Took out Youtube
// "https://www.youtube.com/embed/4Unv7rw5HNk?si=0Pjz-6zyVU_1WDjE",
// "https://www.youtube.com/embed/7MazdjHtbw0?si=SzoKIdKIQTuzAbfx",
// "https://www.youtube.com/embed/IIXxhSIlU4M?si=621KmyHFVDJOQoLL",
// "https://www.youtube.com/embed/QM2-MX1Lz-A?si=SlQcu6qqP95hWqey",