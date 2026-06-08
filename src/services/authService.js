import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

/**
 * Kirim Google credential token ke backend untuk diverifikasi.
 * @param {string} credential - Google ID Token dari GoogleLogin callback
 * @returns {Promise<{googleId, name, email, picture}>} data user dari Google
 */
export const loginWithGoogle = async (credential) => {
  const response = await axios.post(`${API_URL}/api/auth/google`, { credential })
  return response.data.user
}
