"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (animationComplete) {
      setTimeout(() => {
        router.push("/HomePage"); // Navigate to the next page
      });
    }
  }, [animationComplete, router]);

  return (
    <motion.div
      className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-darkgreen via-lightpink to-beige text-white"
      initial={{ scale: 1 }}
      animate={{ scale: 3, opacity: 3 }}
      // transition={{ duration: 4}}
      transition={{ duration: 3, delay: 0.4 }}
      onAnimationComplete={() => setAnimationComplete(true)}
    >
      <motion.h1
        className="text-6xl font-extrabold flex items-center justify-center ml-16"
        initial={{ scale: 1.5 }}
        animate={{ scale: 4, opacity: 0 }}
        // transition={{ duration: 5 }}
        transition={{ duration: 3, delay: 0.4 }}
      >
        Welcome t
        <motion.img
          src="/pig.png"
          alt="Piglet"
          className="w-11 h-11 mt-3 filter invert"
          initial={{ scale: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          // transition={{ duration: 5 }}
          transition={{ duration: 3, delay: 0.4 }}
          />  
          <span className="ml-2">Piglet Prep</span>
        </motion.h1>
    </motion.div>
  );
}
