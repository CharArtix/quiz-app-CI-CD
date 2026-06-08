# 📋 Project Requirements & Execution Policy

Dokumen ini berisi checklist implementasi berdasarkan instruksi Technical Challenge.

## A. Core Requirements
- [x] **Framework:** React.js.
- [x] **Login Feature:** Input nama user sebelum mulai.
- [x] **Data Source:** Fetch dari OpenTDB API.
- [ ] **Question Display:**
    - [x] Tampilkan 1 soal per halaman.
    - [x] Auto-move setelah memilih jawaban.
- [x] **Timer:**
    - [x] Global timer untuk seluruh kuis.
    - [x] Auto-submit jika waktu habis.
- [x] **Result:** Tampilkan Benar, Salah, dan Total Dijawab.

## B. Bonus & "Plus Points" (Critical)
- [x] **Resume Mechanism:**
    - [x] Menggunakan `localStorage` untuk menyimpan state.
    - [x] State yang disimpan: `currentIndex`, `answers`, `timeLeft`, `userSession`.
    - [x] Browser refresh/close tidak mereset progress.

## C. Technical Constraints (Self-Imposed)
- **Styling:** Tailwind CSS v4 (Mobile Responsive).
- **Clean Code:**
    - Komponen terpisah (`components/`).
    - Logic terpisah (`hooks/` & `context/`).
    - Tidak ada hardcoded values yang krusial.

## D. Timeline Execution
- Deadline: Rabu, 14 Januari 2026, 08.00 WIB.