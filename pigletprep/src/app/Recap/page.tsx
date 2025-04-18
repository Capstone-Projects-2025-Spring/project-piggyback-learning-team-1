"use client";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, SkipForward } from "lucide-react";
import { IoHome } from "react-icons/io5";
import { RiLoopLeftLine } from "react-icons/ri";
import {  useRouter, useSearchParams  } from "next/navigation";
import { useRef, useState, useEffect } from "react"
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti"

import { Suspense } from 'react'

function QuizResults() {

  const searchParams = useSearchParams();
  const router = useRouter();
  const confettiRef = useRef<ConfettiRef>(null) // for confetti animation

  const [stats, setStats] = useState({
    attemptsBeforeSuccess: 0,
    averageTimePerAttempt: 0,
    hintsUsed: 0,
    correctCount: 0,
    totalAttempts: 0,
  });
  const [showStats, setShowStats] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");

  
  // Select a random .mp4 video to play
  useEffect(() => {
    const videos = ['/pig-cuteness.mp4', '/dacingPiggy.mp4'];
    const randomIndex = Math.floor(Math.random() * videos.length);
    setVideoSrc(videos[randomIndex]);
  }, []);

  // useeffect to trigger the confetti animation
  useEffect(() => {
    const timer = setTimeout(() => {
      confettiRef.current?.fire({
        particleCount: 500, 
        spread: 200,
        origin: { y: 0.4 }
      });
    }, 500); // delay to make sure is mounted and intialized
    
    return () => clearTimeout(timer); // cleanup: if somethings happens with the confetti, stop the timer so it does not show up at all. Else it will show up after 500ms
  }, []); // run only once after the initial render



  // attempt to get the quiz attempt data from the DB using the videoId
  useEffect(() => {
    const rawVideoId = searchParams.get("videoId");
    console.log("Raw videoId from URL:", rawVideoId);
  
    if (rawVideoId) {
      // Strip it down to just the video name
      const url = new URL(rawVideoId);
      const pathname = url.pathname;
      const cleanVideoId = pathname.slice(1);
  
      console.log("Cleaned videoId for API:", cleanVideoId);
  
      fetch(`/api/database?videoId=${cleanVideoId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("DB data returned:", data);
          if (data.success) {
            setStats(data.data);
            setShowStats(true);
          } else {
            console.error("Failed to load stats:", data.message);
          }
        })
        .catch((err) => {
          console.error("Error fetching stats:", err);
        });
    }
  }, [searchParams]);
  

  // // error handling, can be add later on, don't see any issues for now
  // if (!showStats) {
  //   return (
  //     <div className="text-center p-8">
  //       <h1>Complete the video to see your stats!</h1>
  //       <button
  //         onClick={() => router.push("/")}
  //         className="px-4 py-2 bg-blue-500 text-white rounded-lg"
  //       >
  //         Go Home
  //       </button>
  //     </div>
  //   );
  // }


  return (
    <div className="flex justify-center items-center min-h-screen bg-[beige] px-4">
      <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-0 size-full pointer-events-none"
          manualstart={true} 
      />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-[700px] bg-white rounded-3xl shadow-2xl p-4 text-center"
      >
        {/* Pink dev header*/}
        <div className="bg-pink-100 rounded-2xl p-6">
          <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden">
              {videoSrc && (
                <video 
                  src={videoSrc}
                  className="w-full h-full object-cover" 
                  autoPlay 
                  loop 
                  muted
                />
              )}
            </div>
          <h2 className="text-3xl font-extrabold text-green-800 mt-4">🎉 Congratulations! 🎉</h2>
          <p className="text-lg text-gray-700 mt-3">
            You completed the &quot;Piggie Prep&quot; Quiz
          </p>
          
        </div>

        {/* Progress Bar - reflects the percentage of correct answers out of all attempts made */}
        {showStats && stats && ( // do this to avoid errors
          <div className="relative w-full h-4 mt-5 bg-gray-300 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{
                width: `${
                  stats.totalAttempts > 0
                    ? (stats.correctCount / stats.totalAttempts) * 100
                    : 0
                }%`,
              }}
              transition={{ duration: 1.5 }}
              className="h-full bg-green-500"
            />
          </div>
        )}
        {/* Score Section */}
        <div className="grid grid-cols-2 gap-5 mt-6">
          {/* Correct Answers */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-2 border-4 border-green-500 rounded-xl text-center"
          >
            <CheckCircle className="w-8 h-8 mx-auto text-green-600" />
            <p className="text-4xl m-3 font-extrabold text-green-600">
              {stats.correctCount}
            </p>
            <p className="text-lg text-gray-700">Correct Answers</p>
          </motion.div>

          {/* Wrong Answers - attempts on a question before the user got it correct */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-2 border-4 border-pink-500 rounded-xl text-center"
          >
            <XCircle className="w-8 h-8 mx-auto text-pink-600" />
            <p className="text-4xl m-3 font-extrabold text-pink-600">{stats.attemptsBeforeSuccess}</p>
            <p className="text-lg text-gray-700">Wrong Answers</p>
          </motion.div>

          {/* Average of all attempts for a video */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-2 border-4 border-blue-500 rounded-xl text-center"
          >
            <Clock className="w-8 h-8 mx-auto text-blue-600" />
            <p className="text-4xl m-3 font-extrabold text-blue-600">
            {stats.averageTimePerAttempt != null ? `${stats.averageTimePerAttempt.toFixed(1)}s` : '0.0s'}
            </p>
            <p className="text-lg text-gray-700">Time Spent</p>
          </motion.div>

          {/* Hint Used, after 1 wrong, it will pops up */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-2 border-4 border-gray-500 rounded-xl text-center"
          >
            <SkipForward className="w-8 h-8 mx-auto text-gray-600" />
            <p className="text-4xl m-3 font-extrabold text-gray-600">{stats.hintsUsed}</p>
            <p className="text-lg text-gray-700">Hints Used</p>
          </motion.div>
        </div>

        {/* Buttons Section */}
        <div className="mt-6 flex justify-center gap-6">
          {/* Try again button == go back button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={()=> router.back()}
            className="px-6 py-3 text-3xl bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition"
          >
            <RiLoopLeftLine />
          </motion.button>
          
           {/* Home button - go back to the HomePage */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={()=> router.push("/HomePage")}
            className="px-6 py-3 text-3xl bg-gray-300 text-gray-800 rounded-lg shadow-lg hover:bg-gray-400 transition"
          >
            <IoHome />
          </motion.button>
          
        </div>
      </motion.div>
    </div>
  );
}



export default function RecapPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizResults />
    </Suspense>
  );
}