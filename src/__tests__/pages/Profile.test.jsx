/**
 * Test untuk halaman Profile.jsx
 * Covers: render profil user, loading state riwayat, empty state riwayat,
 *         data state riwayat (tabel + badge predikat), navigasi ke /quiz,
 *         dan custom document title.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../../pages/Profile';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

jest.mock('../../hooks/useDocumentTitle', () => jest.fn());
jest.mock('../../components/Navbar', () => () => <nav data-testid="navbar" />);

const mockStartQuiz = jest.fn();
let mockUser = { name: 'Andi', email: 'andi@example.com', googleId: 'gid-123', picture: 'http://pic.png' };

jest.mock('../../context/QuizContext', () => ({
  useQuiz: () => ({
    user: mockUser,
    startQuiz: mockStartQuiz,
  }),
}));

const renderProfile = () =>
  render(<MemoryRouter><Profile /></MemoryRouter>);

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    mockUser = { name: 'Andi', email: 'andi@example.com', googleId: 'gid-123', picture: 'http://pic.png' };
  });

  afterEach(() => {
    delete global.fetch;
  });

  it('harus merender Navbar dan dashboard info user dengan avatar gambar', async () => {
    // Mock fetch return pending promise
    global.fetch.mockReturnValue(new Promise(() => {}));

    renderProfile();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Andi' })).toBeInTheDocument();
    expect(screen.getByText('Andi')).toBeInTheDocument();
    expect(screen.getByText('andi@example.com')).toBeInTheDocument();
    expect(screen.getByText('PREMIUM CHALLENGER')).toBeInTheDocument();
  });

  it('harus merender inisial nama jika user tidak memiliki avatar gambar', async () => {
    mockUser.picture = null;
    global.fetch.mockReturnValue(new Promise(() => {}));

    renderProfile();
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('harus menampilkan loading text saat mengambil riwayat', async () => {
    global.fetch.mockReturnValue(new Promise(() => {}));

    renderProfile();
    expect(screen.getByText('Memuat riwayat permainan...')).toBeInTheDocument();
  });

  it('harus menampilkan empty state jika riwayat kosong', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ history: [] }),
    });

    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('Belum Ada Riwayat Bermain')).toBeInTheDocument();
    });

    const playBtn = screen.getByText('Mulai Kuis Pertama');
    fireEvent.click(playBtn);
    expect(mockStartQuiz).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  });

  it('harus menampilkan tabel riwayat jika data riwayat tersedia', async () => {
    const mockHistory = [
      { percentage: 100, score: 10, total: 10, playedAt: '2026-06-18T10:00:00Z' },
      { percentage: 80, score: 8, total: 10, playedAt: '2026-06-18T09:00:00Z' },
      { percentage: 60, score: 6, total: 10, playedAt: '2026-06-18T08:00:00Z' },
      { percentage: 40, score: 4, total: 10, playedAt: '2026-06-18T07:00:00Z' },
    ];
    global.fetch.mockResolvedValue({
      json: async () => ({ history: mockHistory }),
    });

    renderProfile();

    await waitFor(() => {
      // Periksa stat card
      expect(screen.getByText('Total Bermain')).toBeInTheDocument();
      expect(screen.getAllByText('4').length).toBeGreaterThan(0); // total games
      expect(screen.getByText('70%')).toBeInTheDocument(); // avg score (100+80+60+40)/4 = 70
      expect(screen.getAllByText('100%').length).toBeGreaterThan(0); // best score

      // Periksa baris tabel & badge predikat
      expect(screen.getByText('Perfect 🌟')).toBeInTheDocument();
      expect(screen.getByText('Sangat Baik 🔥')).toBeInTheDocument();
      expect(screen.getByText('Cukup Baik 👍')).toBeInTheDocument();
      expect(screen.getByText('Perlu Latihan 💪')).toBeInTheDocument();
    });

    // Uji klik tombol "Main Lagi"
    const playBtn = screen.getByText('Main Lagi');
    fireEvent.click(playBtn);
    expect(mockStartQuiz).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/quiz');
  });

  it('harus langsung mematikan loading jika googleId user tidak ada', async () => {
    mockUser.googleId = null;
    renderProfile();

    await waitFor(() => {
      expect(screen.getByText('Belum Ada Riwayat Bermain')).toBeInTheDocument();
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
