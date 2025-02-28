"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImProfile } from "react-icons/im";
import { motion } from "framer-motion";
import { useState } from "react";
import PinLockPage from "../components/PinLockPage"; 

// Replaced the old YouTube video IDs with the new ones and their corresponding S3 keys

const videos = [ 
  { youtubeId: "dqT-UlYlg1s", s3Key: "giant_pandas" }, 
  { youtubeId: "9ZyGSgeMnm4", s3Key: "australia" },
  { youtubeId: "sePqPIXMsAc", s3Key: "our_sun" },
  { youtubeId: "msAnR82kydo", s3Key: "husky" },
  { youtubeId: "dOMAT8fOr0Q", s3Key: "tigers" },
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
      className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5dc] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Profile Icon to Open PIN Lock */}
      <ImProfile
        className="absolute top-4 right-4 text-3xl cursor-pointer"
        onClick={() => setShowPinLock(true)}
      />

      {/* Page Title */}
      <motion.h1
        className="text-4xl font-bold border-b-4 border-[#FFC0CB] pb-1 m-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Select a Video
      </motion.h1>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <motion.div
            key={video.youtubeId}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleThumbnailClick(video.s3Key)}
            className="cursor-pointer"
          >
            <Image
              src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
              alt="Video thumbnail"
              width={256}
              height={144}
              className="object-cover rounded-lg shadow-md"
            />
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <footer className="w-full p-4 bg-gray-800 text-white flex justify-center items-center mt-20">
        <p>&copy; Piglet Prep 2025. All rights reserved.</p>
      </footer>

      {/* PIN Lock Modal */}
      {showPinLock && (
        <PinLockPage
          onClose={() => setShowPinLock(false)}
          onSuccess={() => setShowPinLock(false)}
        />
      )}
    </motion.div>
  );
}
