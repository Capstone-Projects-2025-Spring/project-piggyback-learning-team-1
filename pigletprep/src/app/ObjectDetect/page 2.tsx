// "use client";
// import { useEffect, useState } from "react";

// interface BoundingBox {
//   Top: number;
//   Left: number;
//   Width: number;
//   Height: number;
// }

// interface DetectedObject {
//   Name: string;
//   Instances?: { BoundingBox?: BoundingBox }[];
// }

// interface ImageDisplayProps {
//   imageData: string | null;
//   onLabelClick?: () => void;
// }

// export default function ImageDisplay({ imageData, onLabelClick }: ImageDisplayProps) {
//   const [objects, setObjects] = useState<DetectedObject[]>([]);

//   useEffect(() => {
//     if (!imageData) return;

//     const fetchObjects = async () => {
//       const base64 = imageData.split(",")[1];
//       const response = await fetch("/api/rekognition", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ imageBase64: base64 }),
//       });

//       const data = await response.json();
//       if (!Array.isArray(data)) {
//         console.error("Unexpected API response:", data);
//         return;
//       }

//       setObjects(data);
//     };

//     fetchObjects();
//   }, [imageData]);

//   return (
//     <div
//       className="relative"
//       style={{
//         width: "640px",
//         height: "360px",
//       }}
//     >
//       {imageData && (
//         <div className="relative w-full h-full">
//           <img
//             src={imageData}
//             alt="Detected"
//             className="absolute top-0 left-0 w-full h-full object-cover"
//           />
//           {objects.map((obj, index) => {
//             const instance = obj.Instances?.[0];
//             if (!instance?.BoundingBox) return null;
//             return (
//               <div
//                 key={index}
//                 className="absolute border-2 border-red-500"
//                 style={{
//                   top: `${instance.BoundingBox.Top * 100}%`,
//                   left: `${instance.BoundingBox.Left * 100}%`,
//                   width: `${instance.BoundingBox.Width * 100}%`,
//                   height: `${instance.BoundingBox.Height * 100}%`,
//                 }}
//               >
//                 <button
//                   className="bg-red-500 text-white text-sm px-2 py-1"
//                   onClick={onLabelClick}
//                 >
//                   {obj.Name}
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import ImageDisplay from "@/components/ImageDisplay";

export default function ObjectDetectPage() {
  const [imageData, setImageData] = useState<string | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImageData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLabelClick = () => {
    console.log("Label clicked!");
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {imageData && (
        <ImageDisplay imageData={imageData} onLabelClick={handleLabelClick} />
      )}
    </div>
  );
}
