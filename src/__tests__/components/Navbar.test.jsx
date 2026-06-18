import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

// ── Mock react-router-dom hooks ───────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// ── Mock QuizContext ──────────────────────────────────────────────────────────
const mockLogout = jest.fn();
jest.mock('../../context/QuizContext', () => ({
  useQuiz: () => ({
    user: { name: 'Budi', email: 'budi@test.com', picture: null },
    logout: mockLogout,
  }),
}));

// ── Helper render ─────────────────────────────────────────────────────────────
const renderNavbar = (route = '/quiz') =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <Navbar />
    </MemoryRouter>
  );

describe('Navbar Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogout.mockClear();
    // Reset window.confirm ke implementasi default (mengembalikan true)
    window.confirm = jest.fn(() => true);
  });

  it('harus merender logo DOT Quiz', () => {
    renderNavbar();
    expect(screen.getByText('DOT Quiz')).toBeInTheDocument();
  });

  it('harus merender link navigasi Main Kuis dan Scoreboard', () => {
    renderNavbar();
    expect(screen.getByText('Main Kuis')).toBeInTheDocument();
    expect(screen.getAllByText('Scoreboard').length).toBeGreaterThan(0);
  });

  it('harus menampilkan inisial nama user di avatar ketika tidak ada foto', () => {
    renderNavbar();
    expect(screen.getByText('B')).toBeInTheDocument(); // 'Budi'.charAt(0)
  });

  it('harus membuka dropdown saat tombol user diklik', () => {
    renderNavbar();
    // Dropdown belum tampil
    expect(screen.queryByText('Profil Saya')).not.toBeInTheDocument();

    // Klik tombol user
    const dropdownBtn = screen.getByRole('button', { name: /budi/i });
    fireEvent.click(dropdownBtn);

    // Dropdown tampil
    expect(screen.getByText('Profil Saya')).toBeInTheDocument();
    expect(screen.getByText('Keluar')).toBeInTheDocument();
  });

  it('harus menampilkan nama dan email di dalam dropdown', () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /budi/i }));

    // Nama dan email muncul di dalam dropdown
    const allBudi = screen.getAllByText('Budi');
    expect(allBudi.length).toBeGreaterThan(0);
    expect(screen.getByText('budi@test.com')).toBeInTheDocument();
  });

  it('harus memanggil logout dan navigate("/") saat konfirmasi Keluar disetujui', () => {
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /budi/i }));
    fireEvent.click(screen.getByText('Keluar'));

    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('tidak boleh logout jika konfirmasi Keluar dibatalkan', () => {
    window.confirm = jest.fn(() => false);
    renderNavbar();
    fireEvent.click(screen.getByRole('button', { name: /budi/i }));
    fireEvent.click(screen.getByText('Keluar'));

    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
