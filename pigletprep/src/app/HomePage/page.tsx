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
        className="text-4xl font-bold border-b-4 border-[#FFC0CB] pb-2 m-16"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Start Watching
      </motion.h1>
      <div className="flex flex-col justify-center p-16 gap-y-14">
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <iframe
            className="rounded-xl border-2 hover:shadow-2xl transition-all duration-500 ease-out"
            width="900"
            height="500"
            src="https://www.youtube.com/embed/1zsKy2vH2Fo?si=fgrZrnc_vWqRpSZi"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <iframe
            className="rounded-xl border-2 hover:shadow-2xl transition-all duration-500 ease-out"
            width="900"
            height="500"
            src="https://www.youtube.com/embed/VQnwnVKrNd8?si=rQRwMPJfMwtFJWzN"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <iframe
            className="rounded-xl border-2 hover:shadow-2xl transition-all duration-500 ease-out"
            width="900"
            height="500"
            src="https://www.youtube.com/embed/hWdLhB2okqA?si=1S9IGZZsPppUPiVF"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <iframe
            className="rounded-xl border-2 hover:shadow-2xl transition-all duration-500 ease-out"
            width="900"
            height="500"
            src="https://www.youtube.com/embed/UJi2CEJqaio?si=Q-wX9hV8p-CdCoE4"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </motion.div>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <iframe
            className="rounded-xl border-2 hover:shadow-2xl transition-all duration-500 ease-out"
            width="900"
            height="500"
            src="https://www.youtube.com/embed/t0Q2otsqC4I?si=MBvNxUvMpV0L-577"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </motion.div>
      </div>
    </motion.div>
  );
}