/**
 * Test untuk halaman Scoreboard.jsx
 * Covers: loading state, error state, empty state, data state (tabel + podium),
 *         getRankIcon, getRankRowStyle, getScoreBarColor, handlePlayAgain.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Scoreboard from '../../pages/Scoreboard';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../hooks/useDocumentTitle', () => jest.fn());
jest.mock('../../components/Navbar', () => () => <nav data-testid="navbar" />);

const mockStartQuiz = jest.fn();
jest.mock('../../context/QuizContext', () => ({
  useQuiz: () => ({
    user: { name: 'Andi', googleId: 'gid-1' },
    startQuiz: mockStartQuiz,
  }),
}));

// Konfigurasi mock scoreService
const mockGetScoreboard = jest.fn();
jest.mock('../../services/scoreService', () => ({
  getScoreboard: (...args) => mockGetScoreboard(...args),
}));

const MOCK_SCORES = [
  { playerId: 'gid-1', playerName: 'Andi', playerPicture: null, score: 9, total: 10, percentage: 90, playedAt: '2026-06-01T10:00:00Z' },
  { playerId: 'gid-2', playerName: 'Budi', playerPicture: null, score: 8, total: 10, percentage: 80, playedAt: '2026-06-01T09:00:00Z' },
  { playerId: 'gid-3', playerName: 'Citra', playerPicture: null, score: 7, total: 10, percentage: 70, playedAt: '2026-06-01T08:00:00Z' },
  { playerId: 'gid-4', playerName: 'Dika', playerPicture: null, score: 5, total: 10, percentage: 50, playedAt: '2026-06-01T07:00:00Z' },
];

const renderScoreboard = () =>
  render(<MemoryRouter><Scoreboard /></MemoryRouter>);

beforeEach(() => {
  jest.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Scoreboard Page - loading state', () => {
  beforeEach(() => {
    // Never resolve so loading stays true
    mockGetScoreboard.mockReturnValue(new Promise(() => {}));
    mockNavigate.mockClear();
    mockStartQuiz.mockClear();
  });

  it('harus menampilkan spinner saat memuat', () => {
    renderScoreboard();
    expect(screen.getByText('Memuat scoreboard...')).toBeInTheDocument();
  });
});

describe('Scoreboard Page - error state', () => {
  beforeEach(() => {
    mockGetScoreboard.mockRejectedValue(new Error('Server Error'));
    mockNavigate.mockClear();
    mockStartQuiz.mockClear();
  });

  it('harus menampilkan pesan error jika fetch gagal', async () => {
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByText(/Gagal memuat scoreboard/)).toBeInTheDocument();
    });
  });

  it('harus menyediakan tombol "Coba Lagi" untuk retry', async () => {
    mockGetScoreboard
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue(MOCK_SCORES);

    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByText('Coba Lagi')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Coba Lagi'));
    await waitFor(() => {
      expect(mockGetScoreboard).toHaveBeenCalledTimes(2);
    });
  });
});

describe('Scoreboard Page - empty state', () => {
  beforeEach(() => {
    mockGetScoreboard.mockResolvedValue([]);
    mockNavigate.mockClear();
    mockStartQuiz.mockClear();
  });

  it('harus menampilkan pesan kosong jika tidak ada skor', async () => {
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByText('Belum ada skor yang tercatat.')).toBeInTheDocument();
    });
  });
});

describe('Scoreboard Page - data state', () => {
  beforeEach(() => {
    mockGetScoreboard.mockResolvedValue(MOCK_SCORES);
    mockNavigate.mockClear();
    mockStartQuiz.mockClear();
  });

  it('harus merender Navbar', async () => {
    renderScoreboard();
    await waitFor(() => expect(screen.getByTestId('navbar')).toBeInTheDocument());
  });

  it('harus menampilkan heading "Scoreboard"', async () => {
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Scoreboard' })).toBeInTheDocument();
    });
  });

  it('harus merender nama semua player di tabel', async () => {
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getAllByText('Andi').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Budi').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Citra').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Dika').length).toBeGreaterThan(0);
    });
  });

  it('harus menampilkan badge "Kamu" untuk current user', async () => {
    renderScoreboard();
    await waitFor(() => {
      expect(screen.getByText('Kamu')).toBeInTheDocument();
    });
  });

  it('harus merender podium top 3', async () => {
    renderScoreboard();
    await waitFor(() => {
      // Podium ada karena skor >= 3
      expect(screen.getAllByText('90%').length).toBeGreaterThan(0);
    });
  });

  it('tombol "Main Sekarang" harus memanggil startQuiz dan navigate ke /quiz', async () => {
    renderScoreboard();
    await waitFor(() => screen.getByText('Main Sekarang'));
    fireEvent.click(screen.getByText('Main Sekarang'));
    expect(mockStartQuiz).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  });

  it('tombol "Refresh" harus memanggil fetchScores ulang', async () => {
    mockGetScoreboard.mockResolvedValue(MOCK_SCORES);
    renderScoreboard();
    // Tunggu data pertama selesai dimuat
    await waitFor(() => screen.getByText('Refresh'));
    // Pastikan tombol tidak disabled (loading sudah selesai)
    await waitFor(() => {
      const btn = screen.getByText('Refresh').closest('button');
      expect(btn).not.toBeDisabled();
    });
    fireEvent.click(screen.getByText('Refresh'));
    await waitFor(() => {
      expect(mockGetScoreboard).toHaveBeenCalledTimes(2);
    });
  });

});
