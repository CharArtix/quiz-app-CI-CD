/**
 * Test untuk halaman Quiz.jsx
 * Covers: loading state, error state, quiz playing state (dengan soal),
 *         quiz selesai (navigate ke /result), dan tampilan timer.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Quiz from '../../pages/Quiz';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../hooks/useDocumentTitle', () => jest.fn());
jest.mock('../../components/QuestionCard', () => ({ data, onAnswer, currentIndex, totalQuestions }) => (
  <div data-testid="question-card">
    <p>{data.question}</p>
    <p data-testid="q-progress">Pertanyaan {currentIndex + 1} dari {totalQuestions}</p>
    <button onClick={() => onAnswer('A')}>Jawab A</button>
  </div>
));

const mockStartQuiz = jest.fn();
const mockAnswerQuestion = jest.fn();

// State quiz bisa dikonfigurasi per test
let mockQuizState = {};
let mockLoading = false;
let mockError = null;

jest.mock('../../context/QuizContext', () => ({
  useQuiz: () => ({
    user: { name: 'Andi' },
    quizState: mockQuizState,
    startQuiz: mockStartQuiz,
    answerQuestion: mockAnswerQuestion,
    loading: mockLoading,
    error: mockError,
  }),
}));

const renderQuiz = () =>
  render(<MemoryRouter><Quiz /></MemoryRouter>);

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Quiz Page - loading state', () => {
  beforeEach(() => {
    mockLoading = true;
    mockError = null;
    mockQuizState = { questions: [], currentIndex: 0, isFinished: false, status: 'playing', timeLeft: 30 };
    mockNavigate.mockClear();
    mockStartQuiz.mockClear();
  });

  it('harus menampilkan loading spinner saat pertanyaan dimuat', () => {
    renderQuiz();
    expect(screen.getByText('Menyiapkan pertanyaan...')).toBeInTheDocument();
  });
});

describe('Quiz Page - error state', () => {
  beforeEach(() => {
    mockLoading = false;
    mockError = 'Gagal mengambil soal. Cek koneksi internetmu.';
    mockQuizState = { questions: [], currentIndex: 0, isFinished: false, status: 'idle', timeLeft: 30 };
    mockNavigate.mockClear();
    mockStartQuiz.mockClear();
  });

  it('harus menampilkan pesan error saat API gagal', () => {
    renderQuiz();
    expect(screen.getByText('Terjadi Kesalahan')).toBeInTheDocument();
    expect(screen.getByText('Gagal mengambil soal. Cek koneksi internetmu.')).toBeInTheDocument();
  });

  it('harus menyediakan tombol "Coba Lagi" yang me-reload halaman', () => {
    const reloadMock = jest.fn();
    window.reloadPage = reloadMock;

    renderQuiz();
    fireEvent.click(screen.getByText('Coba Lagi'));
    expect(reloadMock).toHaveBeenCalledTimes(1);

    delete window.reloadPage;
  });
});

describe('Quiz Page - playing state', () => {
  const MOCK_QUESTIONS = [
    { question: 'Ibu kota Indonesia?', correct_answer: 'Jakarta', options: ['Jakarta', 'Surabaya'] },
    { question: 'Planet terbesar?', correct_answer: 'Jupiter', options: ['Jupiter', 'Mars'] },
  ];

  beforeEach(() => {
    mockLoading = false;
    mockError = null;
    mockQuizState = {
      questions: MOCK_QUESTIONS,
      currentIndex: 0,
      isFinished: false,
      status: 'playing',
      timeLeft: 25,
    };
    mockNavigate.mockClear();
    mockStartQuiz.mockClear();
    mockAnswerQuestion.mockClear();
  });

  it('harus merender QuestionCard dengan pertanyaan aktif', () => {
    renderQuiz();
    expect(screen.getByTestId('question-card')).toBeInTheDocument();
    expect(screen.getByText('Ibu kota Indonesia?')).toBeInTheDocument();
  });

  it('harus menampilkan nama user di header', () => {
    renderQuiz();
    expect(screen.getByText('Andi')).toBeInTheDocument();
  });

  it('harus menampilkan timer sisa waktu', () => {
    renderQuiz();
    expect(screen.getByText('25s')).toBeInTheDocument();
  });

  it('harus menampilkan timer merah (animate-pulse) saat waktu <= 10 detik', () => {
    mockQuizState = { ...mockQuizState, timeLeft: 8 };
    renderQuiz();
    expect(screen.getByText('8s')).toBeInTheDocument();
  });

  it('harus memanggil answerQuestion saat opsi dijawab', () => {
    renderQuiz();
    fireEvent.click(screen.getByText('Jawab A'));
    expect(mockAnswerQuestion).toHaveBeenCalledWith('A');
  });
});

describe('Quiz Page - quiz selesai', () => {
  beforeEach(() => {
    mockLoading = false;
    mockError = null;
    mockQuizState = {
      questions: [{ question: 'Q1', correct_answer: 'A', options: ['A', 'B'] }],
      currentIndex: 1,
      isFinished: true,
      status: 'finished',
      timeLeft: 0,
    };
    mockNavigate.mockClear();
  });

  it('harus navigate ke /result saat quiz selesai', async () => {
    renderQuiz();
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/result');
    });
  });
});

describe('Quiz Page - auto startQuiz saat idle', () => {
  beforeEach(() => {
    mockLoading = true;
    mockError = null;
    mockQuizState = {
      questions: [],
      currentIndex: 0,
      isFinished: false,
      status: 'idle',
      timeLeft: 30,
    };
    mockStartQuiz.mockClear();
    mockNavigate.mockClear();
  });

  it('harus memanggil startQuiz saat status idle dan user ada', () => {
    renderQuiz();
    expect(mockStartQuiz).toHaveBeenCalledTimes(1);
  });
});
