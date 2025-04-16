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