import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Submit skor ke backend setelah kuis selesai
 * @param {{ playerId, playerName, playerPicture, score, total, percentage }} scoreData
 */
export const submitScore = async (scoreData) => {
  const response = await axios.post(`${API_URL}/api/scores`, scoreData)
  return response.data
}

/**
 * Ambil leaderboard dari backend
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export const getScoreboard = async (limit = 20) => {
  const response = await axios.get(`${API_URL}/api/scores`, { params: { limit } })
  return response.data.scores
}
