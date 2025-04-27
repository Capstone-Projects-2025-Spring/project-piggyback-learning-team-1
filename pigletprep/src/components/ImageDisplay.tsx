"use client";
import { useEffect, useState } from "react";

// Match your API response structure
interface Instance {
  BoundingBox?: {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
  };
  Confidence?: number;
}

interface DetectedObject {
  Name?: string;
  Confidence?: number;
  Instances?: Instance[];
}

export interface ImageDisplayProps {
  imageData: string | null;
  onLabelClick?: () => void;
  targetObject?: string; // Optional prop to specify which object to look for
}

export default function ImageDisplay({ 
  imageData, 
  onLabelClick,
  targetObject = "tiger" // Default to tiger if not specified
}: ImageDisplayProps) {
  const [objects, setObjects] = useState<DetectedObject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageData) return;

    const fetchObjects = async () => {
      try {
        setLoading(true);
        const base64 = imageData.split(",")[1];
        
        const response = await fetch("/api/rekognition", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setObjects(data);
          console.log("Detected objects:", data);
        } else {
          console.error("API error:", data);
          setError(data.error || "Error detecting objects");
        }
      } catch (err) {
        console.error("Error in object detection:", err);
        setError("Failed to detect objects in image");
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, [imageData]);

  // Function to handle clicking on an object
  const handleObjectClick = (objectName: string) => {
    console.log(`Clicked on: ${objectName}`);
    
    // Check if the clicked object matches the target
    const isTargetObject = objectName.toLowerCase() === targetObject.toLowerCase();
    
    if (isTargetObject) {
      // If it's the correct object, call the onLabelClick function
      if (onLabelClick) {
        // Add feedback before continuing
        const targetBox = document.querySelector(`.object-box.${targetObject.toLowerCase()}`);
        if (targetBox) {
          targetBox.classList.add('correct-target');
          // Give visual feedback for a moment before continuing
          setTimeout(() => {
            onLabelClick();
          }, 500);
        } else {
          onLabelClick();
        }
      }
    } else {
      // Visual feedback for wrong clicks
      console.log("Not the target object, try again!");
    }
  };

  return (
    <div
      className="relative"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0
      }}
    >
      {imageData && (
        <div className="relative w-full h-full">
          {/* Base image */}
          <img
            src={imageData}
            alt="Detected"
            className="absolute top-0 left-0 w-full h-full object-cover"
            onClick={() => console.log("Background clicked")}
          />

          {/* Loading indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* Bounding boxes for detected objects */}
          {objects.map((obj, index) => {
            if (!obj.Name || !obj.Instances || obj.Instances.length === 0) {
              return null;
            }

            const isTarget = obj.Name.toLowerCase() === targetObject.toLowerCase();
            
            return obj.Instances.map((instance, i) => {
              if (!instance.BoundingBox) return null;
              
              return (
                <div
                key={`${index}-${i}`}
                className={`absolute object-box ${isTarget ? targetObject.toLowerCase() : ''}`}
                style={{
                  top: `${instance.BoundingBox.Top * 100}%`,
                  left: `${instance.BoundingBox.Left * 100}%`,
                  width: `${instance.BoundingBox.Width * 100}%`,
                  height: `${instance.BoundingBox.Height * 100}%`,
                  backgroundColor: "transparent",
                  border: "none",
                  zIndex: 10,
                }}
                onClick={() => handleObjectClick(obj.Name || "")}
                >
                  {/* <div 
                    className={`absolute top-0 left-0 transform -translate-y-full text-xs px-2 py-1 rounded-t ${
                      isTarget ? 'bg-yellow-500 text-black' : 'bg-red-500 text-white'
                    }`}
                  >
                    {obj.Name} {obj.Confidence ? `(${Math.round(obj.Confidence)}%)` : ''}
                  </div> */}
                </div>
              );
            });
          })}

          {/* No objects found message */}
          {!loading && objects.length === 0 && !error && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded">
              No objects detected
            </div>
          )}
        </div>
      )}
    </div>
  );
}
