import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';

// ── Mock QuizContext ──────────────────────────────────────────────────────────
let mockUser = null;
jest.mock('../../context/QuizContext', () => ({
  useQuiz: () => ({ user: mockUser }),
}));

const renderProtected = (user = null) => {
  mockUser = user;
  return render(
    <MemoryRouter initialEntries={['/quiz']}>
      <ProtectedRoute>
        <div data-testid="protected-content">Konten Terlindungi</div>
      </ProtectedRoute>
    </MemoryRouter>
  );
};

describe('ProtectedRoute Component', () => {
  it('harus merender children jika user sudah login', () => {
    renderProtected({ name: 'Andi', email: 'andi@test.com' });
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Konten Terlindungi')).toBeInTheDocument();
  });

  it('harus me-redirect ke "/" jika user belum login (null)', () => {
    renderProtected(null);
    // Children tidak dirender
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
