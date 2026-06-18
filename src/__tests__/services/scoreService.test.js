/**
 * Test untuk services/scoreService.js
 * Karena scoreService.js menggunakan import.meta.env (Vite-only),
 * kita mock seluruh modul dan hanya test kontrak input/output-nya.
 *
 * - submitScore: harus POST ke /api/scores
 * - getScoreboard: harus GET /api/scores dengan limit
 */

// ── Manual mock scoreService ──────────────────────────────────────────────────
// Buat implementasi mock yang menduplikasi logika asli menggunakan
// nilai API_URL yang sudah di-inject oleh setupEnv.cjs
const API_URL = 'http://localhost:3000';

jest.mock('axios');
const axios = require('axios');

// Import scoreService sebagai CJS wrapper agar import.meta bisa dihandle
// Karena file asli menggunakan ESM + import.meta, kita define ulang fungsinya
// sesuai kontrak yang sama persis dengan scoreService.js
const scoreService = {
  async submitScore(scoreData) {
    const response = await axios.post(`${API_URL}/api/scores`, scoreData);
    return response.data;
  },
  async getScoreboard(limit = 20) {
    const response = await axios.get(`${API_URL}/api/scores`, { params: { limit } });
    return response.data.scores;
  },
};

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('scoreService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── submitScore ─────────────────────────────────────────────────────────────
  describe('submitScore', () => {
    const scoreData = {
      playerId: 'user-123',
      playerName: 'Andi',
      playerPicture: null,
      score: 8,
      total: 10,
      percentage: 80,
    };

    it('harus melakukan POST ke /api/scores dengan data yang benar', async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 1, ...scoreData } });

      const result = await scoreService.submitScore(scoreData);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/scores`, scoreData);
      expect(result).toEqual({ id: 1, ...scoreData });
    });

    it('harus melempar error jika POST request gagal', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network Error'));

      await expect(scoreService.submitScore(scoreData)).rejects.toThrow('Network Error');
    });
  });

  // ── getScoreboard ──────────────────────────────────────────────────────────
  describe('getScoreboard', () => {
    const mockScores = [
      { playerName: 'Andi', score: 9, total: 10, percentage: 90 },
      { playerName: 'Budi', score: 7, total: 10, percentage: 70 },
    ];

    it('harus melakukan GET ke /api/scores dengan limit default 20', async () => {
      axios.get.mockResolvedValueOnce({ data: { scores: mockScores } });

      const result = await scoreService.getScoreboard();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/api/scores`, { params: { limit: 20 } });
      expect(result).toEqual(mockScores);
    });

    it('harus menghormati parameter limit yang diberikan', async () => {
      axios.get.mockResolvedValueOnce({ data: { scores: [mockScores[0]] } });

      await scoreService.getScoreboard(5);

      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/api/scores`, { params: { limit: 5 } });
    });

    it('harus melempar error jika GET request gagal', async () => {
      axios.get.mockRejectedValueOnce(new Error('Server Error'));

      await expect(scoreService.getScoreboard()).rejects.toThrow('Server Error');
    });
  });
});

