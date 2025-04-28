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
import PreferencesDialog from "../../components/PreferencesDialog";

const videos = [ 
  { 
    youtubeId: "dqT-UlYlg1s", 
    s3Key: "giant_pandas", 
    title: "Giant Pandas",
    description: "Learn about the fascinating life of giant pandas in their natural habitat"
  }, 
  { 
    youtubeId: "9ZyGSgeMnm4", 
    s3Key: "australia", 
    title: "Australia",
    description: "Explore the unique wildlife and landscapes of the Australian continent"
  },
  { 
    youtubeId: "sePqPIXMsAc", 
    s3Key: "our_sun", 
    title: "Our Sun",
    description: "Discover fascinating facts about our solar system's central star"
  },
  { 
    youtubeId: "msAnR82kydo", 
    s3Key: "husky", 
    title: "Husky",
    description: "Meet the friendly and energetic Siberian Husky breed"
  },
  { 
    youtubeId: "dOMAT8fOr0Q", 
    s3Key: "tigers", 
    title: "Tigers",
    description: "Journey into the world of these magnificent big cats"
  }
];

export default function HomePage() {
  const router = useRouter();
  const [showPinLock, setShowPinLock] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{s3Key: string, title: string} | null>(null);

  const handleThumbnailClick = (s3Key: string, title: string) => {
    setSelectedVideo({s3Key, title});
  };

  
  const handlePreferenceSubmit = async (preferences: {
    enableOD: boolean;
    subjects: string[];
    penaltyOption: string;
  }) => {
    if (!selectedVideo) return;

    try {
      const res = await fetch(`/api/presigned-url?id=${encodeURIComponent(selectedVideo.s3Key)}`);
      const data = await res.json();
      if (data.url) {
        // Encode preferences as URL parameters
        const preferencesParam = encodeURIComponent(JSON.stringify(preferences));
        
        // Store the values before resetting
        const videoKey = selectedVideo.s3Key;
        
        // Reset selectedVideo before navigation
        setSelectedVideo(null);
        
        router.push(`/video/${encodeURIComponent(videoKey)}?url=${encodeURIComponent(data.url)}&preferences=${preferencesParam}`);
      } else {
        console.error("Error fetching presigned URL:", data.error);
        // Reset on error
        setSelectedVideo(null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Reset on error
      setSelectedVideo(null);
    }
  };

  return (
    <motion.div
      className="flex flex-col min-h-screen bg-beige relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="relative w-full h-[500px] bg-black"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="absolute inset-0">
          <div className="w-full h-full relative overflow-hidden group">
            <Image 
              src={`https://img.youtube.com/vi/${videos[0].youtubeId}/maxresdefault.jpg`}
              alt="Featured Video"
              layout="fill"
              objectFit="contain"
              priority
              className="opacity-80 transition-opacity duration-300 group-hover:opacity-60"
            />
            
            <div className="absolute bottom-10 left-10 text-white">
              <motion.h1 
                className="text-4xl font-bold mb-2"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {videos[0].title}
              </motion.h1>

              <motion.p
                className="text-lg mb-4 max-w-xl"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {videos[0].description}
              </motion.p>

              <ShimmerButton 
                className="shadow-2xl hover:bg-gray-400 transition mt-4 gap-1 drop-shadow-lg mix-blend-difference bg-black/40"
                onClick={() => handleThumbnailClick(videos[0].s3Key, videos[0].title)}
              >
                <FaPlay className="text-black" size={27} />
                <span className="ml-2 text-black font-bold text-lg">Play</span>
              </ShimmerButton>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Video grid */}
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
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleThumbnailClick(video.s3Key, video.title)}
              className="relative cursor-pointer group"
            >
              <Image
                src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title}
                width={250}
                height={250}
                className="object-cover rounded-lg shadow-2xl drop-shadow-md border-4 transition-opacity duration-300"
              />
              
              {/* Hover overlay with description */}
              <motion.div 
                className="absolute inset-0 bg-black/75 rounded-lg opacity-0 group-hover:opacity-100 
                         transition-opacity duration-200 flex flex-col justify-center items-center p-4"
              >
                <h3 className="text-white font-bold text-lg mb-2">{video.title}</h3>
                <p className="text-white text-sm text-center">{video.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Profile Icon */}
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

      {/* Preferences Dialog */}
      {selectedVideo && (
        <PreferencesDialog
          onClose={() => setSelectedVideo(null)}
          onSubmit={handlePreferenceSubmit}
        />
      )}
    </motion.div>
  );
}