module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  // Inject import.meta.env sebelum test berjalan
  setupFiles: ['<rootDir>/src/__tests__/setupEnv.cjs'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__tests__/__mocks__/fileMock.cjs',
  },
  testMatch: [
    '**/__tests__/**/*.test.(js|jsx)',
    '**/?(*.)+(spec|test).(js|jsx)'
  ],

  // --- Coverage Configuration ---
  collectCoverage: false, // aktif hanya saat --coverage flag
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',           // entry point, tidak perlu di-cover
    '!src/**/__tests__/**',    // exclude folder test itu sendiri
    '!src/**/__mocks__/**',    // exclude mock files
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
