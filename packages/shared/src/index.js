/**
 * @quiz-app/shared
 * Kode bersama yang digunakan oleh frontend dan backend
 */

// === KONSTANTA ===
export const API_VERSION = 'v1'

export const QUIZ_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
}

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
}

// === HELPER FUNCTIONS ===

/**
 * Menghitung skor berdasarkan jawaban benar dan total soal
 * @param {number} correct - jumlah jawaban benar
 * @param {number} total - total soal
 * @returns {number} skor dalam persen
 */
export function calculateScore(correct, total) {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

/**
 * Format waktu dari detik ke string mm:ss
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}
