import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../services/api";
import { Trophy, ArrowLeft, Medal } from "lucide-react";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useDocumentTitle("Leaderboard | DOT Quiz");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const data = await getLeaderboard();
        setScores(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-8 font-sans">
      <div className="w-full max-w-3xl overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-black/5 animate-fade-in flex flex-col min-h-[500px]">
        
        {/* Header */}
        <div className="relative flex flex-col items-center justify-center p-8 text-center text-white bg-linear-to-br from-indigo-600 to-purple-800">
          <div className="absolute top-0 left-0 h-32 w-32 -translate-x-10 -translate-y-10 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-10 translate-y-10 rounded-full bg-black/10 blur-2xl"></div>
          
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>

          <Trophy className="h-16 w-16 text-yellow-300 drop-shadow-xl mb-4" />
          <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">Leaderboard</h1>
          <p className="mt-2 text-indigo-100">Top 10 High Scores</p>
        </div>

        {/* List */}
        <div className="flex-1 p-6 md:p-10 bg-slate-50">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
          ) : scores.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <Trophy size={48} className="mb-4 opacity-20" />
              <p>No scores yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {scores.map((item, index) => (
                <div 
                  key={item._id || index} 
                  className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg
                      ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                        index === 1 ? 'bg-slate-200 text-slate-700' : 
                        index === 2 ? 'bg-amber-100 text-amber-800' : 
                        'bg-slate-100 text-slate-500'}`}
                    >
                      {index < 3 ? <Medal size={20} /> : index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{item.username}</h3>
                      <p className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-indigo-600">{item.score}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      / {item.totalQuestions} Pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
