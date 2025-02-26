"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ImProfile } from "react-icons/im";
import { motion } from "framer-motion";
import { useState } from "react";
import PinLockPage from "../components/PinLockPage"; 

const videoIds = [
  "vCkhJeom7zU",
  "4Unv7rw5HNk",
  "7MazdjHtbw0",
  "IIXxhSIlU4M",
  "QM2-MX1Lz-A",
];

export default function HomePage() {
  const router = useRouter();
  const [showPinLock, setShowPinLock] = useState(false); // State to control the PIN lock modal

  // Function to navigate to the video page
  const handleThumbnailClick = (id: string) => {
    router.push(`/video/${id}`);
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
        {videoIds.map((id) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleThumbnailClick(id)}
            className="cursor-pointer"
          >
            <Image
              src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
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
