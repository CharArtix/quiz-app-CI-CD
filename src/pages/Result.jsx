import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import Navbar from "../components/Navbar";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Trophy,
  Award,
  Star,
  Frown,
  BarChart3,
  LayoutDashboard,
  Share2,
  Check,
  BookOpen,
} from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Result() {
  const { user, quizState, startQuiz, saveScore } = useQuiz();
  const navigate = useNavigate();
  const scoreSubmittedRef = useRef(false);
  const [copied, setCopied] = useState(false);

  const totalQuestions = quizState.questions.length;
  const totalAnswered = quizState.answers.length;
  const correctAnswers = quizState.score;
  const wrongAnswers = totalAnswered - correctAnswers;
  const scorePercentage = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;

  const handleShare = async () => {
    const textToCopy = `I scored ${scorePercentage} on Quiz App!`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks: ", err);
    }
  };

  useDocumentTitle(`Hasil: ${scorePercentage}% | DOT Quiz`);

  // Submit skor ke backend saat pertama kali halaman dimuat
  useEffect(() => {
    if (!quizState.isFinished || scoreSubmittedRef.current || !user) return;
    scoreSubmittedRef.current = true;

    saveScore({
      playerId: user.googleId || user.name,
      playerName: user.name,
      playerPicture: user.picture || null,
      score: correctAnswers,
      total: totalQuestions,
      percentage: scorePercentage,
      answers: quizState.answers,
      questions: quizState.questions,
    });
  }, [quizState.isFinished, quizState.answers, quizState.questions, user, correctAnswers, totalQuestions, scorePercentage, saveScore]);

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

  const handlePlayAgain = () => {
    startQuiz();
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-4 py-8 pt-24 font-sans">

        <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/5 md:max-w-5xl md:flex-row md:min-h-125 animate-fade-in">

          {/* Kiri: visual skor */}
          <div className={`relative flex flex-col items-center justify-center p-8 text-center text-white md:w-5/12 md:p-12 bg-linear-to-br ${ui.bgGradient}`}>
            <div className="absolute top-0 left-0 h-40 w-40 -translate-x-10 -translate-y-10 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 h-56 w-56 translate-x-10 translate-y-10 rounded-full bg-black/10 blur-3xl"></div>

            <div className="relative z-10 mb-6 animate-float">{ui.icon}</div>
            <div className="relative z-10">
              <h1 className="text-6xl font-black tracking-tighter md:text-7xl drop-shadow-sm">
                {scorePercentage}%
              </h1>
              <div className="mt-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm border border-white/10">
                Total Score
              </div>
            </div>
          </div>

          {/* Kanan: detail hasil */}
          <div className="flex flex-col justify-center bg-white p-6 md:w-7/12 md:p-12">
            <div className="mb-8 text-center md:text-left">
              <h2 className={`text-3xl font-bold ${ui.accentColor} mb-2`}>{ui.title}</h2>
              <p className="text-gray-500 text-lg leading-relaxed">{ui.desc}</p>
            </div>

            {/* Statistik */}
            <div className="mb-8 grid grid-cols-3 gap-3 md:gap-6">
              <div className="group flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-4 border border-slate-100 transition-all hover:bg-slate-100 hover:shadow-md hover:-translate-y-1">
                <div className="mb-2 rounded-full bg-white p-2 shadow-sm">
                  <BarChart3 className="h-5 w-5 text-slate-500" />
                </div>
                <span className="text-2xl font-black text-slate-800">
                  {totalAnswered}<span className="text-xs font-medium text-slate-400">/{totalQuestions}</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Dijawab</span>
              </div>

              <div className="group flex flex-col items-center justify-center rounded-2xl bg-emerald-50 p-4 border border-emerald-100 transition-all hover:bg-emerald-100 hover:shadow-md hover:-translate-y-1">
                <div className="mb-2 rounded-full bg-white p-2 shadow-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-2xl font-black text-emerald-700">{correctAnswers}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-1">Benar</span>
              </div>

              <div className="group flex flex-col items-center justify-center rounded-2xl bg-rose-50 p-4 border border-rose-100 transition-all hover:bg-rose-100 hover:shadow-md hover:-translate-y-1">
                <div className="mb-2 rounded-full bg-white p-2 shadow-sm">
                  <XCircle className="h-5 w-5 text-rose-500" />
                </div>
                <span className="text-2xl font-black text-rose-600">{wrongAnswers}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mt-1">Salah</span>
              </div>
            </div>

            {/* Tombol aksi */}
            <div className="flex flex-col gap-3 sm:flex-row md:gap-4">
              <button
                onClick={handlePlayAgain}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 px-6 font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <RefreshCw size={20} className="transition-transform group-hover:rotate-180" />
                <span>Main Lagi</span>
              </button>

              <button
                onClick={handleShare}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-4 px-6 font-bold transition-all active:scale-[0.98] ${
                  copied
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 shadow-xl shadow-emerald-600/10"
                    : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 shadow-xl shadow-blue-600/10"
                }`}
              >
                {copied ? <Check size={20} /> : <Share2 size={20} />}
                <span>{copied ? "Tersalin!" : "Share Result"}</span>
              </button>

              <Link
                to="/scoreboard"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-yellow-200 bg-yellow-50 py-4 px-6 font-bold text-yellow-700 transition-all hover:bg-yellow-100 hover:border-yellow-300 active:scale-[0.98]"
              >
                <Trophy size={20} />
                <span>Scoreboard</span>
              </Link>
            </div>

            {/* Tombol Review Quiz */}
            <div className="mt-3">
              <Link
                to="/review"
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-indigo-200 bg-indigo-50 py-4 px-6 font-bold text-indigo-700 transition-all hover:bg-indigo-100 hover:border-indigo-300 hover:-translate-y-0.5 active:scale-[0.98] shadow-lg shadow-indigo-100"
              >
                <BookOpen size={20} />
                <span>Lihat Review Jawaban</span>
              </Link>
            </div>

            <div className="mt-6 text-center md:text-left">
              <p className="text-xs text-gray-400">
                Player: <span className="font-mono text-gray-600">{user?.name}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}