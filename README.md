# DOT Quiz App 🧠 (Frontend Client)

Aplikasi kuis interaktif berbasis **React 19** dan **Vite**, dikembangkan sebagai solusi *Technical Challenge*. Repositori ini berisi kode **Frontend** yang telah distrukturkan secara mandiri (standalone) di tingkat root dan terintegrasi secara penuh dengan API backend eksternal yang dideploy ke Azure.

---

## ✨ Fitur Utama

- 🔑 **Google OAuth Login Only:** Sistem autentikasi aman menggunakan Google Login Button tanpa opsi masuk tamu (Guest).
- 🌐 **Deployed Backend Integration:** Terhubung langsung ke API server eksternal untuk verifikasi akun dan sinkronisasi skor.
- 🏆 **Global Leaderboard:** Menampilkan peringkat 20 pemain teratas secara real-time yang bersumber dari database MongoDB Atlas via backend server.
- ⏱️ **Global Timer:** Timer hitung mundur terpusat untuk kuis (default: 60 detik). Kuis otomatis selesai dan tersimpan jika waktu habis.
- 💾 **Resume Progress Mechanism:** Menggunakan `localStorage` untuk menyimpan state kuis (posisi soal, jawaban, sisa waktu). Jika browser direfresh atau ditutup secara tidak sengaja, progres kuis dapat dilanjutkan.
- 🎨 **Premium Responsive UI:** Menggunakan Tailwind CSS v4 untuk tampilan yang estetik, modern, dan sangat responsif (Mobile-First).

---

## 🛠️ Tech Stack

- **Core:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Package Manager:** npm

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Clone Repository
Langkah pertama adalah menduplikasi repositori ini ke komputer lokal Anda:
```bash
git clone https://github.com/firmansyahadip25/quiz-app-frontend.git
cd quiz-app-frontend
```

### 2. Menyambung & Mengatur Remote Repository
Jika Anda ingin menyambungkan folder lokal ini ke repositori Git Anda sendiri (misalnya di GitHub atau GitLab):

- **Periksa remote repository saat ini:**
  ```bash
  git remote -v
  ```
- **Mengubah alamat remote repository (jika sudah ada):**
  ```bash
  git remote set-url origin https://github.com/firmansyahadip25/quiz-app-frontend.git
  ```
- **Menambahkan remote repository baru (jika belum ada `origin`):**
  ```bash
  git remote add origin https://github.com/firmansyahadip25/quiz-app-frontend.git
  ```
- **Lakukan push pertama kali ke branch utama:**
  ```bash
  git push -u origin main
  ```

---

## ⚙️ Konfigurasi Environment Variable (`.env`)

Sebelum menjalankan aplikasi, Anda wajib membuat file `.env` di root direktori untuk menyimpan konfigurasi Google OAuth dan API backend.

1. Duplikat file `.env.example`:
   ```bash
   cp .env.example .env
   ```
2. Buka file `.env` dan sesuaikan nilainya:
   ```ini
   # Client ID Google OAuth Anda untuk autentikasi login
   VITE_GOOGLE_CLIENT_ID=1032097689770-gmu91bbb2l1ddv3g1qjtia69pfvorv2g.apps.googleusercontent.com

   # URL API backend Anda yang sudah dideploy di Azure
   VITE_API_URL=https://quiz-app-backend-bzf9ajbvb8hghad0.malaysiawest-01.azurewebsites.net
   ```

---

## 💻 Pengembangan & Perintah (Commands)

Pastikan Node.js (v18 atau lebih baru) sudah terinstal. Jalankan perintah berikut di terminal:

### 📥 Install Dependensi
Mengunduh dan menginstal semua paket pustaka yang diperlukan:
```bash
npm install
```

### 🛠️ Mode Pengembangan (Local Dev Server)
Menjalankan server lokal untuk proses pengembangan dengan fitur Hot Module Replacement (HMR):
```bash
npm run dev
```
Buka [http://localhost:5173](http://localhost:5173) pada browser Anda.

### 📦 Build Produksi
Mengompilasi dan mengoptimalkan kode frontend menjadi file statis siap dideploy (hasil output di folder `/dist`):
```bash
npm run build
```

### 👁️ Preview Build Produksi
Menjalankan server lokal untuk menguji hasil build produksi sebelum di-deploy:
```bash
npm run preview
```

### 🚨 Linter (Pengecekan Kode)
Menjalankan ESLint untuk mengecek kerapian dan standarisasi penulisan kode:
```bash
npm run lint
```

---

## 📂 Struktur Folder Proyek

Setelah struktur monorepo disederhanakan, berikut adalah bagan direktori utama di tingkat root:
```
quiz-app-frontend/
├── public/             # File statis publik (favicon, dll)
├── src/
│   ├── components/     # Komponen UI reusable (Navbar, QuestionCard, dll)
│   ├── context/        # State Management Global & Logic Timer (QuizContext)
│   ├── hooks/          # Custom React Hooks (useDocumentTitle)
│   ├── pages/          # Halaman Utama (Login, Profile, Quiz, Result, Scoreboard)
│   ├── services/       # Komunikasi API via Axios (api.js, authService.js, scoreService.js)
│   ├── utils/          # Konstanta global dan helper functions
│   ├── App.jsx         # Komponen rute dan layout utama
│   ├── index.css       # File style utama (Tailwind v4)
│   └── main.jsx        # Entry point aplikasi React
├── .env.example        # Template konfigurasi environment
├── eslint.config.js    # Konfigurasi ESLint
├── index.html          # File HTML utama
├── package.json        # Dependensi dan script perintah npm
└── vite.config.js      # Konfigurasi bundler Vite
```
