/**
 * Test untuk halaman Result.jsx
 * Covers: tampilan statistik, semua skor tier, handlePlayAgain,
 * navigasi ke /review dan /scoreboard, serta auto-submit skor.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Result from '../../pages/Result';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../hooks/useDocumentTitle', () => jest.fn());
jest.mock('../../components/Navbar', () => () => <nav data-testid="navbar" />);

const mockStartQuiz = jest.fn();
const mockSaveScore = jest.fn().mockResolvedValue({});

// Variabel yang dapat diubah per-test agar grade tier bisa dites tanpa resetModules
let mockScore = 8;
let mockTotal = 10;

jest.mock('../../context/QuizContext', () => ({
  useQuiz: () => ({
    user: { name: 'Andi', googleId: 'gid-1' },
    quizState: {
      isFinished: true,
      score: mockScore,
      questions: Array(mockTotal).fill({ question: 'Q?', correct_answer: 'A', options: ['A'] }),
      answers: Array(mockTotal).fill({ isCorrect: true }),
    },
    startQuiz: mockStartQuiz,
    saveScore: mockSaveScore,
  }),
}));

const renderResult = () =>
  render(
    <MemoryRouter>
      <Result />
    </MemoryRouter>
  );

// ── Skor 80% ──────────────────────────────────────────────────────────────────
describe('Result Page - skor 80%', () => {
  beforeEach(() => {
    mockScore = 8;
    mockTotal = 10;
    mockNavigate.mockClear();
    mockStartQuiz.mockClear();
    mockSaveScore.mockClear();
  });

  it('harus merender Navbar', () => {
    renderResult();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('harus menampilkan persentase skor yang benar (80%)', () => {
    renderResult();
    expect(screen.getByText('80%')).toBeInTheDocument();
  });

  it('harus menampilkan label "Sangat Bagus!" untuk skor >= 80%', () => {
    renderResult();
    expect(screen.getByText('Sangat Bagus!')).toBeInTheDocument();
  });

  it('harus memanggil saveScore saat pertama kali mount', async () => {
    renderResult();
    await waitFor(() => {
      expect(mockSaveScore).toHaveBeenCalledTimes(1);
    });
    expect(mockSaveScore).toHaveBeenCalledWith(
      expect.objectContaining({ playerName: 'Andi', score: 8, total: 10 })
    );
  });

  it('tombol "Main Lagi" harus memanggil startQuiz dan navigate ke /quiz', () => {
    renderResult();
    fireEvent.click(screen.getByText('Main Lagi'));
    expect(mockStartQuiz).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  });

  it('harus merender link "Lihat Review Jawaban" ke /review', () => {
    renderResult();
    const reviewLink = screen.getByText('Lihat Review Jawaban');
    expect(reviewLink.closest('a')).toHaveAttribute('href', '/review');
  });

  it('harus merender link Scoreboard ke /scoreboard', () => {
    renderResult();
    const link = screen.getByText('Scoreboard');
    expect(link.closest('a')).toHaveAttribute('href', '/scoreboard');
  });

  it('harus menampilkan nama player', () => {
    renderResult();
    expect(screen.getByText('Andi')).toBeInTheDocument();
  });

  it('harus menampilkan label "Total Score"', () => {
    renderResult();
    expect(screen.getByText('Total Score')).toBeInTheDocument();
  });
});

// ── Variasi grade ─────────────────────────────────────────────────────────────
describe('Result Page - variasi grade', () => {
  afterEach(() => {
    mockScore = 8;
    mockTotal = 10;
  });

  it('skor 100% (10/10) → "Sempurna!"', () => {
    mockScore = 10;
    mockTotal = 10;
    renderResult();
    expect(screen.getByText('Sempurna!')).toBeInTheDocument();
  });

  it('skor 60% (6/10) → "Cukup Baik"', () => {
    mockScore = 6;
    mockTotal = 10;
    renderResult();
    expect(screen.getByText('Cukup Baik')).toBeInTheDocument();
  });

  it('skor 40% (4/10) → "Perlu Latihan"', () => {
    mockScore = 4;
    mockTotal = 10;
    renderResult();
    expect(screen.getByText('Perlu Latihan')).toBeInTheDocument();
  });

  it('skor 0% (0/10) → "Perlu Latihan" dengan 0%', () => {
    mockScore = 0;
    mockTotal = 10;
    renderResult();
    expect(screen.getByText('Perlu Latihan')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
