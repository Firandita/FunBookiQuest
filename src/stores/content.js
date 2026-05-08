import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ── Seed data: Articles ───────────────────────────────────────────────────
const SEED_ARTICLES = [
  {
    id: 'ART001',
    title: 'Belajar Fisika Lebih Mudah dengan Pendekatan Kontekstual',
    content: `Setelah membaca "Fisika Dasar untuk SMA" karya Dr. Suharto, saya menyadari bahwa fisika bukan sekadar rumus yang harus dihafal. Buku ini menyajikan konsep fisika melalui contoh-contoh nyata dalam kehidupan sehari-hari, mulai dari cara kerja rem mobil hingga fenomena pelangi.\n\nYang paling berkesan bagi saya adalah bab tentang gelombang. Penulis menjelaskan mengapa langit berwarna biru dan matahari terbenam berwarna jingga menggunakan prinsip hamburan Rayleigh dengan bahasa yang mudah dipahami. Setelah membaca bagian ini, saya akhirnya mengerti apa yang selama ini hanya saya hafalkan.\n\nSaya sangat merekomendasikan buku ini bagi siapapun yang merasa fisika itu sulit. Pendekatan kontekstualnya benar-benar mengubah cara pandang saya terhadap mata pelajaran ini.`,
    authorId: 'LQ-2024-001',
    authorName: 'Rizky Dermawan',
    authorClass: 'XI IPA 2',
    bookId: 'BK001',
    bookTitle: 'Fisika Dasar untuk SMA',
    likes: 24,
    views: 142,
    likedBy: [],
    status: 'approved',
    createdAt: '2026-04-18',
    referralXp: 15,
  },
  {
    id: 'ART002',
    title: 'Laskar Pelangi: Saat Keterbatasan Justru Melahirkan Semangat',
    content: `"Laskar Pelangi" bukan hanya novel — ini adalah pengingat bahwa semangat belajar tidak pernah bergantung pada fasilitas. Andrea Hirata berhasil menggambarkan betapa luar biasanya tekad anak-anak Belitung yang bersekolah di gedung hampir roboh namun memiliki mimpi setinggi langit.\n\nYang menggerakkan hati saya adalah karakter Lintang, anak nelayan dengan kecerdasan luar biasa yang harus menempuh perjalanan puluhan kilometer setiap hari hanya untuk bisa belajar. Semangat Lintang membuat saya malu ketika merasa malas belajar padahal saya punya semua fasilitas yang dibutuhkan.\n\nNovel ini mengajarkan satu hal yang tidak bisa diajarkan di kelas manapun: bahwa pendidikan adalah hak setiap manusia, dan tidak ada alasan yang cukup kuat untuk menyerah.`,
    authorId: 'LQ-2024-002',
    authorName: 'Andini Safitri',
    authorClass: 'XI IPA 2',
    bookId: 'BK003',
    bookTitle: 'Laskar Pelangi',
    likes: 51,
    views: 280,
    likedBy: [],
    status: 'approved',
    createdAt: '2026-04-15',
    referralXp: 15,
  },
  {
    id: 'ART003',
    title: 'Filosofi Stoa: Cara Kuno Menghadapi Tekanan Ujian',
    content: `Siapa sangka filosofi yang lahir 2.300 tahun lalu ternyata sangat relevan untuk menghadapi tekanan ujian nasional? Itulah yang saya temukan setelah membaca "Filosofi Teras" karya Henry Manampiring.\n\nInti dari Stoisme adalah membedakan antara hal yang bisa kita kontrol dan yang tidak. Nilai ujian yang akan kita dapat? Tidak bisa dikontrol sepenuhnya. Tapi usaha belajar kita? Itu sepenuhnya ada di tangan kita. Dengan mindset ini, saya mulai merasa lebih tenang menghadapi ujian.\n\nBuku ini ditulis dengan bahasa yang ringan dan penuh humor, jauh dari kesan buku filsafat yang biasanya terasa berat. Sangat cocok dibaca di sela-sela persiapan ujian.`,
    authorId: 'LQ-2024-003',
    authorName: 'Bagas Firmansyah',
    authorClass: 'XI IPA 2',
    bookId: 'BK008',
    bookTitle: 'Filosofi Teras',
    likes: 37,
    views: 195,
    likedBy: [],
    status: 'approved',
    createdAt: '2026-04-12',
    referralXp: 15,
  },
  {
    id: 'ART004',
    title: 'Bumi Manusia dan Pelajaran tentang Identitas Bangsa',
    content: `Membaca "Bumi Manusia" di era modern ini memberi perspektif yang sangat berbeda. Pramoedya menggambarkan pergulatan identitas di masa kolonialisme dengan cara yang tidak pernah bisa dilakukan buku sejarah manapun.\n\nMinke, tokoh utama novel ini, adalah representasi dari dilema yang kita hadapi sebagai bangsa yang sedang berkembang: antara memeluk modernitas dan mempertahankan akar budaya. Pergulatan ini ternyata masih sangat relevan hingga sekarang.\n\nNovel ini mengubah cara saya memandang sejarah Indonesia, dari sekadar hafalan tahun dan nama menjadi pemahaman mendalam tentang perjuangan manusia-manusia nyata.`,
    authorId: 'LQ-2024-004',
    authorName: 'Citra Handayani',
    authorClass: 'XI IPA 2',
    bookId: 'BK005',
    bookTitle: 'Bumi Manusia',
    likes: 19,
    views: 88,
    likedBy: [],
    status: 'pending',
    createdAt: '2026-05-14',
    referralXp: 15,
  },
]

