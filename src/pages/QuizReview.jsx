import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import Navbar from "../components/Navbar";
import {
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  RefreshCw,
  Trophy,
  BookOpen,
  Clock,
  Target,
} from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

// Decode HTML entities dari OpenTDB
const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

function ReviewCard({ item, index, isExpanded, onToggle }) {
  const statusColor = item.isCorrect
    ? "border-emerald-200 bg-emerald-50/50"
    : "border-rose-200 bg-rose-50/50";

  const headerColor = item.isCorrect
    ? "bg-emerald-50 border-emerald-200"
    : "bg-rose-50 border-rose-200";

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden shadow-sm transition-all duration-300 ${statusColor}`}
    >
      {/* Header soal */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-4 p-4 md:p-5 text-left border-b transition-colors cursor-pointer ${headerColor}`}
      >
        {/* Nomor & icon status */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-sm font-black shadow-sm ${
              item.isCorrect
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            {index + 1}
          </div>
          <p className="font-semibold text-gray-800 text-sm md:text-base leading-snug truncate">
            {decodeHtml(item.question)}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {item.isCorrect ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <XCircle className="h-5 w-5 text-rose-500" />
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Detail soal (expandable) */}
      {isExpanded && (
        <div className="p-4 md:p-6 space-y-4 animate-fade-in">
          {/* Pertanyaan lengkap */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Pertanyaan
            </p>
            <p className="text-gray-800 font-medium leading-relaxed">
              {decodeHtml(item.question)}
            </p>
          </div>

          {/* Jawaban user */}
          <div
            className={`rounded-xl p-4 border ${
              item.isCorrect
                ? "bg-emerald-50 border-emerald-200"
                : "bg-rose-50 border-rose-200"
            }`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                item.isCorrect ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {item.isCorrect ? "✓ Jawaban Kamu (Benar)" : "✗ Jawaban Kamu (Salah)"}
            </p>
            <p
              className={`font-semibold ${
                item.isCorrect ? "text-emerald-800" : "text-rose-800"
              }`}
            >
              {item.selected ? decodeHtml(item.selected) : (
                <span className="italic text-gray-400">Tidak dijawab (waktu habis)</span>
              )}
            </p>
          </div>

          {/* Jawaban benar (hanya tampil jika salah) */}
          {!item.isCorrect && (
            <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">
                ✓ Jawaban Benar
              </p>
              <p className="font-semibold text-emerald-800">
                {decodeHtml(item.correct)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function QuizReview() {
  const { quizState, startQuiz } = useQuiz();
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [filter, setFilter] = useState("all"); // "all" | "correct" | "wrong"

  useDocumentTitle("Review Quiz | DOT Quiz");

  const { answers, score, questions } = quizState;
  const totalQ = questions.length;
  const totalAnswered = answers.length;
  const wrong = totalAnswered - score;
  const percentage = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;

  // Filter soal
  const filteredAnswers = answers.filter((a) => {
    if (filter === "correct") return a.isCorrect;
    if (filter === "wrong") return !a.isCorrect;
    return true;
  });

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const expandAll = () => setExpandedIndex("all");
  const collapseAll = () => setExpandedIndex(null);

  const handlePlayAgain = () => {
    startQuiz();
    navigate("/quiz");
  };

  // Redirect jika quiz belum selesai
  if (!quizState.isFinished && answers.length === 0) {
    navigate("/result");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 max-w-3xl pt-24 pb-16">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={() => navigate("/result")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-6 group"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            Kembali ke Hasil
          </button>

          <div className="bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-6 md:p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-gray-900">
                  Review Quiz
                </h1>
                <p className="text-sm text-gray-500">
                  Tinjau semua jawaban kamu di sini
                </p>
              </div>
            </div>

            {/* Statistik ringkas */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 p-3 md:p-4">
                <Target className="h-5 w-5 text-indigo-500 mb-1" />
                <span className="text-xl md:text-2xl font-black text-indigo-700">
                  {percentage}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mt-0.5">
                  Skor
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 p-3 md:p-4">
                <Clock className="h-5 w-5 text-slate-400 mb-1" />
                <span className="text-xl md:text-2xl font-black text-slate-700">
                  {totalAnswered}
                  <span className="text-xs font-medium text-slate-400">
                    /{totalQ}
                  </span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                  Dijawab
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 p-3 md:p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-1" />
                <span className="text-xl md:text-2xl font-black text-emerald-700">
                  {score}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mt-0.5">
                  Benar
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 p-3 md:p-4">
                <XCircle className="h-5 w-5 text-rose-500 mb-1" />
                <span className="text-xl md:text-2xl font-black text-rose-600">
                  {wrong}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mt-0.5">
                  Salah
                </span>
              </div>
            </div>
          </div>

          {/* Filter & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Filter tabs */}
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm ring-1 ring-black/5">
              {[
                { key: "all", label: `Semua (${totalAnswered})` },
                { key: "correct", label: `Benar (${score})` },
                { key: "wrong", label: `Salah (${wrong})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    filter === key
                      ? key === "correct"
                        ? "bg-emerald-500 text-white shadow-sm"
                        : key === "wrong"
                        ? "bg-rose-500 text-white shadow-sm"
                        : "bg-indigo-500 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Expand / Collapse all */}
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Buka Semua
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={collapseAll}
                className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                Tutup Semua
              </button>
            </div>
          </div>
        </div>

        {/* Daftar soal */}
        <div className="space-y-3">
          {filteredAnswers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">Tidak ada data untuk filter ini</p>
            </div>
          ) : (
            filteredAnswers.map((item, i) => {
              const originalIndex = answers.indexOf(item);
              return (
                <ReviewCard
                  key={originalIndex}
                  item={item}
                  index={originalIndex}
                  isExpanded={expandedIndex === "all" || expandedIndex === originalIndex}
                  onToggle={() => toggleExpand(originalIndex)}
                />
              );
            })
          )}
        </div>

        {/* Tombol aksi bawah */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePlayAgain}
            className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 px-6 font-bold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <RefreshCw
              size={20}
              className="transition-transform group-hover:rotate-180"
            />
            Main Lagi
          </button>
          <button
            onClick={() => navigate("/scoreboard")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-yellow-200 bg-yellow-50 py-4 px-6 font-bold text-yellow-700 transition-all hover:bg-yellow-100 hover:border-yellow-300 active:scale-[0.98]"
          >
            <Trophy size={20} />
            Scoreboard
          </button>
        </div>
      </div>
    </div>
  );
}
