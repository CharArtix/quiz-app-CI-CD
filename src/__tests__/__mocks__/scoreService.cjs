// Jest-compatible CJS shim untuk scoreService.js
// File ini menggantikan src/services/scoreService.js saat test berjalan
// menggunakan process.env yang sudah di-set di setupEnv.cjs

const axios = require('axios');
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Submit skor ke backend setelah kuis selesai
 * @param {{ playerId, playerName, playerPicture, score, total, percentage }} scoreData
 */
const submitScore = async (scoreData) => {
  const response = await axios.post(`${API_URL}/api/scores`, scoreData);
  return response.data;
};

/**
 * Ambil leaderboard dari backend
 * @param {number} limit
 * @returns {Promise<Array>}
 */
const getScoreboard = async (limit = 20) => {
  const response = await axios.get(`${API_URL}/api/scores`, { params: { limit } });
  return response.data.scores;
};

module.exports = { submitScore, getScoreboard };
