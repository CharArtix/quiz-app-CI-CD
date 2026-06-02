import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Result from './pages/Result';
import Leaderboard from './pages/Leaderboard';

// Komponen utama aplikasi dengan routing
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Routes>
          {/* Halaman login - entry point */}
          <Route path="/" element={<Login />} />
          
          {/* Halaman quiz - tampilkan pertanyaan */}
          <Route path="/quiz" element={<Quiz />} />
          
          {/* Halaman hasil akhir */}
          <Route path="/result" element={<Result />} />

          {/* Halaman leaderboard */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Redirect ke login jika rute tidak ada */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;