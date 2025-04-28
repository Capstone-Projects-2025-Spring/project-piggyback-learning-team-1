"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { BiMath } from "react-icons/bi";
import { PiFlowerTulip } from "react-icons/pi";
import { FaDog, FaCircleXmark } from "react-icons/fa6"; 
import { FaCheck } from "react-icons/fa";
import { IoIosRewind } from "react-icons/io";
import { IoIosFastforward } from "react-icons/io";


interface PreferencesDialogProps {
  onClose: () => void;
  onSubmit: (preferences: {
    enableOD: boolean;
    subjects: string[];
    penaltyOption: string;
  }) => void;
}

export default function PreferencesDialog({ onClose, onSubmit }: PreferencesDialogProps) {
  const [enableOD, setEnableOD] = useState(true);
  const [subjects, setSubjects] = useState<string[]>(["Animals"]);
  const [penaltyOption, setPenaltyOption] = useState<string>("rewind");
  const [error, setError] = useState<string | null>(null);

  const handleSubjectToggle = (subject: string) => {
    if (subjects.includes(subject)) {
      if (subjects.length > 1) {
        setSubjects(subjects.filter(s => s !== subject));
      } else {
        setError("Please select at least one subject focus");
      }
    } else {
      setSubjects([...subjects, subject]);
      setError(null);
    }
  };

  const handleSubmit = () => {
    if (subjects.length === 0) {
      setError("Please select at least one subject focus");
      return;
    }

    onSubmit({
      enableOD,
      subjects,
      penaltyOption
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <motion.div 
        className="bg-[#f5f5dc] rounded-xl p-8 max-w-lg w-full border border-amber-200 shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Customize Your Learning Experience</h2>
        
        {error && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}
        
        {/* Object Detection Section */}
        <div className="mb-8">
          <h4 className="text-lg font-medium mb-4 text-center">Object Detection Questions</h4>
          <div className="flex justify-center gap-6">
            {/* Enable Button */}
            <div
              onClick={() => setEnableOD(true)}
              className={`flex flex-col items-center cursor-pointer transition-all transform ${
                enableOD ? "scale-110" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`p-4 rounded-full mb-2 ${
                enableOD ? "bg-green-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
                <FaCheck size={24} />
              </div>
              <span className={`text-sm font-medium ${
                enableOD ? "text-green-600" : "text-gray-600"
              }`}>
                Enable
              </span>
            </div>
            
            {/* Disable Button */}
            <div
              onClick={() => setEnableOD(false)}
              className={`flex flex-col items-center cursor-pointer transition-all transform ${
                !enableOD ? "scale-110" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`p-4 rounded-full mb-2 ${
                !enableOD ? "bg-red-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
                <FaCircleXmark size={24} />
              </div>
              <span className={`text-sm font-medium ${
                !enableOD ? "text-red-600" : "text-gray-600"
              }`}>
                Disable
              </span>
            </div>
          </div>
        </div>
        
        {/* Subject Focus Section */}
        <div className="mb-8">
          <h4 className="text-lg font-medium mb-4 text-center">Subject Focus (select at least one)</h4>
          <div className="flex flex-wrap gap-6 justify-center">
            {/* Mathematical subject */}
            <div 
              onClick={() => handleSubjectToggle("Mathematical")}
              className={`flex flex-col items-center cursor-pointer transition-all transform ${
                subjects.includes("Mathematical") 
                  ? "scale-110" 
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`p-4 rounded-full mb-2 ${
                subjects.includes("Mathematical")
                  ? "bg-blue-500 text-white shadow-lg" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
                <BiMath size={32} />
              </div>
              <span className={`text-sm font-medium ${
                subjects.includes("Mathematical") ? "text-blue-600" : "text-gray-600"
              }`}>
                Mathematical
              </span>
              <input 
                type="checkbox"
                checked={subjects.includes("Mathematical")}
                onChange={() => handleSubjectToggle("Mathematical")}
                className="sr-only"
              />
            </div>
            
            {/* Nature subject */}
            <div 
              onClick={() => handleSubjectToggle("Nature")}
              className={`flex flex-col items-center cursor-pointer transition-all transform ${
                subjects.includes("Nature") 
                  ? "scale-110" 
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`p-4 rounded-full mb-2 ${
                subjects.includes("Nature")
                  ? "bg-green-500 text-white shadow-lg" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
                <PiFlowerTulip size={32} />
              </div>
              <span className={`text-sm font-medium ${
                subjects.includes("Nature") ? "text-green-600" : "text-gray-600"
              }`}>
                Nature
              </span>
              <input 
                type="checkbox"
                checked={subjects.includes("Nature")}
                onChange={() => handleSubjectToggle("Nature")}
                className="sr-only"
              />
            </div>
            
            {/* Animals subject */}
            <div 
              onClick={() => handleSubjectToggle("Animals")}
              className={`flex flex-col items-center cursor-pointer transition-all transform ${
                subjects.includes("Animals") 
                  ? "scale-110" 
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`p-4 rounded-full mb-2 ${
                subjects.includes("Animals")
                  ? "bg-amber-500 text-white shadow-lg" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
                <FaDog size={32} />
              </div>
              <span className={`text-sm font-medium ${
                subjects.includes("Animals") ? "text-amber-600" : "text-gray-600"
              }`}>
                Animals
              </span>
              <input 
                type="checkbox"
                checked={subjects.includes("Animals")}
                onChange={() => handleSubjectToggle("Animals")}
                className="sr-only"
              />
            </div>
          </div>
        </div>
        
        {/* Penalty Option Section */}
        <div className="mb-8">
          <h4 className="text-lg font-medium mb-4 text-center">Penalty Option</h4>
          <div className="flex justify-center gap-6">
            {/* Rewind Option */}
            <div
              onClick={() => setPenaltyOption("rewind")}
              className={`flex flex-col items-center cursor-pointer transition-all transform ${
                penaltyOption === "rewind" ? "scale-110" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`p-4 rounded-full mb-2 ${
                penaltyOption === "rewind" ? "bg-purple-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
                <IoIosRewind size={28} />
              </div>
              <span className={`text-sm font-medium ${
                penaltyOption === "rewind" ? "text-purple-600" : "text-gray-600"
              }`}>
                Rewind Video
              </span>
            </div>
            
            {/* Skip Option */}
            <div
              onClick={() => setPenaltyOption("skip")}
              className={`flex flex-col items-center cursor-pointer transition-all transform ${
                penaltyOption === "skip" ? "scale-110" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`p-4 rounded-full mb-2 ${
                penaltyOption === "skip" ? "bg-amber-500 text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}>
                <IoIosFastforward size={28} />
              </div>
              <span className={`text-sm font-medium ${
                penaltyOption === "skip" ? "text-amber-600" : "text-gray-600"
              }`}>
                Auto Skip
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700 shadow-md"
          >
            Start Learning
          </button>
        </div>
      </motion.div>
    </div>
  );
}