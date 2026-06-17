import axios from "axios";
import { getQuestions } from "../../services/api";
import { TOTAL_QUESTIONS } from "../../utils/constants";

jest.mock("axios");

describe("API Service - getQuestions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("harus mengembalikan daftar pertanyaan saat request sukses", async () => {
    const mockData = {
      data: {
        response_code: 0,
        results: [
          { question: "Q1", correct_answer: "A1", incorrect_answers: ["B1", "C1"] }
        ],
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    const questions = await getQuestions();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("https://opentdb.com/api.php", {
      params: {
        amount: TOTAL_QUESTIONS,
        type: "multiple",
      },
    });
    expect(questions).toEqual(mockData.data.results);
  });

  it("harus melempar error saat response_code bukan 0", async () => {
    const mockData = {
      data: {
        response_code: 1,
        results: [],
      },
    };
    axios.get.mockResolvedValueOnce(mockData);

    await expect(getQuestions()).rejects.toThrow("Gagal mengambil soal dari server (API Limit/Error).");
  });

  it("harus melempar error saat request gagal (network error)", async () => {
    const networkError = new Error("Network Error");
    axios.get.mockRejectedValueOnce(networkError);

    await expect(getQuestions()).rejects.toThrow("Network Error");
  });
});
