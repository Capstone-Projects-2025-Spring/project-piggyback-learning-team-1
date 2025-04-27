"use client"
import React, { useEffect, useState } from 'react';
// import { motion, useMotionValue, useTransform, useSpring, animate } from 'framer-motion';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { IoHome } from "react-icons/io5";
import ExportButton from '@/components/ExportButton';
import { Chart as ChartJS, CategoryScale, 
  LinearScale, BarElement, Title, Tooltip, Legend, 
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
 } from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { NumberTicker } from '@/components/magicui/number-ticker';
import axios from 'axios';

// interface AnimatedScoreProps {
//   value: number;
//   label: string;
//   color?: "green" | "blue" | "purple" | "orange";
//   delay?: number;
//   initialValue?: number;
// }

// const AnimatedScore: React.FC<AnimatedScoreProps> = ({ value, label, color = "green", delay = 0, initialValue = 0 }) => {
//   const x = useMotionValue(initialValue); // Use initialValue prop
//   React.useEffect(() => {
//     animate(x, value, { duration: 2, delay: 1.5 });
//   }, [value, delay, x]);
  
//   const number = useTransform(x, (v) => Number(v.toFixed(0)));
//   const springX = useSpring(x, { damping: 20 });
//   const dx = useTransform(springX, (v) => `${v / 100}px 1px`);

//   const shadowColor = {
//     green: '#22c55e',
//     darkgreen: '#006400',
//     blue: '#3b82f6',
//     purple: '#8b5cf6',
//     orange: '#f97316'
//   }[color];

//   const bgColor = {
//     green: 'bg-green-800 hover:bg-green-900',
//     blue: 'bg-blue-500 hover:bg-blue-600',
//     purple: 'bg-purple-500 hover:bg-purple-600',
//     orange: 'bg-orange-500 hover:bg-orange-600'
//   }[color];

//   const boxShadow = color === 'green' 
//     ? `0 1px 1px -0.5px ${shadowColor}24,` +
//       `0 2px 2px -1px ${shadowColor}23,` +
//       `0 3px 3px -1.5px ${shadowColor}23,` +
//       `0 4px 4px -2px ${shadowColor}22,` +
//       `0 5px 5px -2.5px ${shadowColor}22,` +
//       `0 6px 6px -3px ${shadowColor}21,` +
//       `0 7px 7px -3.5px ${shadowColor}20,` +
//       `0 8px 8px -4px ${shadowColor}1d`
//     : `0 2.015px 1.612px -.34375px ${shadowColor}24,` +
//       `0 4.777px 3.821px -.6875px ${shadowColor}23,` +
//       `0 8.714px 6.971px -1.03125px ${shadowColor}23,` +
//       `0 14.487px 11.589px -1.375px ${shadowColor}22,` +
//       `0 23.395px 18.716px -1.71875px ${shadowColor}22,` +
//       `0 38.295px 30.636px -2.0625px ${shadowColor}21,` +
//       `0 65.942px 52.754px -2.40625px ${shadowColor}20,` +
//       `0 120px 96px -2.75px ${shadowColor}1d`;

