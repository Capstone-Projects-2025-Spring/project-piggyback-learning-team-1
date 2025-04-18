import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import QuizAttempt from '@/models/QuizAttempt';

export async function GET() {
  try {
    console.log('Starting export...');
    await dbConnect();
    
    // Fetch all quiz attempts
    const attempts = await QuizAttempt.find({}).lean();
    console.log(`Found ${attempts.length} attempts`);

    // Define CSV headers
    const headers = [
      'videoId',
      'question',
      'selectedAnswer',
      'correctAnswer',
      'isCorrect',
      'timeToAnswer',
      'attempts',
      'hints_used',
      'timePerAttempt',
      'timestamp'
    ];

    // Convert data to CSV format
    const rows = attempts.map(attempt => [
      attempt.videoId || '',
      attempt.question ? `"${attempt.question.replace(/"/g, '""')}"` : '',
      attempt.selectedAnswer || '',
      attempt.correctAnswer || '',
      attempt.isCorrect ? 'true' : 'false',
      attempt.timeToAnswer || '0',
      attempt.attempts || '0',
      attempt.metrics?.hints?.count || '0',
      attempt.metrics?.timePerAttempt || '0',
      new Date(attempt.createdAt || Date.now()).toISOString()
    ]);

    // Combine headers and rows
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    console.log('CSV generated successfully');

    // Return CSV file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=quiz-attempts.csv'
      }
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}