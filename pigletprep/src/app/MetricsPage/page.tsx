"use client"
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { IoHome } from "react-icons/io5";
import ExportButton from '@/components/ExportButton';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

interface AnimatedScoreProps {
  value: number;
  label: string;
  color?: "green" | "blue" | "purple" | "orange";
  delay?: number;
  initialValue?: number;
}

const AnimatedScore: React.FC<AnimatedScoreProps> = ({ value, label, color = "green", delay = 0, initialValue = 0 }) => {
  const x = useMotionValue(initialValue); // Use initialValue prop
  React.useEffect(() => {
    animate(x, value, { duration: 2, delay: 1.5 });
  }, [value, delay, x]);
  
  const number = useTransform(x, (v) => Number(v.toFixed(0)));
  const springX = useSpring(x, { damping: 20 });
  const dx = useTransform(springX, (v) => `${v / 100}px 1px`);

  const shadowColor = {
    green: '#22c55e',
    darkgreen: '#006400',
    blue: '#3b82f6',
    purple: '#8b5cf6',
    orange: '#f97316'
  }[color];

  const bgColor = {
    green: 'bg-green-800 hover:bg-green-900',
    blue: 'bg-blue-500 hover:bg-blue-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    orange: 'bg-orange-500 hover:bg-orange-600'
  }[color];

  const boxShadow = color === 'green' 
    ? `0 1px 1px -0.5px ${shadowColor}24,` +
      `0 2px 2px -1px ${shadowColor}23,` +
      `0 3px 3px -1.5px ${shadowColor}23,` +
      `0 4px 4px -2px ${shadowColor}22,` +
      `0 5px 5px -2.5px ${shadowColor}22,` +
      `0 6px 6px -3px ${shadowColor}21,` +
      `0 7px 7px -3.5px ${shadowColor}20,` +
      `0 8px 8px -4px ${shadowColor}1d`
    : `0 2.015px 1.612px -.34375px ${shadowColor}24,` +
      `0 4.777px 3.821px -.6875px ${shadowColor}23,` +
      `0 8.714px 6.971px -1.03125px ${shadowColor}23,` +
      `0 14.487px 11.589px -1.375px ${shadowColor}22,` +
      `0 23.395px 18.716px -1.71875px ${shadowColor}22,` +
      `0 38.295px 30.636px -2.0625px ${shadowColor}21,` +
      `0 65.942px 52.754px -2.40625px ${shadowColor}20,` +
      `0 120px 96px -2.75px ${shadowColor}1d`;

  return (
    <div className="flex flex-col items-center mb-8 last:mb-0">
      <motion.div
        whileInView="visible"
        viewport={{ once: true }}
        initial={{ boxShadow: 'none' }}
        animate={{ boxShadow }}
        transition={{ delay: 1, duration: 1 }}
        className={`w-[120px] h-[120px] rounded-full p-2 ${bgColor} relative flex items-center justify-center transition-colors`}
      >
        <svg viewBox="0 0 150 150" className="-rotate-90 w-full h-full" fill="none">
          <motion.circle
            cx="75"
            cy="75"
            r="70"
            strokeWidth={'0.7rem'}
            pathLength="0.99"
            strokeDashoffset={'0px'}
            className="stroke-lightpink"
            strokeDasharray={dx}
          />
        </svg>
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">
          {number}
        </motion.div>
      </motion.div>
      <h3 className="text-base font-medium mt-2 text-black">{label}</h3>
    </div>
  );
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MetricsDashboard = () => {
  // const popularVideos = [ // static data for popular videos for now
  //   { title: 'Dog Videos', date: 'May 3rd' },
  //   { title: 'Spider-Man', date: 'May 3rd' },
  //   { title: 'Who is Darth Vader?', date: 'May 3rd' },
  // ];
  
  interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  }
  
  const [chartData, setChartData] = useState<ChartData | null>(null); // State for chart data
  const [chartOptions, setChartOptions] = useState({}); // State for chart options
  const router = useRouter();


  // Fetch data for the chart
  useEffect(() => {
    const fetchVideoAttempts = async () => {
      try {
        const response = await fetch('/api/metrics'); // Call the API endpoint
        const data = await response.json();
  
        if (data.success) {
          setChartData({
            // labels: data.data.map((video: { videoId: string }) => {
            //   const url = video.videoId;
            //   const parts = url.split('/');
            //   const filenameWithParams = parts[parts.length - 1]; // "giant_pandas?AWSAccessKeyId=..."
            //   const title = filenameWithParams.split('?')[0];     // "giant_pandas"
            //   return title;
            // }),
            
            // this removes the underscore
            labels: data.data.map((video: { videoId: string }) =>
              video.videoId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            ),
            datasets: [
              {
                label: 'Total Attempts',
                data: data.data.map((video: { totalAttempts: number }) => video.totalAttempts),
                backgroundColor: 'darkgreen',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
              },
            ],
          });
  
          setChartOptions({
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: {
                display: true,
                // text: 'Most Watched Videos',
              },
              tooltip: {
                callbacks: {
                  label: function(context: import('chart.js').TooltipItem<'bar'>) {
                    return `${context.dataset.label}: ${context.formattedValue} attempts`;
                  }
                }
              }
            },
          });
        }
      } catch (error) {
        console.error('Error fetching video attempts:', error);
      }
    };
  
    fetchVideoAttempts();
  }, []);
  


  return (
    <div className="min-h-screen bg-[#f5f5dc] p-8"> 

      {/* Back Button, back to home page */}
      <motion.button
        whileHover={{ scale: 1.2 }}
        onClick={() => router.back()}
        className="absolute top-4 left-4 text-4xl cursor-pointer"
      >
        <IoHome/>
      </motion.button>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="text-4xl font-semibold mt-5 text-black">Hello There! 👋</h1>
          </motion.div>
          <ExportButton />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content (3/4 width) */}
          <div className="lg:col-span-3 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1}}
              className="bg-white rounded-2xl shadow-md border p-6"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-semibold text-black">Total Users ↗️</span>
                <span className="bg-black text-white font-semibold text-xl px-5 py-2 rounded-md">3</span>
              </div>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="bg-white rounded-2xl shadow-md border p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-black">Popular Videos</h3>
              <div className="space-y-4">
                {popularVideos.map((video, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Clock className="w-5 h-5 text-green-800" />
                    <div>
                      <p className="font-medium text-black">{video.title}</p>
                      <p className="text-sm text-gray-500">{video.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div> */}


            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.7 }}
              className="bg-white rounded-2xl shadow-md border p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-black">Total Attempts Per Video</h3>
              {chartData ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <p>Loading chart...</p>
              )}
            </motion.div>

          </div>



          {/* Statistics Card (1/4 width) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="lg:col-span-1 bg-white rounded-3xl shadow-md border p-6"
          >
            <h3 className="text-lg font-semibold mb-6 text-black">Statistics</h3>
            <div className="flex flex-col items-center font-extrabold text-black">
                {/* AnimatedScore component, all static for now */}
              <AnimatedScore value={75} label="Engagement" color="green" delay={0.2} initialValue={0} />
              <AnimatedScore value={90} label="Average Quiz Score" color="green" delay={0.4} initialValue={0} />
              <AnimatedScore value={100} label="Completion Rate" color="green" delay={0.6} initialValue={0} />
            </div>
          </motion.div>

              
         
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;