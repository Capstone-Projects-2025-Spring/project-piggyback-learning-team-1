// Route for radar chart data
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import QuizAttempt from '@/models/QuizAttempt'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dateStr = searchParams.get('date')
  if (!dateStr) {
    return NextResponse.json(
      { success: false, message: 'Date parameter is required' },
      { status: 400 }
    )
  }

  // Build the UTC range for that calendar day
  const startDate = new Date(dateStr)
  startDate.setUTCHours(0, 0, 0, 0)
  const endDate = new Date(dateStr)
  endDate.setUTCHours(23, 59, 59, 999)

  await dbConnect()

  // Fetch only attempts in that window
  const attempts = await QuizAttempt.find({
    timestamp: { $gte: startDate, $lte: endDate },
  })
    .lean()

  // Group by cleanVideoId
  const map = new Map<string, typeof attempts>()
  attempts.forEach((at) => {
    const raw   = at.videoId || ''
    const clean = raw.split('/').pop()?.split('?')[0] || 'Unknown'
    if (!map.has(clean)) map.set(clean, [])
    map.get(clean)!.push(at)
  })

  // Compute stats per video, excluding the placeholder
  const stats = Array.from(map.entries())
    .filter(([videoTitle]) => videoTitle !== 'dqT-UlYlg1s')
    .map(([videoTitle, group]) => {
      const totalAttempts = group.reduce((sum, a) => sum + (a.attempts || 0), 0)
      const attemptsBeforeSuccess = group.reduce(
        (sum, a) => sum + (a.metrics?.attemptsBeforeSuccess || 0),
        0
      )
      const correctCount   = totalAttempts - attemptsBeforeSuccess
      const incorrectCount = attemptsBeforeSuccess
      const hintsUsed = group.reduce(
        (sum, a) => sum + (a.metrics?.hints?.count || 0),
        0
      )
      const totalTimeWeighted = group.reduce(
        (sum, a) =>
          sum + (a.metrics?.timePerAttempt ?? 0) * (a.attempts || 0),
        0
      )
      const averageTimePerAttempt =
        totalAttempts > 0 ? totalTimeWeighted / totalAttempts : 0

      return {
        videoTitle,
        totalAttempts,
        correctCount,
        incorrectCount,
        hintsUsed,
        averageTimePerAttempt,
      }
    })

  return NextResponse.json({ success: true, data: stats })
}
