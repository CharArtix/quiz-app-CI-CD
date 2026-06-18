/**
 * Test untuk halaman QuizReview
 * - Menampilkan statistik (skor, dijawab, benar, salah)
 * - Filter tab: semua / benar / salah
 * - Expand/collapse kartu soal
 * - Tombol "Buka Semua" dan "Tutup Semua"
 * - Navigasi ke /result dan /scoreboard
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import QuizReview from '../../pages/QuizReview';

// ── Mock dependencies ─────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../hooks/useDocumentTitle', () => jest.fn());
jest.mock('../../components/Navbar', () => () => <nav data-testid="navbar" />);

// State quiz yang sudah selesai dengan 3 jawaban
const MOCK_QUIZ_STATE = {
  isFinished: true,
  score: 2,
  questions: [
    { question: 'Q1', correct_answer: 'A', options: ['A', 'B', 'C', 'D'] },
    { question: 'Q2', correct_answer: 'B', options: ['A', 'B', 'C', 'D'] },
    { question: 'Q3', correct_answer: 'C', options: ['A', 'B', 'C', 'D'] },
  ],
  answers: [
    { question: 'Q1', selected: 'A', correct: 'A', isCorrect: true },
    { question: 'Q2', selected: 'B', correct: 'B', isCorrect: true },
    { question: 'Q3', selected: 'A', correct: 'C', isCorrect: false },
  ],
};

const mockStartQuiz = jest.fn();
jest.mock('../../context/QuizContext', () => ({
  useQuiz: () => ({
    quizState: MOCK_QUIZ_STATE,
    startQuiz: mockStartQuiz,
  }),
}));

const renderReview = () =>
  render(
    <MemoryRouter>
      <QuizReview />
    </MemoryRouter>
  );

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('QuizReview Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockStartQuiz.mockClear();
  });

  it('harus merender Navbar', () => {
    renderReview();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('harus menampilkan statistik skor yang benar', () => {
    renderReview();
    // Percentage: 2/3 = 67%
    expect(screen.getByText('67%')).toBeInTheDocument();
  });

  it('harus menampilkan jumlah benar dan salah', () => {
    renderReview();
    // score = 2 (benar), wrong = 3 - 2 = 1
    const correctEls = screen.getAllByText('2');
    expect(correctEls.length).toBeGreaterThan(0);
    const wrongEls = screen.getAllByText('1');
    expect(wrongEls.length).toBeGreaterThan(0);
  });

  it('harus menampilkan semua soal pada tab "Semua"', () => {
    renderReview();
    // Default filter = "all" → 3 kartu soal, cek via nomor di dalam kartu (role button area)
    expect(screen.getByText('Semua (3)')).toBeInTheDocument();
    // Q1, Q2, Q3 semuanya muncul
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
  });

  it('filter "Benar" hanya menampilkan soal yang dijawab benar', () => {
    renderReview();
    fireEvent.click(screen.getByText('Benar (2)'));
    // Q1 dan Q2 (isCorrect: true) muncul, Q3 (isCorrect: false) tidak
    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Q2')).toBeInTheDocument();
    expect(screen.queryByText('Q3')).not.toBeInTheDocument();
  });

  it('filter "Salah" hanya menampilkan soal yang dijawab salah', () => {
    renderReview();
    fireEvent.click(screen.getByText('Salah (1)'));
    // Hanya Q3 yang salah
    expect(screen.queryByText('Q1')).not.toBeInTheDocument();
    expect(screen.queryByText('Q2')).not.toBeInTheDocument();
    expect(screen.getByText('Q3')).toBeInTheDocument();
  });

  it('klik kartu soal harus menampilkan detail pertanyaan', () => {
    renderReview();
    // Header kartu soal pertama mengandung teks Q1
    const card = screen.getByText('Q1');
    fireEvent.click(card);
    // Detail "Pertanyaan" muncul
    expect(screen.getByText('Pertanyaan')).toBeInTheDocument();
  });

  it('tombol "Buka Semua" harus menampilkan detail seluruh soal', () => {
    renderReview();
    fireEvent.click(screen.getByText('Buka Semua'));
    // Setelah buka semua, semua label "Pertanyaan" akan muncul (jumlahnya = 3)
    const pertanyaanEls = screen.getAllByText('Pertanyaan');
    expect(pertanyaanEls.length).toBe(3);
  });

  it('tombol "Tutup Semua" harus menyembunyikan detail soal', () => {
    renderReview();
    // Buka semua dulu lalu tutup semua
    fireEvent.click(screen.getByText('Buka Semua'));
    fireEvent.click(screen.getByText('Tutup Semua'));
    expect(screen.queryByText('Pertanyaan')).not.toBeInTheDocument();
  });

  it('tombol "Kembali ke Hasil" harus navigate ke /result', () => {
    renderReview();
    fireEvent.click(screen.getByText('Kembali ke Hasil'));
    expect(mockNavigate).toHaveBeenCalledWith('/result');
  });

  it('tombol "Main Lagi" harus memanggil startQuiz dan navigate ke /quiz', () => {
    renderReview();
    fireEvent.click(screen.getByText('Main Lagi'));
    expect(mockStartQuiz).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  });

  it('tombol "Scoreboard" harus navigate ke /scoreboard', () => {
    renderReview();
    fireEvent.click(screen.getByText('Scoreboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/scoreboard');
  });

  it('harus menggunakan reviewData dari router state jika tersedia, dan tombol kembali mengarah ke /profile', () => {
    const customReviewData = {
      score: 1,
      questions: [
        { question: 'Custom Q1', correct_answer: 'A', options: ['A', 'B'] },
      ],
      answers: [
        { question: 'Custom Q1', selected: 'B', correct: 'A', isCorrect: false },
      ],
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: '/review', state: { reviewData: customReviewData, fromProfile: true } }]}>
        <QuizReview />
      </MemoryRouter>
    );

    expect(screen.getByText('Custom Q1')).toBeInTheDocument();

    const backBtn = screen.getByText('Kembali ke Profil');
    expect(backBtn).toBeInTheDocument();

    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
});
