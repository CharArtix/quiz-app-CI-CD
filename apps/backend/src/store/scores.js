/**
 * In-memory score store
 * Data akan reset ketika server restart.
 * Bisa diupgrade ke database (SQLite/MongoDB) nanti.
 */

/** @type {Array<{playerId, playerName, playerPicture, score, total, percentage, playedAt}>} */
const scores = []

/**
 * Tambah skor baru. Jika player sudah pernah main,
 * tetap simpan semua riwayat (boleh main berkali-kali).
 */
export function addScore({ playerId, playerName, playerPicture, score, total, percentage }) {
  scores.push({
    playerId: playerId || playerName,
    playerName,
    playerPicture: playerPicture || null,
    score,
    total,
    percentage,
    playedAt: new Date().toISOString(),
  })
}

/**
 * Ambil top scores — diurutkan berdasarkan skor terbaik per player.
 * Hanya tampilkan 1 skor terbaik per player di leaderboard.
 */
export function getTopScores(limit = 20) {
  // Ambil skor terbaik per player
  const bestPerPlayer = new Map()

  for (const entry of scores) {
    const existing = bestPerPlayer.get(entry.playerId)
    if (!existing || entry.percentage > existing.percentage) {
      bestPerPlayer.set(entry.playerId, entry)
    }
  }

  return [...bestPerPlayer.values()]
    .sort((a, b) => b.percentage - a.percentage || new Date(a.playedAt) - new Date(b.playedAt))
    .slice(0, limit)
}

/**
 * Ambil semua riwayat skor seorang player
 */
export function getPlayerHistory(playerId) {
  return scores
    .filter((s) => s.playerId === playerId)
    .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
}
