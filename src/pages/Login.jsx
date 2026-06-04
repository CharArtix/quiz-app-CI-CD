import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext";
import { BrainCircuit, Zap, AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../services/authService";
import useDocumentTitle from "../hooks/useDocumentTitle";
// test
export default function Login() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const { login, user } = useQuiz();
  const navigate = useNavigate();

  useDocumentTitle("Login | DOT Quiz Challenge");

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user, navigate]);

  // Callback sukses dari Google OAuth
  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    setGoogleError("");
    try {
      const userData = await loginWithGoogle(credentialResponse.credential);
      login(userData);
      navigate("/profile");
    } catch (err) {
      console.error("Google login error:", err);
      setGoogleError("Login dengan Google gagal. Token tidak valid.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* --- BAGIAN KIRI (HERO) --- */}
      <div className="relative hidden lg:flex w-1/2 xl:w-7/12 flex-col justify-between bg-emerald-950 px-16 py-20 text-white overflow-hidden">
        <div className="absolute top-0 right-0 h-150 w-150 translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-500/20 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 h-125 w-125 -translate-x-1/4 translate-y-1/4 rounded-full bg-teal-600/20 blur-[100px]"></div>
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30">
            <BrainCircuit className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">DOT Quiz</span>
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-800/30 px-4 py-2 text-sm font-medium backdrop-blur-md text-emerald-100">
            <Zap size={16} className="fill-yellow-400 text-yellow-400" />
            <span>Platform Kuis #1 untuk Developer</span>
          </div>

          <h1 className="font-sans text-5xl font-extrabold leading-[1.1] tracking-tight xl:text-7xl">
            Asah <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-teal-300">Logika</span> & <br />
            Wawasanmu.
          </h1>

          <p className="mt-8 max-w-lg text-lg text-gray-300 leading-relaxed">
            Bergabunglah dengan ribuan peserta lainnya. Uji pengetahuanmu dalam berbagai topik menarik dengan antarmuka yang cepat dan modern.
          </p>
        </div>

        <div className="relative z-10 text-sm text-emerald-200/60 font-medium">
          &copy; 2026 DOT Quiz App. Designed for Performance.
        </div>
      </div>

      {/* --- BAGIAN KANAN (FORM LOGIN) --- */}
      <div className="flex w-full flex-col justify-center items-center bg-gray-50 px-6 py-12 lg:w-1/2 xl:w-5/12 lg:bg-white lg:px-20">

        <div className="w-full max-w-105 animate-fade-in">
          {/* Header Mobile Only */}
          <div className="mb-10 flex justify-center lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 shadow-xl shadow-emerald-200">
              <BrainCircuit className="text-white" size={32} />
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Selamat Datang</h2>
            <p className="mt-3 text-gray-500">
              Masuk untuk mulai mengerjakan kuis.
            </p>
          </div>

          {/* === GOOGLE LOGIN BUTTON === */}
          <div className="space-y-4">
            {googleError && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{googleError}</span>
              </div>
            )}

            <div className={`w-full transition-opacity ${googleLoading ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex justify-center [&>div]:w-full [&_iframe]:w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setGoogleError("Login dengan Google dibatalkan atau gagal.")}
                  width="100%"
                  size="large"
                  shape="rectangular"
                  theme="outline"
                  text="continue_with"
                  locale="id"
                />
              </div>
            </div>

            {googleLoading && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="animate-spin h-4 w-4 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Memverifikasi akun Google...</span>
              </div>
            )}
          </div>

          {/* Footer Mobile */}
          <p className="mt-10 text-center text-xs text-gray-400 lg:hidden">
            Secure &amp; Fast Quiz Platform
          </p>
        </div>
      </div>

    </div>
  );
}