/**
 * Test untuk halaman Login.jsx
 * Covers: render UI, redirect jika user sudah login,
 *         handleGoogleSuccess (berhasil & gagal), onError callback.
 */
import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../hooks/useDocumentTitle', () => jest.fn());

// Mock GoogleLogin: expose onSuccess & onError via data-testid buttons
jest.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <div>
      <button
        data-testid="google-success-btn"
        onClick={() => onSuccess({ credential: 'test-google-token' })}
      >
        Login Google
      </button>
      <button
        data-testid="google-error-btn"
        onClick={() => onError()}
      >
        Trigger Error
      </button>
    </div>
  ),
}));

// Mock authService
const mockLoginWithGoogle = jest.fn();
jest.mock('../../services/authService', () => ({
  loginWithGoogle: (...args) => mockLoginWithGoogle(...args),
}));

const mockLogin = jest.fn();
let mockUser = null;

jest.mock('../../context/QuizContext', () => ({
  useQuiz: () => ({
    login: mockLogin,
    user: mockUser,
  }),
}));

const renderLogin = () =>
  render(<MemoryRouter><Login /></MemoryRouter>);

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Login Page - UI dasar', () => {
  beforeEach(() => {
    mockUser = null;
    mockNavigate.mockClear();
    mockLogin.mockClear();
    mockLoginWithGoogle.mockClear();
  });

  it('harus merender judul "Selamat Datang"', () => {
    renderLogin();
    expect(screen.getByText('Selamat Datang')).toBeInTheDocument();
  });

  it('harus merender tombol Login Google', () => {
    renderLogin();
    expect(screen.getByTestId('google-success-btn')).toBeInTheDocument();
  });

  it('harus merender tagline "DOT Quiz"', () => {
    renderLogin();
    expect(screen.getAllByText('DOT Quiz').length).toBeGreaterThan(0);
  });
});

describe('Login Page - redirect jika sudah login', () => {
  it('harus navigate ke /profile jika user sudah ada', () => {
    mockUser = { name: 'Andi' };
    renderLogin();
    expect(mockNavigate).toHaveBeenCalledWith('/profile');
  });
});

describe('Login Page - handleGoogleSuccess', () => {
  beforeEach(() => {
    mockUser = null;
    mockNavigate.mockClear();
    mockLogin.mockClear();
    mockLoginWithGoogle.mockClear();
  });

  it('harus memanggil loginWithGoogle dan login lalu navigate ke /profile saat berhasil', async () => {
    const userData = { name: 'Andi', googleId: 'gid-1' };
    mockLoginWithGoogle.mockResolvedValueOnce(userData);

    renderLogin();
    await act(async () => {
      screen.getByTestId('google-success-btn').click();
    });

    await waitFor(() => {
      expect(mockLoginWithGoogle).toHaveBeenCalledWith('test-google-token');
      expect(mockLogin).toHaveBeenCalledWith(userData);
      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  it('harus menampilkan pesan error jika loginWithGoogle gagal', async () => {
    mockLoginWithGoogle.mockRejectedValueOnce(new Error('Unauthorized'));

    renderLogin();
    await act(async () => {
      screen.getByTestId('google-success-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByText('Login dengan Google gagal. Token tidak valid.')).toBeInTheDocument();
    });
  });

  it('harus menampilkan pesan error saat onError Google dipanggil', async () => {
    renderLogin();
    await act(async () => {
      screen.getByTestId('google-error-btn').click();
    });
    expect(screen.getByText('Login dengan Google dibatalkan atau gagal.')).toBeInTheDocument();
  });
});
