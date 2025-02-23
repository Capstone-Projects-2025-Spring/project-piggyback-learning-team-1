"use client";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ImProfile } from "react-icons/im";
import PinLockPage from "../components/PinLockPage"; 

/**
 * Extend the global window object to include YouTube API properties.
 *
 * @global
 */
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

/**
 * An array of YouTube video IDs used to load videos.
 *
 * @type {string[]}
 */
const videoIds = [
  "vCkhJeom7zU",
  "4Unv7rw5HNk",
  "7MazdjHtbw0",
  "IIXxhSIlU4M",
  "QM2-MX1Lz-A",
];

/**
 * The HomePage component renders the main page that includes the YouTube video player,
 * video thumbnails grid, quiz overlay, and PIN lock modal.
 *
 * @returns {JSX.Element} The rendered HomePage component.
 */
export default function HomePage() {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState(videoIds[0]); // holds ID of the current video
  const [showQuestion, setShowQuestion] = useState(false); // whether to show the quiz overlay
  const [showThumbnails, setShowThumbnails] = useState(true); // whether to show the thumbnails grid
  const videoRef = useRef<HTMLDivElement>(null);
  const [showPinLock, setShowPinLock] = useState(false); // State to show/hide the PIN lock modal

  /**
   * Initializes the YouTube player when the YouTube Iframe API is ready.
   * The player is created only if the video container is available and the player isn't already set.
   */
  useEffect(() => {
    const initPlayer = () => {
      if (videoRef.current && !player) {
        const newPlayer = new window.YT.Player(videoRef.current, {
          height: "500",
          width: "900",
          videoId: currentVideoId,
          events: {
            /**
             * Plays the video as soon as the player is ready.
             *
             * @param {YT.PlayerEvent} event - The player ready event.
             */
            onReady: (event: YT.PlayerEvent) => event.target.playVideo(),
            /**
             * Monitors the video playback state and pauses the video after 10 seconds,
             * then displays the quiz overlay.
             *
             * @param {YT.OnStateChangeEvent} event - The state change event.
             */
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

    // Assign initPlayer to be called when the YouTube API is ready.
    window.onYouTubeIframeAPIReady = initPlayer;

    // Load the YouTube API script if it isn't already present.
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

  /**
   * Effect to load a new video when the current video ID changes.
   * If the player exists and supports video loading, the new video is loaded and the quiz overlay is hidden.
   */
  useEffect(() => {
    if (player && typeof player.loadVideoById === "function") {
      player.loadVideoById(currentVideoId);
      setShowQuestion(false);
    }
  }, [currentVideoId, player]);

  /**
   * Handles the click event on a video thumbnail.
   * Sets the current video ID to the clicked video's ID and hides the thumbnails grid.
   *
   * @param {string} id - The ID of the video to load.
   */
  const handleThumbnailClick = (id: string) => {
    setCurrentVideoId(id);
    setShowThumbnails(false);
  };

  /**
   * Handles the back button click.
   * Pauses the video (if playing), shows the thumbnails grid, and hides the quiz overlay.
   */
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
  
      {/* Icon for PIN Page */}
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
          <PinLockPage
            /**
             * Callback invoked when the PIN lock modal is closed.
             */
            onClose={() => setShowPinLock(false)}
            /**
             * Callback invoked when the PIN lock is successfully entered.
             */
            onSuccess={() => setShowPinLock(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
