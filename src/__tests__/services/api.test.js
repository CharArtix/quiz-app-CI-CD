/**
 * Test untuk services/api.js (getQuestions dari OpenTDB)
 */
import axios from 'axios';
import { getQuestions } from '../../services/api';

jest.mock('axios');

const MOCK_RESULTS = [
  {
    question: 'Ibu kota Indonesia?',
    correct_answer: 'Jakarta',
    incorrect_answers: ['Surabaya', 'Bandung', 'Medan'],
  },
  {
    question: 'Planet terbesar?',
    correct_answer: 'Jupiter',
    incorrect_answers: ['Mars', 'Venus', 'Saturnus'],
  },
];

describe('api - getQuestions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('harus mengembalikan array soal jika response_code = 0', async () => {
    axios.get.mockResolvedValueOnce({
      data: { response_code: 0, results: MOCK_RESULTS },
    });

    const result = await getQuestions();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(MOCK_RESULTS);
    expect(result).toHaveLength(2);
  });

  it('harus meneruskan params amount dan type=multiple ke OpenTDB', async () => {
    axios.get.mockResolvedValueOnce({
      data: { response_code: 0, results: MOCK_RESULTS },
    });

    await getQuestions();

    expect(axios.get).toHaveBeenCalledWith(
      'https://opentdb.com/api.php',
      expect.objectContaining({
        params: expect.objectContaining({ type: 'multiple' }),
      })
    );
  });

  it('harus melempar error jika response_code bukan 0', async () => {
    axios.get.mockResolvedValueOnce({
      data: { response_code: 1, results: [] },
    });

    await expect(getQuestions()).rejects.toThrow(
      'Gagal mengambil soal dari server (API Limit/Error).'
    );
  });

  it('harus melempar error jika request jaringan gagal', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    await expect(getQuestions()).rejects.toThrow('Network Error');
  });
});
