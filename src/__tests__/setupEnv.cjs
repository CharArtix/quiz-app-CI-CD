// Inject import.meta.env agar bisa digunakan oleh source files di lingkungan Jest (Node/jsdom)
// Ini dijalankan sebelum setupFilesAfterEnv (sebelum jest-dom di-setup)
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_API_URL: 'http://localhost:3000',
        VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
      },
    },
  },
  writable: true,
});

// Diperlukan agar React 19 tahu bahwa test berjalan di lingkungan yang mendukung act()
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Polyfill TextEncoder/TextDecoder — dibutuhkan oleh react-router-dom v7 di jsdom
const { TextEncoder, TextDecoder } = require('util');
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