// ── Seed data: Festival Entries ───────────────────────────────────────────
const SEED_FESTIVAL = [
  {
    id: 'FES001',
    title: 'Perpustakaan di Ujung Dunia',
    type: 'Cerpen',
    content: `Di sebuah desa terpencil yang hanya bisa dijangkau dengan perahu selama tiga jam, terdapat sebuah perpustakaan kecil yang dibangun dari kayu ulin. Tidak ada listrik, tidak ada internet. Hanya ada ribuan buku dan seorang penjaga bernama Pak Hamid.\n\nSetiap anak di desa itu hafal jalan menuju perpustakaan. Bukan karena mereka diwajibkan, tapi karena di perpustakaan itulah mereka menemukan dunia yang tidak pernah bisa mereka kunjungi secara fisik...`,
    authorId: 'LQ-2024-001',
    authorName: 'Rizky Dermawan',
    authorClass: 'XI IPA 2',
    votes: 87,
    views: 234,
    status: 'top3',
    semester: '2025/2026-1',
    submittedAt: '2026-01-15',
  },
  {
    id: 'FES002',
    title: 'Ode untuk Buku Lusuh',
    type: 'Puisi',
    content: `Kau datang padaku dengan sampul robek\nDan halaman-halaman yang sudah menguning\nTapi di setiap lipatanmu tersimpan\nRahasia yang belum habis bercerita\n\nBerapa tangan yang telah memegangmu?\nBerapa mata yang telah membacamu?\nBerapa hati yang telah kau ubah?\nDengan kata-kata yang kau bawa dalam diam`,
    authorId: 'LQ-2024-002',
    authorName: 'Andini Safitri',
    authorClass: 'XI IPA 2',
    votes: 124,
    views: 312,
    status: 'top3',
    semester: '2025/2026-1',
    submittedAt: '2026-01-18',
  },
  {
    id: 'FES003',
    title: 'Mengapa Saya Berhenti Membaca dan Mulai Lagi',
    type: 'Essay',
    content: `Ada masa dalam hidup saya ketika saya sama sekali tidak membaca buku selama dua tahun. Bukan karena saya tidak mampu, tapi karena saya tidak mau. Layar smartphone terasa jauh lebih menarik dari lembar-lembar kertas yang harus dibolak-balik satu per satu.\n\nKemudian suatu hari, listrik mati selama delapan jam. Terpaksa saya mengambil buku yang sudah berdebu di sudut kamar...`,
    authorId: 'LQ-2024-003',
    authorName: 'Bagas Firmansyah',
    authorClass: 'XI IPA 2',
    votes: 96,
    views: 189,
    status: 'top10',
    semester: '2025/2026-1',
    submittedAt: '2026-01-20',
  },
  {
    id: 'FES004',
    title: 'Surat untuk Generasiku',
    type: 'Essay',
    content: `Kepada generasiku yang tumbuh bersama notifikasi dan scroll tanpa henti,\n\nAku ingin bercerita tentang sebuah superpower yang hampir kita lupakan: kemampuan untuk duduk diam dan membaca selama satu jam tanpa melihat ponsel...`,
    authorId: 'LQ-2024-004',
    authorName: 'Citra Handayani',
    authorClass: 'XI IPA 2',
    votes: 73,
    views: 156,
    status: 'top10',
    semester: '2025/2026-1',
    submittedAt: '2026-01-22',
  },
  {
    id: 'FES005',
    title: 'Ibu dan Dongeng Sebelum Tidur',
    type: 'Cerpen',
    content: `Ibu selalu membacakan dongeng sebelum tidur, bahkan ketika aku sudah kelas enam SD dan teman-temanku menganggap itu kekanak-kanakan. "Buku adalah cara ibumu memelukmu dari jauh," kata Ibu suatu malam...`,
    authorId: 'LQ-2024-005',
    authorName: 'Dian Pratama',
    authorClass: 'XI IPA 2',
    votes: 61,
    views: 143,
    status: 'top10',
    semester: '2025/2026-1',
    submittedAt: '2026-01-25',
  },
]

