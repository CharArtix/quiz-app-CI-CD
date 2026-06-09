/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import Navbar from '../components/Navbar'
import { getScoreboard } from '../services/scoreService'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Trophy, Medal, RefreshCw, Crown, Star, Loader2, AlertCircle, BrainCircuit } from 'lucide-react'

export default function Scoreboard() {
  const { user, startQuiz } = useQuiz()
  const navigate = useNavigate()
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  useDocumentTitle('Scoreboard | DOT Quiz')

  const fetchScores = async () => {
    try {
      setError('')
      const data = await getScoreboard(20)
      setScores(data)
      setLastUpdated(new Date())
    } catch {
      setError('Gagal memuat scoreboard. Pastikan backend sudah running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScores()
    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchScores, 30000)
    return () => clearInterval(interval)
  }, [])

  const handlePlayAgain = () => {
    startQuiz()
    navigate('/quiz')
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={18} className="text-yellow-500" />
    if (rank === 2) return <Medal size={18} className="text-slate-400" />
    if (rank === 3) return <Medal size={18} className="text-amber-600" />
    return <span className="text-sm font-bold text-gray-400">{rank}</span>
  }

  const getRankRowStyle = (rank, isCurrentUser) => {
    if (isCurrentUser) return 'bg-emerald-50 ring-1 ring-emerald-200'
    if (rank === 1) return 'bg-yellow-50/60'
    if (rank === 2) return 'bg-slate-50/60'
    if (rank === 3) return 'bg-amber-50/60'
    return 'hover:bg-gray-50'
  }

  const getScoreBarColor = (pct) => {
    if (pct >= 80) return 'bg-emerald-500'
    if (pct >= 60) return 'bg-blue-500'
    return 'bg-rose-400'
  }

  const currentPlayerId = user?.googleId || user?.name

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto max-w-4xl px-4 pt-24 pb-16">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 shadow-md shadow-yellow-200">
                <Trophy size={20} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-gray-900">Scoreboard</h1>
            </div>
            <p className="text-gray-500 text-sm ml-13">
              Top player terbaik — {lastUpdated ? `Update: ${lastUpdated.toLocaleTimeString('id-ID')}` : 'Memuat...'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchScores}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm hover:border-emerald-300 hover:text-emerald-600 transition-all disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handlePlayAgain}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hover:-translate-y-0.5"
            >
              <BrainCircuit size={15} />
              Main Sekarang
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="rounded-3xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
          {loading ? (
            <div className="py-24 flex flex-col items-center gap-4">
              <Loader2 size={40} className="animate-spin text-emerald-500" />
              <p className="text-gray-400 font-medium">Memuat scoreboard...</p>
            </div>
          ) : error ? (
            <div className="py-24 flex flex-col items-center gap-4 text-center px-4">
              <AlertCircle size={40} className="text-red-400" />
              <p className="text-gray-500 font-medium max-w-sm">{error}</p>
              <button onClick={fetchScores} className="text-sm font-semibold text-emerald-600 hover:underline">
                Coba Lagi
              </button>
            </div>
          ) : scores.length === 0 ? (
            <div className="py-24 flex flex-col items-center gap-4 text-center">
              <Star size={40} className="text-gray-200" />
              <p className="text-gray-400 font-medium">Belum ada skor yang tercatat.</p>
              <p className="text-sm text-gray-400">Jadilah yang pertama bermain!</p>
              <button onClick={handlePlayAgain} className="mt-2 text-sm font-semibold text-emerald-600 hover:underline">
                Main Sekarang →
              </button>
            </div>
          ) : (
            <>
              {/* Top 3 Podium */}
              {scores.length >= 3 && (
                <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-8">
                  <div className="flex items-end justify-center gap-4">
                    {/* 2nd */}
                    <PodiumCard entry={scores[1]} rank={2} isCurrentUser={scores[1]?.playerId === currentPlayerId} />
                    {/* 1st */}
                    <PodiumCard entry={scores[0]} rank={1} isCurrentUser={scores[0]?.playerId === currentPlayerId} />
                    {/* 3rd */}
                    <PodiumCard entry={scores[2]} rank={3} isCurrentUser={scores[2]?.playerId === currentPlayerId} />
                  </div>
                </div>
              )}

              {/* Full Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400 w-16">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Player</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Skor</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400 hidden sm:table-cell">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {scores.map((entry, i) => {
                      const rank = i + 1
                      const isCurrentUser = entry.playerId === currentPlayerId
                      return (
                        <tr key={entry.playerId} className={`transition-colors ${getRankRowStyle(rank, isCurrentUser)}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center w-8 h-8">
                              {getRankIcon(rank)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                {entry.playerPicture ? (
                                  <img src={entry.playerPicture} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                  <span className="text-sm font-bold text-emerald-700">
                                    {entry.playerName?.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                  {entry.playerName}
                                  {isCurrentUser && (
                                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">Kamu</span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xl font-black text-gray-900">{entry.percentage}%</span>
                            <span className="ml-1.5 text-xs text-gray-400">{entry.score}/{entry.total}</span>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell">
                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${getScoreBarColor(entry.percentage)}`}
                                style={{ width: `${entry.percentage}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 hidden md:table-cell">
                            {new Date(entry.playedAt).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Scoreboard auto-refresh setiap 30 detik • Menampilkan skor terbaik per player
        </p>
      </div>
    </div>
  )
}

function PodiumCard({ entry, rank }) {
  const heights = { 1: 'h-28', 2: 'h-20', 3: 'h-16' }
  const colors = {
    1: 'bg-yellow-400 text-white shadow-yellow-200',
    2: 'bg-slate-300 text-white shadow-slate-200',
    3: 'bg-amber-500 text-white shadow-amber-200',
  }
  const icons = { 1: '🥇', 2: '🥈', 3: '🥉' }

  return (
    <div className={`flex flex-col items-center gap-2 ${rank === 1 ? 'scale-110' : ''}`}>
      {rank === 1 && <Crown size={20} className="text-yellow-500 animate-bounce" />}
      <div className="h-14 w-14 rounded-full overflow-hidden bg-emerald-100 ring-2 ring-white shadow-lg flex items-center justify-center flex-shrink-0">
        {entry?.playerPicture ? (
          <img src={entry.playerPicture} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="text-xl font-black text-emerald-700">{entry?.playerName?.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <p className="text-xs font-bold text-gray-700 text-center max-w-20 truncate">{entry?.playerName}</p>
      <p className="text-sm font-black text-gray-900">{entry?.percentage}%</p>
      <div className={`w-20 ${heights[rank]} rounded-t-xl flex items-center justify-center text-2xl shadow-lg ${colors[rank]}`}>
        {icons[rank]}
      </div>
    </div>
  )
}
