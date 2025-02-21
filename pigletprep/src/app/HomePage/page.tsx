"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ImProfile } from "react-icons/im";
import PinLockPage from "../components/PinLockPage"; 

// Declare global types for the YouTube API to pass the linter
// extends the global window object to include the YT object
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

const videoIds = [
  "vCkhJeom7zU",
  "4Unv7rw5HNk",
  "7MazdjHtbw0",
  "IIXxhSIlU4M",
  "QM2-MX1Lz-A",
];

export default function HomePage() {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState(videoIds[0]); // holds ID of the current video
  const [showQuestion, setShowQuestion] = useState(false); // whether to show the quiz overlay
  const [showThumbnails, setShowThumbnails] = useState(true); // whether to show the thumbnails grid
  const videoRef = useRef<HTMLDivElement>(null);
  const [showPinLock, setShowPinLock] = useState(false); // State to show/hide the PIN lock modal

  // Initialize the YouTube player when the API is ready
  useEffect(() => {
    const initPlayer = () => {
      if (videoRef.current && !player) {
        const newPlayer = new window.YT.Player(videoRef.current, {
          height: "500",
          width: "900",
          videoId: currentVideoId,
          events: {
            onReady: (event: YT.PlayerEvent) => event.target.playVideo(),
            onStateChange: (event: YT.OnStateChangeEvent) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                // Check every second until 10 seconds have passed
                const interval = setInterval(() => {
                  if (event.target.getCurrentTime() >= 10) {
                    event.target.pauseVideo();
                    clearInterval(interval);
                    setShowQuestion(true);
                  }
                }, 1000);
              }
            },
          },
        });
        setPlayer(newPlayer);
      }
    };

    window.onYouTubeIframeAPIReady = initPlayer;

    // Load the YouTube API script if it isn't already present
    if (!window.YT) {
      if (!document.querySelector("script[src='https://www.youtube.com/iframe_api']")) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        tag.async = true;
        document.body.appendChild(tag);
      }
    } else {
      initPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When the current video changes, load the new video if the player exists
  useEffect(() => {
    if (player && typeof player.loadVideoById === "function") {
      player.loadVideoById(currentVideoId);
      setShowQuestion(false);
    }
  }, [currentVideoId, player]);

  // Thumbnail click handler, sets the current video ID and hides thumbnails
  const handleThumbnailClick = (id: string) => {
    setCurrentVideoId(id);
    setShowThumbnails(false);
  };

  // back button handler, pauses video and shows thumbnails
  const handleBack = () => {
    if (player) {
      player.pauseVideo();
    }
    setShowThumbnails(true);
    setShowQuestion(false);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen min-w-screen relative"
      initial={{ backgroundColor: "#e9ccd1", color: "#000000" }}
      animate={{ backgroundColor: "#f5f5dc", color: "#006400" }}
      transition={{ duration: 8 }}
    >
      {/* Back button: visible when thumbnails are hidden */}
      {!showThumbnails && (
        <button
          onClick={handleBack}
          className="fixed top-4 left-4 bg-gray-800 text-white px-4 py-2 rounded z-50"
        >
          Back
        </button>
      )}
  
      {/*Icon for PIN Page */}
      <ImProfile
        className="absolute top-4 right-4 text-3xl cursor-pointer"
        // Set state to true when the icon is clicked, showing the PIN lock modal
        onClick={() => setShowPinLock(true)}
      />

      <motion.h1
        className="text-4xl font-bold border-b-4 border-[#FFC0CB] pb-1 m-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Start Watching
      </motion.h1>

      {/* Main video player */}
      <div className="flex flex-col justify-center p-16 gap-y-24">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeInOut" }}
        >
          <div
            ref={videoRef}
            className="rounded-3xl border-10 hover:shadow-2xl transition-all duration-700 ease-out"
          ></div>
        </motion.div>
      </div>

      {/* Thumbnails grid */}
      {showThumbnails && (
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex gap-4">
            {videoIds.slice(0, 3).map((id) => (
              <Image
                key={id}
                src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                alt="Video thumbnail"
                width={256}
                height={144}
                className="object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleThumbnailClick(id)}
              />
            ))}
          </div>
          <div className="flex gap-4">
            {videoIds.slice(3).map((id) => (
              <Image
                key={id}
                src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                alt="Video thumbnail"
                width={256}
                height={144}
                className="object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleThumbnailClick(id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quiz overlay */}
      {showQuestion && (
        <div className="p-8 bg-white shadow-lg rounded-lg text-center mb-8">
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

      {/* Footer */}
      <footer className="w-full p-4 bg-darkgreen text-white flex justify-center items-center mt-20">
        <p>&copy; Piglet Prep 2025. All rights reserved.</p>
      </footer>

      <AnimatePresence>
        {showPinLock && (
          <PinLockPage // Component rendered when showPinLock is true
            // Thesse are the functions that will be passed down to the PinLockPage component as props
            onClose={() => setShowPinLock(false)} 
            onSuccess={() => setShowPinLock(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}