import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons from react-icons

interface PinLockPageProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PinLockPage({ onClose, onSuccess }: PinLockPageProps) {
  const [pin, setPin] = useState('');
  const correctPin = '1234'; // Set your correct pin here
  const router = useRouter();

  const handlePinSubmit = useCallback(() => {
    if (pin === correctPin) {
      onSuccess();
      setTimeout(() => {
        router.push('/MetricsPage'); // Redirect to MetricsPage after animation
      }, 500); // Adjust the timeout to match the exit animation duration
    } else {
      alert('Incorrect PIN. Please try again.');
      setPin('');
    }
  }, [pin, onSuccess, router]);


  useEffect(() => { // This handle the ENTER key press to submit the PIN, another way to submit the PIN
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handlePinSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlePinSubmit]);

  return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex items-center justify-center p-6 bg-beige rounded-xl shadow-lg text-center"
      >
        <div>
          <h1 className="text-2xl font-semibold mb-4 text-black">Enter PIN to access metrics</h1>
          <input 
            type="password" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            className="px-4 py-2 border rounded-2xl text-center text-4xl focus:outline-none focus:ring-5 focus:ring-blue-500 text-black" 
            maxLength={4}
            style={{ fontSize: '1.5rem', padding: '0.25rem' }}
          />
          <div className="mt-4 flex flex-col space-y-2">
            <button 
              onClick={handlePinSubmit} 
              className="px-4 py-2 text-base font-semibold bg-darkgreen text-white rounded-2xl hover:bg-green-700 flex items-center justify-center"
            >
              <FaCheck className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose} // to close the modal, remove it from the DOM
              className="px-4 py-2 text-base font-semibold bg-lightpink text-black rounded-2xl hover:bg-pink-300 flex items-center justify-center"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
  );
}