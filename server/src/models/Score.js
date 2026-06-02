import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Score = mongoose.model('Score', scoreSchema);

export default Score;
