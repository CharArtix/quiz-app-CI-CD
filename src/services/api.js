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