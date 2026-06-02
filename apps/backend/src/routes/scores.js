import express from 'express'
import { addScore, getTopScores } from '../store/scores.js'

const router = express.Router()

/**
 * GET /api/scores
 * Ambil leaderboard top scores
 */
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 20
  const scores = getTopScores(limit)
  res.json({ scores })
})

/**
 * POST /api/scores
 * Submit skor baru setelah kuis selesai
 * Body: { playerId, playerName, playerPicture?, score, total, percentage }
 */
router.post('/', (req, res) => {
  const { playerId, playerName, playerPicture, score, total, percentage } = req.body

  if (!playerName || score === undefined || !total || percentage === undefined) {
    return res.status(400).json({ error: 'Data skor tidak lengkap.' })
  }

  addScore({ playerId, playerName, playerPicture, score, total, percentage })

  res.status(201).json({ message: 'Skor berhasil disimpan.' })
})

export default router
