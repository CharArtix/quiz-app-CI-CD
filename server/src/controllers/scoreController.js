import * as scoreService from '../services/scoreService.js';

export const saveScore = async (req, res) => {
  try {
    const { username, score, totalQuestions } = req.body;
    const newScore = await scoreService.submitScore(username, score, totalQuestions);
    res.status(201).json({ success: true, data: newScore });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await scoreService.fetchLeaderboard();
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving leaderboard' });
  }
};
