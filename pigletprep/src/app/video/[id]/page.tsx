"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DetectLabels from "@/app/videotomcq/DetectLabels";
import { IoChevronForwardCircle } from "react-icons/io5";
import { IoHome } from "react-icons/io5";


export default function VideoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoUrl = searchParams.get("url"); // Get the S3 video URL from the query params
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const quizTriggered = useRef(false);

  useEffect(() => {
    if (!videoUrl) return;
    const video = videoRef.current;
    if (!video) return;

    let mounted = true; // Add mounted flag

    const decodedUrl = decodeURIComponent(videoUrl);
    console.log('Attempting to load video from:', decodedUrl);

    // Add canplay event listener
    const handleCanPlay = async () => {
      if (mounted) {
        try {
          await video.play();
        } catch (error) {
          console.error('Playback failed:', error);
        }
      }
    };

    video.addEventListener('canplay', handleCanPlay);

    // Set source after adding listener
    video.src = decodedUrl;
    video.load();

    const handleTimeUpdate = () => {
      if (!video || !mounted) return;
      if (!quizTriggered.current && video.currentTime >= 10) {
        quizTriggered.current = true;
        video.pause();
        setShowQuiz(true);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    // Cleanup function
    return () => {
      mounted = false;
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.pause();
      video.src = ''; // Clear the source
    };
  }, [videoUrl]);

  const handleContinueWatching = () => {
    setShowQuiz(false);
    videoRef.current?.play();
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5dc] relative">
      
      {/* Back Button, back to home page */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-4xl cursor-pointer z-50"
      >
        <IoHome/>
      </motion.button>

      {/* Recap button - go to recap page, all static. Will use real data later on */}
      <button
        onClick={() => router.push("/Recap")}
        className="fixed top-4 right-4 text-blue-500 text-4xl z-50 hover:text-blue-700 transition"
      >
        <IoChevronForwardCircle />
      </button>



      

      <div className="flex justify-center items-center w-full h-full absolute top-0 left-0">
        {videoUrl && <DetectLabels videoSrc={videoUrl} />}
      </div>

      {/* Quiz Sidebar */}
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

      {/* Pass video URL to DetectLabels */}
    </div>
  );
}
