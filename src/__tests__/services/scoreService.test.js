/**
 * Test untuk services/scoreService.js
 * Menggunakan import modul asli setelah Babel plugin transform-import-meta
 * menangani import.meta.env sehingga coverage terhitung ke source file.
 */
import axios from 'axios';
import { submitScore, getScoreboard } from '../../services/scoreService';

jest.mock('axios');

const API_URL = 'http://localhost:3000';

describe('scoreService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('submitScore', () => {
    const scoreData = {
      playerId: 'user-123',
      playerName: 'Andi',
      playerPicture: null,
      score: 8,
      total: 10,
      percentage: 80,
    };

    it('harus POST ke /api/scores dengan data yang benar', async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 1, ...scoreData } });
      const result = await submitScore(scoreData);
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/scores`, scoreData);
      expect(result).toEqual({ id: 1, ...scoreData });
    });

    it('harus melempar error jika POST gagal', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network Error'));
      await expect(submitScore(scoreData)).rejects.toThrow('Network Error');
    });
  });

  describe('getScoreboard', () => {
    const mockScores = [
      { playerName: 'Andi', score: 9, total: 10, percentage: 90 },
      { playerName: 'Budi', score: 7, total: 10, percentage: 70 },
    ];

    it('harus GET /api/scores dengan limit default 20', async () => {
      axios.get.mockResolvedValueOnce({ data: { scores: mockScores } });
      const result = await getScoreboard();
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/api/scores`, { params: { limit: 20 } });
      expect(result).toEqual(mockScores);
    });

    it('harus menghormati limit yang diberikan', async () => {
      axios.get.mockResolvedValueOnce({ data: { scores: [mockScores[0]] } });
      await getScoreboard(5);
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/api/scores`, { params: { limit: 5 } });
    });

    it('harus melempar error jika GET gagal', async () => {
      axios.get.mockRejectedValueOnce(new Error('Server Error'));
      await expect(getScoreboard()).rejects.toThrow('Server Error');
    });
  });
});
