import { Navigate } from 'react-router-dom'
import { useQuiz } from '../context/QuizContext'

/**
 * Komponen guard untuk melindungi route yang memerlukan autentikasi.
 * Jika user belum login → redirect ke halaman login (/).
 */
export default function ProtectedRoute({ children }) {
  const { user } = useQuiz()
  return user ? children : <Navigate to="/" replace />
}
