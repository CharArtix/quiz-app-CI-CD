import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { saveUserScore } from "../services/api";
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  LogOut, 
  Trophy, 
  Award,
  Star,
  Frown,
  ListChecks,
  Share2,
  BarChart3
} from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Result() {
  const { user, quizState, logout, startQuiz } = useQuiz();
  const navigate = useNavigate();

  // Hitung statistik hasil quiz
  const totalQuestions = quizState.questions.length;
  const totalAnswered = quizState.answers.length; 
  const correctAnswers = quizState.score;
  const wrongAnswers = totalAnswered - correctAnswers; 
  
  // Hitung persentase skor
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  useDocumentTitle(`Hasil: ${scorePercentage}% | DOT Quiz`);

  const scoreSavedRef = useRef(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    if (!quizState.isFinished) {
      navigate("/quiz");
      return;
    }

    if (quizState.isFinished && !scoreSavedRef.current) {
      scoreSavedRef.current = true;
      saveUserScore(user.name, correctAnswers, totalQuestions)
        .catch(err => console.error("Failed to save score:", err));
    }
  }, [user, quizState.isFinished, navigate, correctAnswers, totalQuestions]);

  // Tentukan warna, icon, dan teks berdasarkan skor
  const getResultUI = () => {
    if (scorePercentage === 100) return {
      title: "Sempurna!", 
      desc: "Luar biasa! Tidak ada celah kesalahan sedikitpun.", 
      icon: <Trophy className="h-24 w-24 md:h-32 md:w-32 text-yellow-300 drop-shadow-2xl animate-bounce" />,
      bgGradient: "from-emerald-600 to-teal-800",
      accentColor: "text-emerald-600"
    };
    if (scorePercentage >= 80) return {
      title: "Sangat Bagus!", 
      desc: "Kamu hampir menguasai semua materi.", 
      icon: <Award className="h-24 w-24 md:h-32 md:w-32 text-emerald-200 drop-shadow-xl" />,
      bgGradient: "from-teal-500 to-emerald-700",
      accentColor: "text-teal-600"
    };
    if (scorePercentage >= 60) return {
      title: "Cukup Baik", 
      desc: "Hasil yang lumayan, tapi masih bisa ditingkatkan.", 
      icon: <Star className="h-24 w-24 md:h-32 md:w-32 text-yellow-200 drop-shadow-lg" />,
      bgGradient: "from-blue-500 to-indigo-700",
      accentColor: "text-blue-600"
    };
    return {
      title: "Perlu Latihan", 
      desc: "Jangan patah semangat, coba lagi ya!", 
      icon: <Frown className="h-24 w-24 md:h-32 md:w-32 text-red-200 drop-shadow-lg" />,
      bgGradient: "from-red-500 to-orange-700",
      accentColor: "text-red-600"
    };
  };

  const ui = getResultUI();

  // Logout dengan konfirmasi
  const handleLogout = () => {
    if(window.confirm("Keluar dari sesi ini?")) logout();
  };

  // Main lagi - mulai quiz baru
  const handlePlayAgain = () => {
    startQuiz();
    navigate("/quiz");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8 font-sans">
      
      {/* Container card utama */}
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/5 transition-all md:max-w-5xl md:flex-row md:min-h-125 animate-fade-in">
        
        {/* Bagian kiri: visual skor dan icon */}
        <div className={`relative flex flex-col items-center justify-center p-8 text-center text-white md:w-5/12 md:p-12 bg-linear-to-br ${ui.bgGradient}`}>
          
          {/* Dekorasi Background Abstrak */}
          <div className="absolute top-0 left-0 h-40 w-40 -translate-x-10 -translate-y-10 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-56 w-56 translate-x-10 translate-y-10 rounded-full bg-black/10 blur-3xl"></div>
          
          {/* Icon hasil */}
          <div className="relative z-10 mb-6 animate-float">
            {ui.icon}
          </div>

          {/* Tampil skor dalam persen */}
          <div className="relative z-10">
            <h1 className="text-6xl font-black tracking-tighter md:text-7xl drop-shadow-sm">
              {scorePercentage}%
            </h1>
            <div className="mt-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm border border-white/10">
              Total Score
            </div>
          </div>
        </div>

        {/* Bagian kanan: hasil dan tombol aksi */}
        <div className="flex flex-col justify-center bg-white p-6 md:w-7/12 md:p-12">
          
          <div className="mb-8 text-center md:text-left">
            <h2 className={`text-3xl font-bold ${ui.accentColor} mb-2`}>{ui.title}</h2>
            <p className="text-gray-500 text-lg leading-relaxed">{ui.desc}</p>
          </div>

          {/* Statistik jawaban */}
          <div className="mb-10 grid grid-cols-3 gap-3 md:gap-6">
            
            {/* Jumlah pertanyaan dijawab */}
            <div className="group flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 border border-slate-100 transition-all hover:bg-slate-100 hover:shadow-md hover:-translate-y-1">
              <div className="mb-2 rounded-full bg-white p-2 shadow-sm">
                <BarChart3 className="h-5 w-5 text-slate-500" />
              </div>
              <span className="text-2xl font-black text-slate-800">
                {totalAnswered}<span className="text-xs font-medium text-slate-400">/{totalQuestions}</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Dijawab</span>
            </div>

            {/* Jumlah jawaban benar */}
            <div className="group flex flex-col items-center justify-center rounded-2xl bg-emerald-50 p-4 border border-emerald-100 transition-all hover:bg-emerald-100 hover:shadow-md hover:-translate-y-1">
              <div className="mb-2 rounded-full bg-white p-2 shadow-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-2xl font-black text-emerald-700">{correctAnswers}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-1">Benar</span>
            </div>

            {/* Jumlah jawaban salah */}
            <div className="group flex flex-col items-center justify-center rounded-2xl bg-rose-50 p-4 border border-rose-100 transition-all hover:bg-rose-100 hover:shadow-md hover:-translate-y-1">
              <div className="mb-2 rounded-full bg-white p-2 shadow-sm">
                <XCircle className="h-5 w-5 text-rose-500" />
              </div>
              <span className="text-2xl font-black text-rose-600">{wrongAnswers}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mt-1">Salah</span>
            </div>

          </div>

          {/* Tombol main lagi dan logout */}
          <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
            <button
              onClick={handlePlayAgain}
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <RefreshCw size={18} className="transition-transform group-hover:rotate-180" />
              <span>Main Lagi</span>
            </button>
            
            <button
              onClick={() => navigate("/leaderboard")}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 px-4 font-bold text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              <Trophy size={18} />
              <span>Leaderboard</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-100 bg-white py-3 px-4 font-bold text-gray-500 transition-all hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 active:scale-[0.98]"
            >
              <LogOut size={18} />
              <span>Selesai</span>
            </button>
          </div>

          {/* Tampilkan nama user */}
          <div className="mt-8 text-center md:text-left">
            <p className="text-xs text-gray-400">
              Player ID: <span className="font-mono text-gray-600">{user?.name}</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}