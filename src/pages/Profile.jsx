import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import Navbar from '../components/Navbar'
import useDocumentTitle from '../hooks/useDocumentTitle'
import {
  Trophy, RefreshCw, Target, TrendingUp, Calendar,
  CheckCircle2, XCircle, Mail, User, Play, Sparkles, Crown, Gamepad2, ArrowRight
} from 'lucide-react'

export default function Profile() {
  const { user, startQuiz } = useQuiz()
  const navigate = useNavigate()

  // Ambil riwayat kuis 
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!user?.googleId) {
          setLoadingHistory(false)
          return
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/scores/history/${user.googleId}`
        )

        const data = await response.json()

        setHistory(data.history || [])
      } catch (err) {
        console.error('Failed to load history:', err)
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [user])

  useDocumentTitle(`Profil ${user?.name || ''} | DOT Quiz`)

  // Hitung statistik
  const totalGames = history.length
  const avgScore = totalGames > 0
    ? Math.round(history.reduce((sum, h) => sum + h.percentage, 0) / totalGames)
    : 0
  const bestScore = totalGames > 0
    ? Math.max(...history.map((h) => h.percentage))
    : 0

  const handlePlayAgain = () => {
    startQuiz()
    navigate('/quiz')
  }

  const avatar = user?.picture ? (
    <img
      src={user.picture}
      alt={user.name}
      className="h-full w-full object-cover rounded-2xl"
      referrerPolicy="no-referrer"
    />
  ) : (
    <span className="text-4xl font-black text-emerald-700">
      {user?.name?.charAt(0).toUpperCase()}
    </span>
  )

  const getScoreBadge = (pct) => {
    if (pct === 100) return { label: 'Perfect 🌟', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
    if (pct >= 80) return { label: 'Sangat Baik 🔥', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    if (pct >= 60) return { label: 'Cukup Baik 👍', color: 'bg-blue-50 text-blue-700 border-blue-200' }
    return { label: 'Perlu Latihan 💪', color: 'bg-rose-50 text-rose-700 border-rose-200' }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />

      {/* Decorative top background gradient */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none z-0" />

      <div className="relative z-10 container mx-auto max-w-5xl px-4 pt-24 pb-16">

        {/* Welcome & Profile Dashboard Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 p-8 text-white shadow-2xl mb-8 border border-emerald-800/20">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/4 -translate-y-1/4 rounded-full bg-emerald-500/10 blur-[80px]" />
          <div className="absolute bottom-0 left-0 h-96 w-96 -translate-x-1/4 translate-y-1/4 rounded-full bg-teal-500/10 blur-[80px]" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">

            {/* Profile Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-white/10 border border-white/20 p-1 shadow-2xl backdrop-blur-md overflow-hidden flex items-center justify-center">
                  {avatar}
                </div>
                <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-emerald-500 border-2 border-emerald-900 flex items-center justify-center shadow-md">
                  <Sparkles className="text-white fill-white" size={12} />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 border border-white/5 mb-3 backdrop-blur-sm">
                  <Crown size={12} className="text-yellow-400 fill-yellow-400" />
                  <span>PREMIUM CHALLENGER</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">{user?.name}</h1>
                <p className="text-emerald-200/80 text-sm mt-1">{user?.email}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300/60 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Aktif • via {user?.googleId ? 'Google Account' : 'Guest'}</span>
                </div>
              </div>
            </div>

            {/* CTA to start quiz */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 md:max-w-xs w-full backdrop-blur-md flex flex-col justify-between shadow-inner">
              <div>
                <h3 className="font-bold text-lg text-white mb-1.5 flex items-center gap-2">
                  <Gamepad2 size={18} className="text-emerald-400" />
                  Tantangan Kuis
                </h3>
                <p className="text-xs text-emerald-200/70 leading-relaxed mb-5">
                  Uji pemahaman logikamu dengan 10 soal pilihan terbaik seputar software engineering.
                </p>
              </div>
              <button
                onClick={handlePlayAgain}
                className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 py-3.5 px-5 font-bold text-white shadow-lg shadow-emerald-400/20 hover:from-emerald-300 hover:to-teal-400 hover:shadow-emerald-300/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer"
              >
                {totalGames > 0 ? (
                  <>
                    <RefreshCw size={15} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Main Lagi</span>
                  </>
                ) : (
                  <>
                    <Play size={15} className="fill-white" />
                    <span>Mulai Kuis</span>
                  </>
                )}
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>

        {/* Stats Section Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-600" />
          Statistik Permainann
        </h2>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: 'Total Bermain',
              value: totalGames,
              desc: 'Sesi kuis diselesaikan',
              icon: <Target size={24} />,
              color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
              glow: 'group-hover:bg-blue-500/20'
            },
            {
              label: 'Rata-rata Skor',
              value: `${avgScore}%`,
              desc: 'Performa rata-rata game',
              icon: <TrendingUp size={24} />,
              color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
              glow: 'group-hover:bg-emerald-500/20'
            },
            {
              label: 'Skor Terbaik',
              value: `${bestScore}%`,
              desc: 'Rekor nilai tertinggi kamu',
              icon: <Trophy size={24} />,
              color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
              glow: 'group-hover:bg-yellow-500/20'
            },
          ].map((stat) => (
            <div key={stat.label} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-200/60 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</span>
                <div className={`rounded-xl p-3 border ${stat.color} transition-all duration-300 ${stat.glow}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-400 leading-none">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* History Section */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200/60 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              Riwayat Kuis Terakhir
            </h2>
            <Link to="/scoreboard" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
              <Trophy size={14} />
              Lihat Scoreboard
            </Link>
          </div>

          {loadingHistory ? (
            <div className="py-12 text-center">
              Memuat riwayat permainan...
            </div>
          ) : history.length === 0 ? (
            <div className="py-20 text-center px-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <Target size={30} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Riwayat Bermain</h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                Kamu belum pernah mengerjakan kuis. Ayo mulai tantangan pertamamu sekarang!
              </p>
              <button
                onClick={handlePlayAgain}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:-translate-y-0.5"
              >
                <Play size={14} className="fill-white" />
                Mulai Kuis Pertama
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400 w-16">#</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Skor Akhir</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Detail Jawaban</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Predikat</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Waktu Bermain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((h, i) => {
                    const badge = getScoreBadge(h.percentage)
                    return (
                      <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-gray-400">{i + 1}</td>
                        <td className="px-6 py-4">
                          <span className="text-2xl font-black text-gray-900 tracking-tight">{h.percentage}%</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              <CheckCircle2 size={13} className="text-emerald-500" /> {h.score}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-rose-500 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                              <XCircle size={13} className="text-rose-500" /> {h.total - h.score}
                            </span>
                            <span className="text-xs text-gray-400">dari {h.total} Soal</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 flex items-center gap-1.5">
                          <Calendar size={13} />
                          {new Date(h.playedAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
