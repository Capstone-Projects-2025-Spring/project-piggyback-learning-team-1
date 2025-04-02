"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImProfile } from "react-icons/im";
import { motion } from "framer-motion";
import { useState } from "react";
import PinLockPage from "../../components/PinLockPage"; 
import { FaPlay } from "react-icons/fa";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { RetroGrid } from "@/components/magicui/retro-grid";

// Using s3Key as titles
const videos = [ 
  { youtubeId: "dqT-UlYlg1s", s3Key: "giant_pandas", title: "Giant Pandas"}, 
  { youtubeId: "9ZyGSgeMnm4", s3Key: "australia", title: "Australia" },
  { youtubeId: "sePqPIXMsAc", s3Key: "our_sun", title: "Our Sun" },
  { youtubeId: "msAnR82kydo", s3Key: "husky", title: "Husky" },
  { youtubeId: "dOMAT8fOr0Q", s3Key: "tigers", title: "Tigers" }
];

export default function HomePage() {
  const router = useRouter();
  const [showPinLock, setShowPinLock] = useState(false); // State to control the PIN lock

  // Function to navigate to the video page
  const handleThumbnailClick = async (s3Key: string) => {
    try {
      const res = await fetch(`/api/presigned-url?id=${encodeURIComponent(s3Key)}`);
      const data = await res.json();
      if (data.url) {
        router.push(`/video/${encodeURIComponent(s3Key)}?url=${encodeURIComponent(data.url)}`);
      } else {
        console.error("Error fetching presigned URL:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-beige relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero section - Featured video taking up the full top portion */}
      <motion.div 
        className="relative w-full h-[500px] bg-black"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="absolute inset-0">
          <div className="w-full h-full relative overflow-hidden">
            <Image 
              src={`https://img.youtube.com/vi/${videos[0].youtubeId}/maxresdefault.jpg`}
              alt="Featured Vid"
              layout="fill"
              objectFit="contain"
              priority
              className="opacity-80" // only for this video for better visibility
            />
            
            <div className="absolute bottom-10 left-10 text-white">
              
              {/* Title of the biggg thumbnail */}
              <motion.h1 
                className="text-4xl font-bold mb-2"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {videos[0].title} 
              </motion.h1>

              {/* Play button */}
              <ShimmerButton 
                  className="shadow-2xl hover:bg-gray-400 transition mt-4 gap-1 drop-shadow-lg mix-blend-difference bg-black/40" // swith color to match background
                  onClick={() => handleThumbnailClick(videos[0].s3Key)}
                  >
                  <FaPlay className="text-black" size={27} />
                  <span className="ml-2 text-black font-bold text-lg">Play</span>
              </ShimmerButton>


            </div>
          </div>
        </div>
      </motion.div>


      {/* Row of videos - horizontal scrolling */}
      <motion.div 
        className="relative w-full ml-10" 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-bold mt-10 pb-4">Popular Videos</h2>
        <div className="flex pb-4 gap-5">
          {videos.map((video) => (
            <motion.div
              key={video.youtubeId}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleThumbnailClick(video.s3Key)}
              className="cursor-pointer"
            >
                <Image
                  src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                  alt={video.title}
                  width={250}
                  height={250}
                  className="object-cover rounded-lg shadow-2xl drop-shadow-md border-4"
                />

                {/* Comments belows are extra, can be add later on*/}
                {/* {video.s3Key === "giant_pandas" && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-md px-2 py-0.5 text-xs">
                    FULL EPISODE
                  </div>
                )} */}
                {/* {video.s3Key === "our_sun" && (
                  <div className="absolute top-2 right-2 bg-white text-black rounded-full px-2 py-0.5 text-xs font-bold">
                    #1
                  </div>
                )}
                {video.s3Key === "our_sun" && (
                  <div className="absolute bottom-2 right-2 bg-white text-black rounded-full px-2 py-0.5 text-xs font-bold">
                    #10
                  </div>
                )} */}

              {/* Title of the videos*/}
              {/* <p className="mt-1 text-sm font-semibold">{video.title}</p>  */}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Profile Icon to Open PIN Lock */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        className="fixed top-4 right-4 text-4xl cursor-pointer text-white drop-shadow-lg mix-blend-difference bg-black/40 rounded-full z-50"
        onClick={() => setShowPinLock(true)}
      >
        <ImProfile/>
      </motion.button>

      {/* PIN Lock Modal */}
      {showPinLock && (
        <PinLockPage
          onClose={() => setShowPinLock(false)}
          onSuccess={() => setShowPinLock(false)}
        />
      )}

      <div className="relative mt-60 flex h-[100px] w-full flex-col items-center justify-center overflow-hidden bg-beige"> 
        <RetroGrid />
      </div>

      {/* Footer */}
      <footer className="w-full p-4 bg-gray-800 text-white flex justify-center items-center z-50">
        <p>&copy; Piglet Prep 2025. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}