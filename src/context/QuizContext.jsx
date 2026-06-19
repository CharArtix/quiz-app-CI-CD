/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { getQuestions } from "../services/api";
import { submitScore } from "../services/scoreService";
import { QUIZ_DURATION } from "../utils/constants";

// Context untuk state management quiz
const QuizContext = createContext();

// Fungsi utility untuk shuffle array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

export const QuizProvider = ({ children }) => {
  // State user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ref untuk prevent fetch duplikat
  const isFetchingRef = useRef(false);

  // State untuk mengontrol semua aspek quiz
  const [quizState, setQuizState] = useState({
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [], 
    timeLeft: QUIZ_DURATION,
    endTime: null,
    isFinished: false,
    status: 'idle', 
  });

  // Ambil data dari localStorage saat mount
  useEffect(() => {
    const savedUser = localStorage.getItem("quizUser");
    const savedQuiz = localStorage.getItem("quizState");
    
    if (savedUser) setUser(JSON.parse(savedUser));
    
    if (savedQuiz) {
      const parsedQuiz = JSON.parse(savedQuiz);
      
      if (parsedQuiz.status === 'playing' && parsedQuiz.endTime) {
        const remainingTime = Math.ceil((parsedQuiz.endTime - Date.now()) / 1000);
        
        if (remainingTime <= 0) {
          setQuizState({ ...parsedQuiz, timeLeft: 0, isFinished: true, status: 'finished' });
        } else {
          setQuizState({ ...parsedQuiz, timeLeft: remainingTime });
        }
      } else {
        setQuizState(parsedQuiz);
      }
    }
  }, []);

  // Simpan state quiz ke localStorage setiap ada perubahan
  useEffect(() => {
    if (quizState.status !== 'idle') {
      localStorage.setItem("quizState", JSON.stringify(quizState));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    quizState.status, 
    quizState.questions, 
    quizState.currentIndex, 
    quizState.score, 
    quizState.answers, 
    quizState.isFinished,
    quizState.endTime 
  ]);

  // Menyelesaikan quiz
  const finishQuiz = useCallback(() => {
    setQuizState((prev) => ({ ...prev, isFinished: true, status: 'finished', timeLeft: 0 }));
  }, []);

  // Countdown timer untuk quiz
  useEffect(() => {
    if (quizState.status === 'playing' && quizState.endTime) {
      const timer = setInterval(() => {
        const now = Date.now();
        const remaining = Math.ceil((quizState.endTime - now) / 1000);

        if (remaining <= 0) {
          clearInterval(timer);
          finishQuiz();
        } else {
          setQuizState((prev) => ({ ...prev, timeLeft: remaining }));
        }
      }, 500);

      return () => clearInterval(timer);
    }
  }, [quizState.status, quizState.endTime, finishQuiz]);

  // Fetch dan format pertanyaan dari API
  const fetchQuestions = useCallback(async () => {
    // Ambil pertanyaan dari API
    const rawQuestions = await getQuestions();

    // Format pertanyaan: decode HTML dan shuffle opsi
    const formattedQuestions = rawQuestions.map((q) => ({
      question: q.question,
      correct_answer: q.correct_answer,
      options: shuffleArray([q.correct_answer, ...q.incorrect_answers]),
    }));

    // Hitung waktu akhir quiz
    const now = Date.now();
    const endTime = now + QUIZ_DURATION * 1000;

    // Set state awal quiz
    setQuizState({
      questions: formattedQuestions,
      currentIndex: 0,
      score: 0,
      answers: [],
      timeLeft: QUIZ_DURATION,
      endTime: endTime,
      isFinished: false,
      status: 'playing',
    });
    
    setLoading(false);
    isFetchingRef.current = false;
  }, []);

  // Mulai quiz baru
  const startQuiz = useCallback(async () => {
    if (quizState.questions.length > 0 && !quizState.isFinished) return;

    if (isFetchingRef.current) return;

    isFetchingRef.current = true; 
    setLoading(true);
    setError(null);

    setQuizState(prev => ({ 
      ...prev, 
      isFinished: false, 
      score: 0, 
      answers: [],
      currentIndex: 0 
    }));

    try {
      await fetchQuestions();
    } catch {
      console.warn("Retrying fetch...");
      setTimeout(async () => {
        try {
          await fetchQuestions();
        } catch {
          setError("Gagal mengambil soal. Cek koneksi internetmu.");
          setLoading(false);
          isFetchingRef.current = false;
        }
      }, 2000);
    }
  }, [quizState.questions.length, quizState.isFinished, fetchQuestions]);

  // Submit jawaban user untuk pertanyaan saat ini
  const answerQuestion = (selectedOption) => {
    const currentQ = quizState.questions[quizState.currentIndex];
    const isCorrect = selectedOption === currentQ.correct_answer;

    setQuizState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      const isEnd = nextIndex >= prev.questions.length;

      return {
        ...prev,
        score: isCorrect ? prev.score + 1 : prev.score,
        answers: [...prev.answers, { 
            question: currentQ.question, 
            selected: selectedOption, 
            correct: currentQ.correct_answer, 
            isCorrect 
        }],
        currentIndex: nextIndex,
        isFinished: isEnd,
        status: isEnd ? 'finished' : 'playing',
      };
    });
  };

  // Login user — menerima object { name, email?, picture?, googleId? }
  // atau string nama saja (backward compatible dengan form manual)
  const login = (userDataOrName) => {
    const userData = typeof userDataOrName === 'string'
      ? { name: userDataOrName }
      : userDataOrName;
    setUser(userData);
    localStorage.setItem("quizUser", JSON.stringify(userData));
  };

  // Simpan skor ke backend + riwayat lokal
  const saveScore = useCallback(async (scoreData) => {
    const { answers, questions, ...backendScoreData } = scoreData;
    const playedAt = new Date().toISOString();

    // Simpan ke localStorage history
    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    history.unshift({ ...scoreData, playedAt });
    localStorage.setItem('quizHistory', JSON.stringify(history.slice(0, 50))); // max 50

    // Simpan ke reviews cache di localStorage
    const reviews = JSON.parse(localStorage.getItem('quizReviews') || '{}');
    reviews[playedAt] = { answers, questions, score: scoreData.score };
    // Batasi ukuran reviews cache (maksimal 50)
    const reviewKeys = Object.keys(reviews).sort().reverse();
    if (reviewKeys.length > 50) {
      const keysToDelete = reviewKeys.slice(50);
      keysToDelete.forEach(k => delete reviews[k]);
    }
    localStorage.setItem('quizReviews', JSON.stringify(reviews));

    // Kirim ke backend (tidak blokir jika gagal)
    try {
      await submitScore({ ...backendScoreData, playedAt });
    } catch (err) {
      console.warn('Gagal submit skor ke backend:', err.message);
    }
  }, []);

  // Logout user dan reset state
  const logout = () => {
    setUser(null);
    setQuizState({ 
        questions: [], 
        currentIndex: 0, 
        score: 0, 
        answers: [], 
        timeLeft: QUIZ_DURATION, 
        endTime: null,
        isFinished: false, 
        status: 'idle' 
    });
    localStorage.removeItem("quizUser");
    localStorage.removeItem("quizState");
    isFetchingRef.current = false; 
  };

  // Provide semua nilai ke context
  return (
    <QuizContext.Provider value={{ user, quizState, loading, error, login, logout, startQuiz, answerQuestion, saveScore }}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook untuk akses quiz context
export const useQuiz = () => useContext(QuizContext);