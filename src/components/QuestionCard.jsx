import { HelpCircle } from "lucide-react";

// Komponen untuk menampilkan satu pertanyaan dan opsi jawaban
export default function QuestionCard({ data, onAnswer, totalQuestions, currentIndex }) {
  // Decode HTML entities dari API (misal &quot; menjadi ")
  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="w-full max-w-3xl animate-fade-in">
      {/* Nomor pertanyaan */}
      <div className="flex items-center gap-2 mb-6 text-emerald-600 font-medium bg-emerald-50 w-fit px-3 py-1 rounded-full text-xs md:text-sm border border-emerald-100">
        <HelpCircle size={14} />
        <span>Pertanyaan {currentIndex + 1} dari {totalQuestions}</span>
      </div>

      {/* Teks pertanyaan */}
      <h2 className="text-xl md:text-3xl font-bold text-gray-900 leading-snug mb-8">
        {decodeHTML(data.question)}
      </h2>

      {/* Tombol opsi jawaban */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {data.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(option)}
            className="group relative flex w-full items-center gap-4 p-4 md:p-5 text-left rounded-2xl border-2 border-gray-100 bg-white hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-200 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
          >
            <span className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs md:text-sm font-bold text-gray-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              {String.fromCharCode(65 + idx)}
            </span>
            <span className="text-sm md:text-lg font-medium text-gray-700 group-hover:text-emerald-900">
              {decodeHTML(option)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}