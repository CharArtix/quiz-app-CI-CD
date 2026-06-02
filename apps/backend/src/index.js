import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import scoresRouter from './routes/scores.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Quiz App Backend is running 🚀',
    version: '0.0.0',
  })
})

// === ROUTES ===
app.use('/api/auth', authRouter)
app.use('/api/scores', scoresRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`)
})
