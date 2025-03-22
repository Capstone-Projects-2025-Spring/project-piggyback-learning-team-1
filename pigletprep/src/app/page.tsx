"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { useTheme } from "next-themes";

export default function Home() {
  const router = useRouter();
  const [animationComplete, setAnimationComplete] = useState(false);

  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";

  useEffect(() => {
    if (animationComplete) {
      setTimeout(() => {
        router.push("/HomePage"); // Navigate to the next page
      });
    }
  }, [animationComplete, router]);

  return (
    <motion.div
      className="flex items-center justify-center h-screen w-screen bg-gradient-to-r from-darkgreen via-lightpink to-red-300 text-white"
      initial={{ scale: 1 }}
      animate={{ scale: 3, opacity: 3 }}
      transition={{ duration: 1, delay: 2 }}
      onAnimationComplete={() => setAnimationComplete(true)}
    >
      <motion.div
          className="text-7xl font-black flex flex-col items-center justify-center whitespace-nowrap tracking-wider"
          initial={{ scale: 1.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 1.5, delay: 2 }}
        >
        <span className="mb-4">Welcome</span>
        
        <div className="flex items-center justify-center mb-4">
          <span className="ml-9">t</span>
          <motion.img
            src="/pig.png"
            alt="Piglet"
            className="w-16 h-16 mt-3 mr-16 filter invert"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1, opacity: 2 }}
            transition={{ duration: 1.5, delay: 2 }}
          />
        </div>
        
        <LineShadowText className="italic" shadowColor={shadowColor}>
          Piglet Prep
        </LineShadowText>
      </motion.div>
        
    </motion.div>
  );
}
