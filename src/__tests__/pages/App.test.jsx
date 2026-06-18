/**
 * Test untuk App.jsx — verifikasi route definitions
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock semua page agar tidak perlu render keseluruhan tree
jest.mock('../../pages/Login', () => () => <div data-testid="page-login">Login</div>);
jest.mock('../../pages/Quiz', () => () => <div data-testid="page-quiz">Quiz</div>);
jest.mock('../../pages/Result', () => () => <div data-testid="page-result">Result</div>);
jest.mock('../../pages/QuizReview', () => () => <div data-testid="page-review">Review</div>);
jest.mock('../../pages/Profile', () => () => <div data-testid="page-profile">Profile</div>);
jest.mock('../../pages/Scoreboard', () => () => <div data-testid="page-scoreboard">Scoreboard</div>);
jest.mock('../../components/ProtectedRoute', () => ({ children }) => <>{children}</>);

import App from '../../App';

describe('App routing', () => {
  it('route "/" harus merender Login page', () => {
    render(<App />);
    expect(screen.getByTestId('page-login')).toBeInTheDocument();
  });

  it('App harus merender tanpa crash', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
