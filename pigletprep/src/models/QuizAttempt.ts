import mongoose, { Schema } from 'mongoose';

const QuizAttemptSchema = new Schema({
  videoId: String,
  typeOf: String,
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
    timePerAttempt: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const QuizAttempt = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', QuizAttemptSchema);

export default QuizAttempt;