//   return (
//     <div className="flex flex-col items-center mb-8 last:mb-0">
//       <motion.div
//         whileInView="visible"
//         viewport={{ once: true }}
//         initial={{ boxShadow: 'none' }}
//         animate={{ boxShadow }}
//         transition={{ delay: 1, duration: 1 }}
//         className={`w-[120px] h-[120px] rounded-full p-2 ${bgColor} relative flex items-center justify-center transition-colors`}
//       >
//         <svg viewBox="0 0 150 150" className="-rotate-90 w-full h-full" fill="none">
//           <motion.circle
//             cx="75"
//             cy="75"
//             r="70"
//             strokeWidth={'0.7rem'}
//             pathLength="0.99"
//             strokeDashoffset={'0px'}
//             className="stroke-lightpink"
//             strokeDasharray={dx}
//           />
//         </svg>
//         <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-white">
//           {number}
//         </motion.div>
//       </motion.div>
//       <h3 className="text-base font-medium mt-2 text-black">{label}</h3>
//     </div>
//   );
// };

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const MetricsDashboard = () => {
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

  interface RadarDataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }
  
  interface RadarData {
    labels: string[];
    datasets: RadarDataset[];
  }
  
  interface VideoStats {
    videoTitle:          string
    totalAttempts:       number
    correctCount:        number
    incorrectCount:      number
    hintsUsed:           number
    averageTimePerAttempt: number
  }
  interface ApiResponse {
    success: boolean
    data:    VideoStats[]
  }

  const [chartData, setChartData] = useState<ChartData | null>(null); // State for chart data
  const [chartOptions, setChartOptions] = useState({}); // State for chart options
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [radarData, setRadarData] = useState<RadarData | null>(null);
  const [TotalSessions, setTotalSession] = useState<number>(0);
  const router = useRouter();
  const [stats, setStats] = useState<VideoStats[]>([])
  const [loading, setLoading] = useState(true)


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

  {/* Fetch data for the radar chart, separate useEffect */}
  useEffect(() => {
    if (!selectedDate) return
  
    const fetchRadarData = async (date: Date) => {
      const formattedDate = date.toISOString().split('T')[0]
      try {
        const res = await fetch(`/api/metrics2/by-date?date=${formattedDate}`)
        if (!res.ok) {
          console.error(`API error: ${res.status} ${res.statusText}`)
          return
        }
        const json = await res.json()
        if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
          console.log('No data for selected date')
          return
        }
  
        // json.data is now an array of:
        // { videoTitle, totalAttempts, correctCount, incorrectCount, hintsUsed, averageTimePerAttempt }
        const stats: {
          videoTitle: string
          totalAttempts: number
          incorrectCount: number
          averageTimePerAttempt: number
          correctCount: number
        }[] = json.data
  
        // Format labels
        const labels = stats.map(s =>
          s.videoTitle
            .replace(/_/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())
        )
  
        // Pull out the three series
        const avgTime   = stats.map(s => s.averageTimePerAttempt)
        const attempts  = stats.map(s => s.totalAttempts)
        const incorrect = stats.map(s => s.incorrectCount)
        const correct   = stats.map(s => s.correctCount)
  
        setRadarData({
          labels,
          datasets: [
            {
              label: 'Avg Time to Answer (s)',
              data: avgTime,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
            {
              label: 'Total Attempts',
              data: attempts,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
            {
              label: 'Incorrect Answers',
              data: incorrect,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Correct Answers',
              data: correct,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        })
      } catch (error) {
        console.error('Error fetching radar data:', error)
      }
    }
  
    fetchRadarData(selectedDate)
  }, [selectedDate])
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
  }
  
  
  // function to fetch total sessions
  // this is the number of times a person runs a video, that's consider a session
  const fetchTotalSessions = async () => {
    try {
      console.log('Fetching total sessions for all time');
  
      const response = await fetch('/api/metrics'); // Replace with your API endpoint for total sessions
  
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        return;
      }
  
      const data = await response.json();
      console.log('API response:', data);
  
      if (data.success) {
        setTotalSession(data.totalUniqueLinks); // Update state with total sessions
      } else {
        console.log('No total sessions found.');
      }
    } catch (error) {
      console.error('Error fetching total sessions:', error);
    }
  };

  useEffect(() => {
    fetchTotalSessions(); // Fetch total sessions on component mount
  }, []);



  useEffect(() => {
    axios
      .get<ApiResponse>('/api/metrics3')
      .then(res => {
        if (res.data.success) setStats(res.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-4">Loading…</p>

  // X-axis labels
  const labels = stats.map(s =>
    s.videoTitle.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  )

  // Three parallel arrays
  const correctData   = stats.map(s => s.correctCount)
  const incorrectData = stats.map(s => s.incorrectCount)
  const hintsData     = stats.map(s => s.hintsUsed)

  const data = {
    labels,
    datasets: [
      { label: 'Correct',    data: correctData,   backgroundColor: 'green'  },
      { label: 'Incorrect',  data: incorrectData, backgroundColor: 'red'    },
      { label: 'Hints Used', data: hintsData,     backgroundColor: 'orange' },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      // title:  { display: true, text: 'Per-Video Quiz Metrics' },
      legend: { position: 'top' as const },
    },
    scales: {
      x: { type: 'category' as const },
      y: { beginAtZero: true },
    },
  }



  return (
    <div className="min-h-screen bg-beige p-8"> 

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

          {/* Export Button, wrapped in motion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <ExportButton />
          </motion.div>
        </div>
        
        {/* <div className="grid grid-cols-1 lg:grid-cols-4 gap-8"> */}
        {/* <div className="flex justify- gap-8"> */}

          {/* Main Content (3/4 width) */}
          <div className="lg:col-span-3 space-y-10">
            {/* Total Users Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-md border p-6"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-semibold text-black">Total Sessions ↗️</span>
                <NumberTicker
                // <span className="bg-black text-white font-semibold text-xl px-5 py-2 rounded-md">{TotalSessions}</span>
                  value={TotalSessions}
                  className="bg-black text-white font-semibold text-2xl px-5 py-2 rounded-md"
                />
              </div>
            </motion.div>

            {/* Total Attempts Bar Chart, more attempts == more popular */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="bg-white rounded-2xl shadow-md border p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-black">All Time Total Attempts Per Video</h3>
              {chartData ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <p>Loading chart...</p>
              )}
            </motion.div>
          {/* </div> */}

          {/* Statistics Card (1/4 width) */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="lg:col-span-1 bg-white rounded-3xl shadow-md border p-6 h-full"
          >
            <h3 className="text-lg font-semibold mb-6 text-black">Statistics</h3>
            <div className="flex flex-col items-center font-extrabold text-black space-y-4">
              <AnimatedScore value={75} label="Engagement" color="green" delay={0.2} initialValue={0} />
              <AnimatedScore value={90} label="Average Quiz Score" color="green" delay={0.4} initialValue={0} />
              <AnimatedScore value={100} label="Completion Rate" color="green" delay={0.6} initialValue={0} />
            </div>
          </motion.div> */}
        </div>


        {/* Per-Video Quiz Metrics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="bg-white rounded-2xl shadow-md border p-6 mt-10 min-h-[400px]"
          >
            <h1 className="text-xl font-bold mb-4">Per-Video Quiz Metrics</h1>
            <Bar data={data} options={options} />
        </motion.div>


        {/* Radar Chart with Date Picker */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="bg-white rounded-2xl shadow-md border p-6 mt-10 min-h-[400px]"
          >
            {/* <h1 className="text-2xl font-bold mb-4 text-black">Metrics Dashboard</h1> */}
            <h2 className="text-xl font-semibold mb-4 text-black">Pick a Date to View Metrics</h2>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="border px-2 py-1 rounded mb-4"
              placeholderText="Select a date"
            />
            {radarData ? <Radar data={radarData} /> : <p className="text-gray-500">No data available for selected date.</p>}
        </motion.div>


      </div>
    </div>
  );
};


export default MetricsDashboard;