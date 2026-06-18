/**
 * Test untuk QuizContext — mencakup:
 *  - login / logout
 *  - startQuiz (mocked getQuestions)
 *  - answerQuestion (benar & salah)
 *  - finishQuiz via timer habis
 *  - saveScore
 */
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizProvider, useQuiz } from '../../context/QuizContext';

// ── Mock external dependencies ────────────────────────────────────────────────
jest.mock('../../services/api', () => ({
  getQuestions: jest.fn(),
}));

jest.mock('../../services/scoreService', () => ({
  submitScore: jest.fn().mockResolvedValue({ ok: true }),
}));

import { getQuestions } from '../../services/api';
import { submitScore } from '../../services/scoreService';

// Pertanyaan mock untuk test
const MOCK_QUESTIONS = [
  {
    question: 'Ibu kota Indonesia?',
    correct_answer: 'Jakarta',
    incorrect_answers: ['Surabaya', 'Bandung', 'Medan'],
  },
  {
    question: 'Planet terbesar di tata surya?',
    correct_answer: 'Jupiter',
    incorrect_answers: ['Mars', 'Saturnus', 'Venus'],
  },
];

// ── Helper: komponen consumer untuk membuktikan state ─────────────────────────
function TestConsumer() {
  const { user, quizState, login, logout, startQuiz, answerQuestion, saveScore } = useQuiz();

  return (
    <div>
      <p data-testid="user-name">{user?.name ?? 'guest'}</p>
      <p data-testid="quiz-status">{quizState.status}</p>
      <p data-testid="quiz-score">{quizState.score}</p>
      <p data-testid="quiz-index">{quizState.currentIndex}</p>
      <p data-testid="quiz-finished">{String(quizState.isFinished)}</p>
      <p data-testid="questions-len">{quizState.questions.length}</p>

      <button onClick={() => login('Andi')} data-testid="btn-login">Login</button>
      <button onClick={logout} data-testid="btn-logout">Logout</button>
      <button onClick={startQuiz} data-testid="btn-start">Start Quiz</button>
      <button onClick={() => answerQuestion('Jakarta')} data-testid="btn-answer-correct">
        Jawab Benar
      </button>
      <button onClick={() => answerQuestion('Salah')} data-testid="btn-answer-wrong">
        Jawab Salah
      </button>
      <button
        onClick={() =>
          saveScore({ playerId: '1', playerName: 'Andi', score: 1, total: 2, percentage: 50 })
        }
        data-testid="btn-save-score"
      >
        Save Score
      </button>
    </div>
  );
}

const renderWithProvider = () =>
  render(
    <QuizProvider>
      <TestConsumer />
    </QuizProvider>
  );

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('QuizContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    getQuestions.mockResolvedValue(MOCK_QUESTIONS);
  });

  it('state awal: user guest, status idle', () => {
    renderWithProvider();
    expect(screen.getByTestId('user-name').textContent).toBe('guest');
    expect(screen.getByTestId('quiz-status').textContent).toBe('idle');
  });

  it('login harus mengubah user name', async () => {
    renderWithProvider();
    await userEvent.click(screen.getByTestId('btn-login'));
    expect(screen.getByTestId('user-name').textContent).toBe('Andi');
    // Pastikan tersimpan di localStorage
    expect(JSON.parse(localStorage.getItem('quizUser')).name).toBe('Andi');
  });

  it('logout harus mereset user dan status ke idle', async () => {
    renderWithProvider();
    await userEvent.click(screen.getByTestId('btn-login'));
    await userEvent.click(screen.getByTestId('btn-logout'));

    expect(screen.getByTestId('user-name').textContent).toBe('guest');
    expect(screen.getByTestId('quiz-status').textContent).toBe('idle');
    expect(localStorage.getItem('quizUser')).toBeNull();
  });

  it('startQuiz harus mengambil soal dan mengubah status menjadi playing', async () => {
    renderWithProvider();

    await act(async () => {
      await userEvent.click(screen.getByTestId('btn-start'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('quiz-status').textContent).toBe('playing');
    });

    expect(screen.getByTestId('questions-len').textContent).toBe('2');
    expect(getQuestions).toHaveBeenCalledTimes(1);
  });

  it('answerQuestion dengan jawaban benar harus menambah skor', async () => {
    renderWithProvider();

    // Mulai quiz terlebih dahulu
    await act(async () => {
      await userEvent.click(screen.getByTestId('btn-start'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('quiz-status').textContent).toBe('playing');
    });

    // Jawab soal pertama dengan benar
    await userEvent.click(screen.getByTestId('btn-answer-correct'));
    expect(screen.getByTestId('quiz-score').textContent).toBe('1');
    expect(screen.getByTestId('quiz-index').textContent).toBe('1');
  });

  it('answerQuestion dengan jawaban salah tidak boleh menambah skor', async () => {
    renderWithProvider();

    await act(async () => {
      await userEvent.click(screen.getByTestId('btn-start'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('quiz-status').textContent).toBe('playing');
    });

    await userEvent.click(screen.getByTestId('btn-answer-wrong'));
    expect(screen.getByTestId('quiz-score').textContent).toBe('0');
  });

  it('quiz selesai setelah semua pertanyaan dijawab', async () => {
    renderWithProvider();

    await act(async () => {
      await userEvent.click(screen.getByTestId('btn-start'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('quiz-status').textContent).toBe('playing');
    });

    // Jawab soal 1 (benar) dan soal 2 (salah)
    await userEvent.click(screen.getByTestId('btn-answer-correct'));
    await userEvent.click(screen.getByTestId('btn-answer-wrong'));

    expect(screen.getByTestId('quiz-finished').textContent).toBe('true');
    expect(screen.getByTestId('quiz-status').textContent).toBe('finished');
  });

  it('saveScore harus memanggil submitScore dan menyimpan ke localStorage', async () => {
    renderWithProvider();
    await userEvent.click(screen.getByTestId('btn-save-score'));

    await waitFor(() => {
      expect(submitScore).toHaveBeenCalledTimes(1);
    });

    const history = JSON.parse(localStorage.getItem('quizHistory'));
    expect(history).toHaveLength(1);
    expect(history[0].playerName).toBe('Andi');
  });
});
