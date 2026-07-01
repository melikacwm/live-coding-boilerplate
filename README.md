# Tes Live Coding — Aplikasi Web Member

Boilerplate proyek untuk tes live coding. Detail requirement lengkap ada di [SPEC.md](./SPEC.md).

## Struktur

```
tes-live-coding/
  SPEC.md          spesifikasi lengkap
  backend/         Express + Sequelize (MySQL), MVC
  frontend/        React + Vite, MVC
```

## Menjalankan Backend

```
cd backend
npm install
cp .env.example .env   # isi kredensial database MySQL & JWT secret kamu
npm run dev
```

Backend berjalan di `http://localhost:5000`. Pastikan database MySQL (nama sesuai `DB_NAME` di `.env`) sudah dibuat sebelum start — tabel akan otomatis dibuat lewat `sequelize.sync()`.

## Menjalankan Frontend

```
cd frontend
npm install
cp .env.example .env   # sesuaikan VITE_API_URL jika perlu
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

## Catatan

- Styling frontend hanya lewat satu file `frontend/src/index.css` (global), tidak ada CSS per komponen.
- Komponen UI (`Button`, `Input`, `Card`, `DataTable`) di `frontend/src/components` dipakai ulang di semua halaman.
- Login mendukung 4 metode sesuai SPEC.md: No HP + OTP, Email + OTP, No HP/Email + Password, dan Google (integrasi Google masih placeholder — lihat komentar `TODO` di `backend/src/routes/auth.routes.js`).
- Jangan commit file `.env` (sudah masuk `.gitignore`) — gunakan `.env.example` sebagai referensi.

## Submission

Push project ini ke repository GitHub kamu sendiri (jangan lupa `git init` dulu jika belum), lalu bagikan link repo-nya ke interviewer.
