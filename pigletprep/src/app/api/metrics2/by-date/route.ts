// app/api/metrics2/by-date/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  if (!date || typeof date !== 'string') {
    return NextResponse.json({ message: 'Date parameter is required' }, { status: 400 });
  }

  try {
    const mongoose = await dbConnect();

    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const records = await mongoose.connection.collection('quizattempts').find({
      timestamp: {
        $gte: startDate,
        $lte: endDate,
      },
    }).toArray();

    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
