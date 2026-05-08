# LibraQuest v3 — Frontend

Platform gamifikasi perpustakaan sekolah · Vue.js 3 + Tailwind CSS + Pinia

## Setup

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

## Akses halaman

| URL | Halaman |
|-----|---------|
| /basecamp | Beranda siswa |
| /discovery | Katalog & scan barcode |
| /archive | Riwayat & buku disimpan |
| /hall-of-fame | Leaderboard |
| /skill-tree | Statistik & reward |
| /artikel | Artikel & ulasan buku |
| /artikel/:id | Detail artikel |
| /festival | Festival Karya Literasi |
| /galeri-karya | Galeri karya terpilih |
| /librarian/counter | Counter Desk |
| /librarian/inventory | Inventaris buku |
| /librarian/borrow-log | Log peminjaman |
| /librarian/approve-berita | Moderasi artikel |
| /librarian/peringkat | Peringkat siswa rinci |

## Cara tambah foto sampul buku

Simpan file gambar di `src/assets/covers/` dengan nama sesuai ID buku:

```
src/assets/covers/
  BK001.jpg
  BK002.jpg
  BK003.png   ← format jpg/jpeg/png/webp semua bisa
  ...
```

Ukuran ideal: 300×400px (rasio 3:4 portrait).

## Fitur baru (v3)

- **Artikel & Ulasan** — siswa tulis artikel tentang buku selesai dibaca, ada like & view counter, top artikel, dan sistem referral XP (+15 XP ke penulis kalau teman baca via artikelnya lalu selesaikan QuestAI)
- **Festival Karya Literasi** — lomba cerpen/essay/puisi per semester, Top 10 masuk Galeri Karya, Top 3 dapat reward & badge
- **Galeri Karya** — halaman discovery karya terpilih dengan filter jenis karya
- **Approve Artikel (Pustakawan)** — dashboard moderasi artikel bergaya YouTube Studio, bisa preview sebelum approve/tolak
- **Peringkat Siswa (Pustakawan)** — tabel rinci sortable: XP, buku selesai, pinjaman, artikel, festival, streak, status aktif

## Tech Stack

- Vue 3 + Composition API + `<script setup>`
- Tailwind CSS 3
- Pinia (stores: user, library, content)
- Vue Router 4
- Lucide Vue Next
- html5-qrcode (scan barcode kamera)
