import * as scoreRepository from '../repositories/scoreRepository.js';

export const submitScore = async (username, score, totalQuestions) => {
  if (!username || typeof username !== 'string') {
    throw new Error('Valid username is required');
  }
  if (score === undefined || typeof score !== 'number') {
    throw new Error('Valid score is required');
  }
  if (!totalQuestions || typeof totalQuestions !== 'number') {
    throw new Error('Valid totalQuestions is required');
  }

  const scoreData = { username, score, totalQuestions };
  return await scoreRepository.saveScore(scoreData);
};

export const fetchLeaderboard = async () => {
  const scores = await scoreRepository.getTopScores(10);
  return scores;
};
