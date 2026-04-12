# LibraQuest — Frontend

Platform web gamifikasi perpustakaan sekolah berbasis Vue.js 3 + Tailwind CSS.

## Tech Stack
- **Framework:** Vue.js 3 (Composition API, `<script setup>`)
- **Styling:** Tailwind CSS 3
- **State:** Pinia
- **Router:** Vue Router 4
- **Icons:** Lucide Vue Next
- **Build:** Vite

## Setup & Jalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan dev server
npm run dev

# 3. Build production
npm run build
```

Buka browser di `http://localhost:5173`

## Struktur Direktori

```
src/
├── assets/
│   └── main.css              # Tailwind base + custom utilities
├── components/
│   ├── BottomNav.vue          # Navigasi bawah mobile (siswa)
│   ├── LibraAI.vue            # Floating AI chatbot
│   ├── QuestAI.vue            # Kuis gamifikasi Kahoot-style
│   ├── BookDetailModal.vue    # Modal detail & aksi buku
│   └── LibrarianSidebar.vue   # Sidebar desktop pustakawan
├── views/
│   ├── student/
│   │   ├── Basecamp.vue       # Home: profil, XP bar, misi aktif
│   │   ├── Discovery.vue      # Katalog buku + scan barcode
│   │   ├── Archive.vue        # Riwayat baca & selesai
│   │   ├── HallOfFame.vue     # Leaderboard kelas
│   │   └── SkillTree.vue      # Statistik, badge, reward
│   └── librarian/
│       ├── CounterDesk.vue    # Proses pinjam & kembali cepat
│       ├── Inventory.vue      # Tabel manajemen koleksi buku
│       └── BorrowLog.vue      # Log semua transaksi peminjaman
├── stores/
│   ├── user.js                # State profil, XP, level
│   └── library.js             # State buku, misi, peminjaman
├── router/
│   └── index.js               # Route siswa & pustakawan
├── App.vue                    # Root: layout selector by role
└── main.js                    # Entry point

```

## Ganti Role (Dev Mode)

Ada dua tombol kecil di pojok kanan atas:
- **👤 Siswa** → tampilan mobile student
- **📚 Pustakawan** → tampilan desktop librarian

## Fitur yang Sudah Diimplementasi

### Siswa
- [x] Dashboard (Basecamp) dengan XP bar & level
- [x] Misi aktif: buku digital (progress bar) & fisik (tanggal pinjam/kembali)
- [x] Tombol "Selesai Baca" trigger QuestAI
- [x] Discovery: katalog + filter kategori + pencarian
- [x] Scan barcode buku fisik (simulasi)
- [x] Modal detail buku (deskripsi, rak, aksi)
- [x] Archive: tab sedang dibaca vs selesai
- [x] Hall of Fame: podium + leaderboard lengkap
- [x] Skill Tree: streak, genre radar, badge, statistik, reward
- [x] QuestAI: kuis timer Kahoot-style + skor + XP
- [x] LibraAI: floating chatbot sticky

### Pustakawan
- [x] Counter Desk: scan/input ID siswa & buku
- [x] Preview data sebelum proses
- [x] Daftar peminjaman aktif + tombol kembali
- [x] Inventaris: tabel buku dengan filter & pencarian
- [x] Log peminjaman dengan filter status
- [x] Indikator stok habis & terlambat

## Pengembangan Selanjutnya
- [ ] Integrasi API AI untuk QuestAI (OpenAI/Gemini)
- [ ] Integrasi iPusnas untuk buku digital
- [ ] Reader buku digital dalam platform
- [ ] Notifikasi real-time (WebSocket)
- [ ] QR Code generator per akun siswa
- [ ] Kamera scan barcode native (html5-qrcode)
- [ ] Backend API (Laravel/Node.js)
