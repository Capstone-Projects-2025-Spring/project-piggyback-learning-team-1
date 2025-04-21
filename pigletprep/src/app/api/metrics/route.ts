import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';

export async function GET() {
  try {
    await dbConnect();

    // Aggregate data to get the number of attempts for each video
    const videoAttempts = await QuizAttempt.aggregate([
        {
                $addFields: {
                // Extract just the video filename (remove the AWS query string)
                        cleanVideoId: {
                                $arrayElemAt: [
                                        { $split: [{ $arrayElemAt: [{ $split: ["$videoId", "/"] }, -1] }, "?"] },
                                        0
                                        ]
                                }
         }
        },
        {
                $group: {
                        _id: "$cleanVideoId", // Use filename (e.g., "giant_pandas") as group key
                        attempts: { $push: "$$ROOT" }, // Push all related documents
                        totalAttempts: { $sum: "$attempts" }
                }
        },
                {
                        $sort: { totalAttempts: -1 } // Optional: sort by popularity
                },
        {
                $limit: 4 // Optional: limit the number of video groups returned
        }
    ]);

    // Calculate the total attempts across all videos
    const totalAttemptsAcrossAllVideos = await QuizAttempt.aggregate([
      {
        $group: {
          _id: null, // Group everything together
          totalAttempts: { $sum: '$attempts' }, // Sum up all attempts
        },
      },
    ]);

    const totalAttempts = totalAttemptsAcrossAllVideos.length > 0
      ? totalAttemptsAcrossAllVideos[0].totalAttempts
      : 0;

    // Find the video that appears the most times in the database
    const mostFrequentVideo = await QuizAttempt.aggregate([
      {
        $group: {
          _id: '$videoId', // Group by videoId
          count: { $sum: 1 }, // Count the number of occurrences of each videoId
        },
      },
      {
        $sort: { count: -1 }, // Sort by count in descending order
      },
      {
        $limit: 3, // Get the video with the highest count
      },
    ]);

    const mostFrequent = mostFrequentVideo.length > 0
      ? { videoId: mostFrequentVideo[0]._id, count: mostFrequentVideo[0].count }
      : null;

    return NextResponse.json({
      success: true,
      data: videoAttempts.map((video) => ({
        videoId: video._id,
        totalAttempts: video.totalAttempts,
      })),
      totalAttempts, // Include the total attempts across all videos
      mostFrequent, // Include the most frequent video
    });
  } catch (error) {
    console.error('Error fetching video attempts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video attempts' },
      { status: 500 }
    );
  }
}