// ── Detailed student stats for librarian ─────────────────────────────────
const STUDENT_STATS = [
  { id: 'LQ-2024-002', name: 'Andini Safitri',    class: 'XI IPA 2', avatar: 'AS', xp: 3820, level: 6, booksRead: 22, borrowCount: 22, articlesWritten: 3, festivalEntries: 2, streak: 14, lastActive: '2026-05-14' },
  { id: 'LQ-2024-003', name: 'Bagas Firmansyah',  class: 'XI IPA 2', avatar: 'BF', xp: 3110, level: 5, booksRead: 18, borrowCount: 18, articlesWritten: 2, festivalEntries: 1, streak: 9,  lastActive: '2026-05-13' },
  { id: 'LQ-2024-004', name: 'Citra Handayani',   class: 'XI IPA 2', avatar: 'CH', xp: 2990, level: 5, booksRead: 17, borrowCount: 17, articlesWritten: 2, festivalEntries: 2, streak: 7,  lastActive: '2026-05-14' },
  { id: 'LQ-2024-005', name: 'Dian Pratama',      class: 'XI IPA 2', avatar: 'DP', xp: 2680, level: 4, booksRead: 15, borrowCount: 15, articlesWritten: 1, festivalEntries: 1, streak: 5,  lastActive: '2026-05-12' },
  { id: 'LQ-2024-001', name: 'Rizky Dermawan',    class: 'XI IPA 2', avatar: 'RD', xp: 2450, level: 4, booksRead: 14, borrowCount: 14, articlesWritten: 1, festivalEntries: 1, streak: 7,  lastActive: '2026-05-14', isMe: true },
  { id: 'LQ-2024-006', name: 'Fadli Ramadhan',    class: 'XI IPA 2', avatar: 'FR', xp: 2100, level: 4, booksRead: 12, borrowCount: 12, articlesWritten: 0, festivalEntries: 0, streak: 3,  lastActive: '2026-05-10' },
  { id: 'LQ-2024-007', name: 'Gita Puspita',      class: 'XI IPA 2', avatar: 'GP', xp: 1850, level: 3, booksRead: 10, borrowCount: 10, articlesWritten: 0, festivalEntries: 0, streak: 2,  lastActive: '2026-05-09' },
  { id: 'LQ-2024-008', name: 'Hendra Wijaya',     class: 'XI IPA 2', avatar: 'HW', xp: 1440, level: 3, booksRead: 8,  borrowCount: 8,  articlesWritten: 0, festivalEntries: 0, streak: 0,  lastActive: '2026-05-01' },
]

