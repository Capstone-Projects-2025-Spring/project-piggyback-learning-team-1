import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    
    const quizAttempt = await QuizAttempt.create(data);
    
    return NextResponse.json({ 
      success: true, 
      data: quizAttempt 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save quiz attempt' 
      },
      { status: 500 }
    );
  }
}

// GET: Fetch latest quiz attempt from the DB
// Get metrics from all the latest attempts of the lastest video
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url); // get videoId from the URL
    const videoId = searchParams.get('videoId'); // to filter attempts for a specific video
    
    if (!videoId) { // check if videoId is provided
      return NextResponse.json(
        { success: false, message: 'videoId parameter is required' },
        { status: 400 }
      );
    }

    // Fetch the latest videoId based on the most recent createdAt
    const latestVideo = await QuizAttempt.findOne({
      videoId: { $regex: videoId, $options: 'i' }
    }).sort({ createdAt: -1 }); // sort in decreasing order to get the latest videoId

    if (!latestVideo) { // if no videoId is found, return all 0s
      return NextResponse.json({
        success: true,
        data: {
          attemptsBeforeSuccess: 0,
          averageTimePerAttempt: 0,
          totalAttempts: 0,
          hintsUsed: 0,
          correctCount: 0,
        },
      });
    }

    // Fetch all attempts for the latest videoId
    const allAttemptsForVideo = await QuizAttempt.find({
      videoId: latestVideo.videoId,
    });

    // Count correct answers directly (where isCorrect is true)
    const correctCount = allAttemptsForVideo.filter(attempt => attempt.isCorrect === true).length;

    // Count incorrect answers directly (where isCorrect is false)
    const incorrectCount = allAttemptsForVideo.filter(attempt => attempt.isCorrect === false).length;

    // Total attempts is simply the sum of correct and incorrect
    const totalAttempts = correctCount + incorrectCount;

    // Get hints used from all attempts
    const hintsUsed = allAttemptsForVideo.reduce(
      (sum, attempt) => sum + (attempt.metrics?.hints?.count || 0),
      0
    );

    const averageTimePerAttempt = latestVideo.metrics?.timePerAttempt ?? 0;

    return NextResponse.json({
      success: true,
      data: {
        totalAttempts,
        correctCount,
        incorrectCount, // Now returning incorrect count explicitly
        hintsUsed,
        averageTimePerAttempt,
        // Keeping attemptsBeforeSuccess for backward compatibility if needed
        attemptsBeforeSuccess: incorrectCount,
      },
    });

  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { success: false, error: 'Database query failed' },
      { status: 500 }
    );
  }
}

