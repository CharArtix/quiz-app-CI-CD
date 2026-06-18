import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import QuizReview from './pages/QuizReview';
import Profile from './pages/Profile';
import Scoreboard from './pages/Scoreboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-red-100 text-gray-800 font-sans">
        <Routes>
          {/* Halaman login — tidak perlu auth */}
          <Route path="/" element={<Login />} />

          {/* Halaman yang butuh login */}
          <Route path="/quiz" element={
            <ProtectedRoute><Quiz /></ProtectedRoute>
          } />
          <Route path="/result" element={
            <ProtectedRoute><Result /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/scoreboard" element={
            <ProtectedRoute><Scoreboard /></ProtectedRoute>
          } />
          <Route path="/review" element={
            <ProtectedRoute><QuizReview /></ProtectedRoute>
          } />

          {/* Redirect ke login jika rute tidak ada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;