export const useContentStore = defineStore('content', () => {
  const articles = ref(SEED_ARTICLES)
  const festivalEntries = ref(SEED_FESTIVAL)
  const studentStats = ref(STUDENT_STATS)

  // ── Article getters ───────────────────────────────────────────────────
  const approvedArticles = computed(() =>
    articles.value.filter(a => a.status === 'approved').sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )
  const pendingArticles = computed(() =>
    articles.value.filter(a => a.status === 'pending').sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  )
  const topByLikes = computed(() =>
    [...approvedArticles.value].sort((a, b) => b.likes - a.likes).slice(0, 5)
  )
  const topByViews = computed(() =>
    [...approvedArticles.value].sort((a, b) => b.views - a.views).slice(0, 5)
  )

  function submitArticle(data) {
    articles.value.unshift({
      id: 'ART' + Date.now(),
      ...data,
      likes: 0,
      views: 0,
      likedBy: [],
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
      referralXp: 15,
    })
  }

  function likeArticle(articleId, userId) {
    const art = articles.value.find(a => a.id === articleId)
    if (!art) return
    if (art.likedBy.includes(userId)) {
      art.likes--
      art.likedBy = art.likedBy.filter(id => id !== userId)
    } else {
      art.likes++
      art.likedBy.push(userId)
    }
  }

  function viewArticle(articleId) {
    const art = articles.value.find(a => a.id === articleId)
    if (art) art.views++
  }

  function approveArticle(id) {
    const art = articles.value.find(a => a.id === id)
    if (art) art.status = 'approved'
  }

  function rejectArticle(id) {
    const art = articles.value.find(a => a.id === id)
    if (art) art.status = 'rejected'
  }

  // Referral XP: when student B completes QuestAI via article link,
  // student A (author) gets referralXp bonus
  function triggerReferralXP(articleId, userStore) {
    const art = articles.value.find(a => a.id === articleId)
    if (!art) return 0
    const bonus = art.referralXp
    // In real app: server-side credit to art.authorId
    // Here: just return bonus so caller can show notification
    return bonus
  }

  // ── Festival getters ──────────────────────────────────────────────────
  const currentSemester = '2025/2026-2'
  const festivalOpen = ref(true)

  const top3Entries  = computed(() => festivalEntries.value.filter(e => e.status === 'top3'))
  const top10Entries = computed(() => festivalEntries.value.filter(e => ['top10','top3'].includes(e.status)))
  const galeriEntries = computed(() => top10Entries.value)

  function submitFestivalEntry(data) {
    festivalEntries.value.unshift({
      id: 'FES' + Date.now(),
      ...data,
      votes: 0,
      views: 0,
      status: 'submitted',
      semester: currentSemester,
      submittedAt: new Date().toISOString().slice(0, 10),
    })
  }

  function promoteEntry(id, rank) {
    const entry = festivalEntries.value.find(e => e.id === id)
    if (entry) entry.status = rank // 'top10' or 'top3'
  }

  return {
    articles, festivalEntries, studentStats,
    approvedArticles, pendingArticles, topByLikes, topByViews,
    top3Entries, top10Entries, galeriEntries,
    festivalOpen, currentSemester,
    submitArticle, likeArticle, viewArticle, approveArticle, rejectArticle,
    triggerReferralXP, submitFestivalEntry, promoteEntry,
  }
})
