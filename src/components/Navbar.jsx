import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'
import { BrainCircuit, LayoutDashboard, User, LogOut, ChevronDown, Trophy } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useQuiz()
  const location = useLocation()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    if (window.confirm('Keluar dari sesi ini?')) {
      logout()
      navigate('/')
    }
  }

  const isActive = (path) => location.pathname === path

  const avatar = user?.picture ? (
    <img src={user.picture} alt={user.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
  ) : (
    <span className="text-sm font-bold text-emerald-700">
      {user?.name?.charAt(0).toUpperCase()}
    </span>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/profile" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-md shadow-emerald-200 transition-transform group-hover:scale-105">
            <BrainCircuit className="text-white" size={18} />
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">DOT Quiz</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            to="/quiz"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/quiz')
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <BrainCircuit size={16} />
            Main Kuis
          </Link>
          <Link
            to="/scoreboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive('/scoreboard')
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Trophy size={16} />
            Scoreboard
          </Link>
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className="flex items-center gap-2.5 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm hover:border-emerald-300 hover:bg-emerald-50/50 transition-all"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              {avatar}
            </div>
            <span className="hidden md:block max-w-32 truncate text-sm font-semibold text-gray-800">
              {user?.name}
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black/5 animate-fade-in">
              {/* User info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                {user?.email && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                )}
              </div>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <User size={15} />
                Profil Saya
              </Link>
              <Link
                to="/scoreboard"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors sm:hidden"
              >
                <Trophy size={15} />
                Scoreboard
              </Link>

              <div className="my-1 border-t border-gray-100" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
              >
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
