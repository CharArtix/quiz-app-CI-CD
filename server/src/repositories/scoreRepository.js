import Score from '../models/Score.js';

export const saveScore = async (scoreData) => {
  const score = new Score(scoreData);
  return await score.save();
};

export const getTopScores = async (limit = 10) => {
  return await Score.find()
    .sort({ score: -1, createdAt: -1 })
    .limit(limit)
    .exec();
};
