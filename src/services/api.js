import axios from "axios";
import { TOTAL_QUESTIONS } from "../utils/constants";

// API endpoint Open Trivia Database
const API_URL = "https://opentdb.com/api.php";

// Fetch pertanyaan dari API eksternal
export const getQuestions = async () => {
  try {
    // Request ke OpenTDB dengan parameter
    const response = await axios.get(API_URL, {
      params: {
        amount: TOTAL_QUESTIONS,  // Jumlah soal
        type: "multiple",          // Tipe pilihan ganda
      },
    });

    // Validasi response (0 = berhasil)
    if (response.data.response_code !== 0) {
      throw new Error("Gagal mengambil soal dari server (API Limit/Error).");
    }

    return response.data.results;
  } catch (error) {
    // Log error dan lempar ke component
    console.error("API Service Error:", error);
    throw error;
  }
};

// API endpoint Custom Backend
const BACKEND_URL = "http://localhost:5000/api/scores";

export const saveUserScore = async (username, score, totalQuestions) => {
  try {
    const response = await axios.post(BACKEND_URL, {
      username,
      score,
      totalQuestions,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to save score:", error);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/leaderboard`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get leaderboard:", error);
    throw error;
  }
};