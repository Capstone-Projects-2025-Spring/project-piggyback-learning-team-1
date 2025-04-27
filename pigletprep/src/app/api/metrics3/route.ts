// This route handles the GET request to fetch incorrect, correct, and hint used per video(grouped by videoId)
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import QuizAttempt from '@/models/QuizAttempt'

export async function GET() {
  await dbConnect()

  // Get all attempts
  const allAttempts = await QuizAttempt.find().lean()

  // Group by clean video filename
  const map = new Map<string, typeof allAttempts>()
  allAttempts.forEach(at => {
    const raw   = at.videoId || ''
    const clean = raw.split('/').pop()?.split('?')[0] || 'Unknown'
    if (!map.has(clean)) map.set(clean, [])
    map.get(clean)!.push(at)
  })

  // Compute stats per video, but first exclude "dqT-UlYlg1s" (this does not have a title)
  const stats = Array.from(map.entries())
    .filter(([videoTitle]) => videoTitle !== 'dqT-UlYlg1s')
    .map(([videoTitle, attempts]) => {
      const totalAttempts = attempts.reduce((sum, a) => sum + (a.attempts || 0), 0)
      const attemptsBeforeSuccess = attempts.reduce(
        (sum, a) => sum + (a.metrics?.attemptsBeforeSuccess || 0),
        0
      )
      const correctCount   = totalAttempts - attemptsBeforeSuccess
      const incorrectCount = attemptsBeforeSuccess
      const hintsUsed = attempts.reduce(
        (sum, a) => sum + (a.metrics?.hints?.count || 0),
        0
      )
      const totalTimeWeighted = attempts.reduce(
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
