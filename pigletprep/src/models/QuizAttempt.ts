import mongoose from 'mongoose';

const QuizAttemptSchema = new mongoose.Schema({
  videoId: String,
  question: String,
  selectedAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  timeToAnswer: Number,
  attempts: Number,
  metrics: {
    hints: {
      used: Boolean,
      count: Number
    },
    attemptsBeforeSuccess: Number,
    timePerAttempt: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.QuizAttempt || 
  mongoose.model('QuizAttempt', QuizAttemptSchema);