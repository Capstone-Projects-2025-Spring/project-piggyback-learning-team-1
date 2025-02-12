"use client";
import { motion } from "framer-motion";

export default function HomePage() {
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
      {[
          "https://www.youtube.com/embed/vCkhJeom7zU?si=zHHcUYtO4fzvxj3_",
          "https://www.youtube.com/embed/4Unv7rw5HNk?si=0Pjz-6zyVU_1WDjE",
          "https://www.youtube.com/embed/7MazdjHtbw0?si=SzoKIdKIQTuzAbfx",
          "https://www.youtube.com/embed/IIXxhSIlU4M?si=621KmyHFVDJOQoLL",
          "https://www.youtube.com/embed/QM2-MX1Lz-A?si=SlQcu6qqP95hWqey",
        ].map((src, index) => (
          <motion.div
            key={index}
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeInOut" }}
          >
            <iframe
              className="rounded-3xl border-10 hover:shadow-2xl transition-all duration-700 ease-out"
              width="900"
              height="500"
              src={src}
              title={`YouTube video player ${index + 1}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </motion.div>
        ))}
      </div>
      <footer className="w-full p-4 bg-darkgreen text-white flex justify-center items-center mt-20">
        <p>&copy; Piglet Prep 2025. All rights reserved.</p>
      </footer>
    </motion.div>
  );
}