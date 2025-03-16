// "use client";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { ImProfile } from "react-icons/im";
// import { motion } from "framer-motion";
// import { useState } from "react";
// import PinLockPage from "../components/PinLockPage"; 

// // Replaced the old YouTube video IDs with the new ones and their corresponding S3 keys

// const videos = [ 
//   { youtubeId: "dqT-UlYlg1s", s3Key: "giant_pandas" }, 
//   { youtubeId: "9ZyGSgeMnm4", s3Key: "australia" },
//   { youtubeId: "sePqPIXMsAc", s3Key: "our_sun" },
//   { youtubeId: "msAnR82kydo", s3Key: "husky" },
//   { youtubeId: "dOMAT8fOr0Q", s3Key: "tigers" },
// ];

// export default function HomePage() {
//   const router = useRouter();
//   const [showPinLock, setShowPinLock] = useState(false); // State to control the PIN lock modal

//   // Function to navigate to the video page
//   const handleThumbnailClick = async (s3Key: string) => {
//     try {
//       const res = await fetch(`/api/presigned-url?id=${encodeURIComponent(s3Key)}`);
//       const data = await res.json();
//       if (data.url) {
//         router.push(`/video/${encodeURIComponent(s3Key)}?url=${encodeURIComponent(data.url)}`);
//       } else {
//         console.error("Error fetching presigned URL:", data.error);
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };

//   return (
//     <motion.div
//       className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5dc] relative"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       {/* Profile Icon to Open PIN Lock */}
//       <ImProfile
//         className="absolute top-4 right-4 text-3xl cursor-pointer"
//         onClick={() => setShowPinLock(true)}
//       />

//       {/* Page Title */}
//       <motion.h1
//         className="text-4xl font-bold border-b-4 border-[#FFC0CB] pb-1 m-12"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         Select a Video
//       </motion.h1>

//       {/* Thumbnails Grid */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {videos.map((video) => (
//           <motion.div
//             key={video.youtubeId}
//             whileHover={{ scale: 1.05 }}
//             transition={{ duration: 0.3 }}
//             onClick={() => handleThumbnailClick(video.s3Key)}
//             className="cursor-pointer"
//           >
//             <Image
//               src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
//               alt="Video thumbnail"
//               width={256}
//               height={144}
//               className="object-cover rounded-lg shadow-md"
//             />
//           </motion.div>
//         ))}
//       </div>

//       {/* Footer */}
//       <footer className="w-full p-4 bg-gray-800 text-white flex justify-center items-center mt-20">
//         <p>&copy; Piglet Prep 2025. All rights reserved.</p>
//       </footer>

//       {/* PIN Lock Modal */}
//       {showPinLock && (
//         <PinLockPage
//           onClose={() => setShowPinLock(false)}
//           onSuccess={() => setShowPinLock(false)}
//         />
//       )}
//     </motion.div>
//   );
// }




"use client";

import { useRef, useState } from "react";

interface Label {
  Name: string;
  Confidence: number;
}

interface DetectLabelsProps {
  videoSrc: string; // Pass video source as a prop
}

const DetectLabels: React.FC<DetectLabelsProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [labels, setLabels] = useState<Label[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [mcq, setMcq] = useState<string | null>(null);

  const captureScreenshot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // convert screenshot to a base64 image
    const dataUrl = canvas.toDataURL("image/png");
    setImageData(dataUrl);

    sendImageToGPT(dataUrl);
  };

  const sendImageToGPT = async (base64Image: string) => {
    try {
      const base64String = base64Image.split(",")[1];

      const response = await fetch("/api/analyzeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBuffer: base64String }),
      });

      const data = await response.json();

      if (response.ok) {
        setMcq(data.mcq);
        setLabels(data.labels || []);
      } else {
        setError(data.error || "Error generating MCQ");
      }
    } catch (err) {
      setError((err as Error).message || "Error processing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      {/* Dynamic video source */}
      <video ref={videoRef} width="640" height="360" controls crossOrigin="anonymous">
        <source src={videoSrc} type="video/mp4" />
      </video>

      <button onClick={captureScreenshot} disabled={loading} style={{ display: "block", margin: "10px auto" }}>
        {loading ? "Processing..." : "Get Multiple Choice Question"}
      </button>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      {imageData && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "white",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <img src={imageData} alt="Screenshot" style={{ width: "150px", height: "auto", borderRadius: "5px" }} />
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {labels && (
        <div>
          <h2>Detected Labels:</h2>
          <ul>
            {labels.map((label, index) => (
              <li key={index}>
                {label.Name} - Confidence: {label.Confidence.toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {mcq && (
        <div>
          <h2>Generated Multiple-Choice Question:</h2>
          <p>{mcq}</p>
        </div>
      )}
    </div>
  );
};

export default DetectLabels;
