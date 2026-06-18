import '@testing-library/jest-dom';

// Suppress React 19 act() warnings yang muncul dari async state updates di luar act wrapper.
// Warning ini bukan indikasi test gagal — semua assertions tetap valid.
const originalError = console.error.bind(console.error);
beforeAll(() => {
  console.error = (msg, ...args) => {
    if (
      typeof msg === 'string' &&
      msg.includes('not configured to support act')
    ) return;
    originalError(msg, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
