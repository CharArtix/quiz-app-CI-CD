import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import QuestionCard from "../components/QuestionCard";
import { Clock, Loader2, AlertCircle } from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Halaman utama quiz untuk menjawab pertanyaan
export default function Quiz() {
  const { user, quizState, startQuiz, answerQuestion, loading, error } = useQuiz();
  const navigate = useNavigate();

  // Hitung nomor pertanyaan saat ini
  const currentQNum = quizState.currentIndex + 1;
  const totalQ = quizState.questions.length;
  
  useDocumentTitle(`Soal ${currentQNum} dari ${totalQ} | DOT Quiz`);

  useEffect(() => {
    if (user && quizState.status === 'idle') {
      startQuiz();
    }
  }, [user, quizState.status, startQuiz]);

  useEffect(() => {
    if (!loading && quizState.isFinished) {
      navigate("/result");
    }
  }, [quizState.isFinished, loading, navigate]);

  // Tampilkan error jika API gagal
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center border border-red-100">
          <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => (window.reloadPage || (() => window.location.reload()))()} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Tampilkan loading saat fetch pertanyaan
  if (loading || !totalQ) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Menyiapkan pertanyaan...</p>
      </div>
    );
  }

  const currentQuestion = quizState.questions[quizState.currentIndex];
  const progressPercent = (currentQNum / totalQ) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 md:pt-28">
      {/* Header game: fixed, dengan nama user dan timer */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm md:text-base">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Player</p>
              <p className="text-sm md:text-base font-bold text-gray-800 leading-none truncate max-w-25 md:max-w-xs">{user?.name}</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold transition-colors ${
            quizState.timeLeft <= 10 ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-gray-100 text-gray-700 border-transparent'
          }`}>
            <Clock size={16} />
            <span>{quizState.timeLeft}s</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
          <div
            className="h-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tampilkan pertanyaan */}
      <div className="container mx-auto px-4 md:px-6 flex justify-center">
        {currentQuestion && (
          <QuestionCard
            data={currentQuestion}
            currentIndex={quizState.currentIndex}
            totalQuestions={totalQ}
            onAnswer={answerQuestion}
          />
        )}
      </div>
    </div>
  );
}