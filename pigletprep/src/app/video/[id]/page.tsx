"use client";
import { PigLine } from "@/components/PigLine";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DetectLabels from "@/app/videotomcq/DetectLabels";
// import { IoChevronForwardCircle } from "react-icons/io5";
import { IoHome } from "react-icons/io5";



export default function VideoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoUrl = searchParams.get("url");
  const preferencesString = searchParams.get("preferences");
  
  // Parse preferences or use defaults
  const preferences = preferencesString ? JSON.parse(decodeURIComponent(preferencesString)) : {
    enableOD: true,
    subjects: ["Animals"],
    penaltyOption: "rewind"
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

      {/* Recap button - go to recap page, all static. Will use real data later on
      <button
        onClick={() => router.push("/Recap")}
        className="fixed top-4 right-4 text-blue-500 text-4xl z-50 hover:text-blue-700 transition"
      >
        <IoChevronForwardCircle />
      </button> */}



      

      <div className="flex justify-center items-center w-full h-full absolute top-0 left-0">
        {videoUrl && <DetectLabels videoSrc={videoUrl} preferences={preferences}/>}
      </div>

      
      <PigLine />
    </div>
  );
}
