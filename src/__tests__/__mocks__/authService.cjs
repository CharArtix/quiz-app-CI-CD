// Jest-compatible CJS shim untuk authService.js
// File ini menggantikan src/services/authService.js saat test berjalan
// menggunakan process.env yang sudah di-set di setupEnv.cjs

const axios = require('axios');
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Kirim Google credential token ke backend untuk diverifikasi.
 * @param {string} credential - Google ID Token dari GoogleLogin callback
 * @returns {Promise<{googleId, name, email, picture}>} data user dari Google
 */
const loginWithGoogle = async (credential) => {
  const response = await axios.post(`${API_URL}/api/auth/google`, { credential });
  return response.data.user;
};

module.exports = { loginWithGoogle };
