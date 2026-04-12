import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const BOOKS = [
  { id: 'BK001', title: 'Fisika Dasar untuk SMA', author: 'Dr. Suharto, M.Sc', publisher: 'Erlangga', category: 'Sains', year: 2022, pages: 320, rack: 'B-12', xp: 80, digitalAvailable: true, physicalStock: 3, description: 'Buku fisika komprehensif yang membahas mekanika, termodinamika, dan gelombang secara sistematis untuk siswa SMA kelas X–XII.' },
  { id: 'BK002', title: 'Sejarah Kebudayaan Islam', author: 'Prof. Amir Hamzah', publisher: 'Mizan', category: 'Sejarah', year: 2021, pages: 280, rack: 'C-03', xp: 90, digitalAvailable: false, physicalStock: 1, description: 'Perjalanan peradaban Islam dari masa Rasulullah hingga era modern, dilengkapi ilustrasi dan peta sejarah.' },
  { id: 'BK003', title: 'Laskar Pelangi', author: 'Andrea Hirata', publisher: 'Bentang', category: 'Sastra', year: 2005, pages: 529, rack: 'A-07', xp: 70, digitalAvailable: true, physicalStock: 5, description: 'Novel fenomenal tentang semangat anak-anak Belitung yang berjuang meraih pendidikan di tengah keterbatasan.' },
  { id: 'BK004', title: 'Algoritma & Pemrograman', author: 'Rinaldi Munir', publisher: 'Informatika', category: 'Teknologi', year: 2023, pages: 400, rack: 'D-01', xp: 100, digitalAvailable: true, physicalStock: 4, description: 'Pengantar lengkap algoritma, struktur data, dan pemrograman untuk mahasiswa dan pelajar IT.' },
  { id: 'BK005', title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', publisher: 'Lentera Dipantara', category: 'Sastra', year: 1980, pages: 535, rack: 'A-02', xp: 75, digitalAvailable: true, physicalStock: 2, description: 'Karya masterpiece Pramoedya yang menggambarkan kolonialisme dan perjuangan identitas di awal abad XX.' },
  { id: 'BK006', title: 'Biologi Sel & Molekuler', author: 'Campbell & Reece', publisher: 'Pearson', category: 'Sains', year: 2020, pages: 600, rack: 'B-05', xp: 110, digitalAvailable: false, physicalStock: 2, description: 'Referensi standar dunia untuk biologi sel, genetika molekuler, dan evolusi yang digunakan di universitas.' },
  { id: 'BK007', title: 'Matematika Analitik', author: 'Thomas & Finney', publisher: 'Gramedia', category: 'Matematika', year: 2019, pages: 720, rack: 'E-04', xp: 120, digitalAvailable: false, physicalStock: 3, description: 'Kalkulus diferensial dan integral secara mendalam dilengkapi ribuan soal latihan berjenjang.' },
  { id: 'BK008', title: 'Filosofi Teras', author: 'Henry Manampiring', publisher: 'Penerbit Buku Kompas', category: 'Sosial', year: 2019, pages: 284, rack: 'F-08', xp: 65, digitalAvailable: true, physicalStock: 6, description: 'Adaptasi filosofi Stoa untuk kehidupan modern — cara menghadapi emosi, tekanan, dan ketidakpastian.' },
]

const ACTIVE_BOOKS = [
  { bookId: 'BK001', type: 'digital', status: 'reading', startedAt: '2026-04-15', currentPage: 180, book: BOOKS[0] },
  { bookId: 'BK002', type: 'physical', status: 'borrowed', borrowedAt: '2026-04-12', dueDate: '2026-04-26', book: BOOKS[1] },
]

const COMPLETED_BOOKS = [
  { bookId: 'BK003', type: 'digital', completedAt: '2026-04-10', xpEarned: 70, score: 80, book: BOOKS[2] },
  { bookId: 'BK004', type: 'digital', completedAt: '2026-04-05', xpEarned: 100, score: 95, book: BOOKS[3] },
  { bookId: 'BK008', type: 'physical', completedAt: '2026-03-28', xpEarned: 65, score: 85, book: BOOKS[7] },
]

const BORROW_LOG = [
  { id: 'LOG001', studentId: 'LQ-2024-001', studentName: 'Rizky Dermawan', bookId: 'BK002', bookTitle: 'Sejarah Kebudayaan Islam', borrowedAt: '2026-04-12', dueDate: '2026-04-26', status: 'active', borrowCount: 1 },
  { id: 'LOG002', studentId: 'LQ-2024-002', studentName: 'Andini Safitri', bookId: 'BK001', bookTitle: 'Fisika Dasar untuk SMA', borrowedAt: '2026-04-14', dueDate: '2026-04-28', status: 'active', borrowCount: 1 },
  { id: 'LOG003', studentId: 'LQ-2024-003', studentName: 'Bagas Firmansyah', bookId: 'BK007', bookTitle: 'Matematika Analitik', borrowedAt: '2026-04-10', dueDate: '2026-04-24', status: 'overdue', borrowCount: 1 },
]

// Borrow count per student for leaderboard
const BORROW_RANKING = [
  { studentId: 'LQ-2024-002', name: 'Andini Safitri', class: 'XI IPA 2', totalBorrowed: 22, avatar: 'AS' },
  { studentId: 'LQ-2024-003', name: 'Bagas Firmansyah', class: 'XI IPA 2', totalBorrowed: 18, avatar: 'BF' },
  { studentId: 'LQ-2024-004', name: 'Citra Handayani', class: 'XI IPA 2', totalBorrowed: 17, avatar: 'CH' },
  { studentId: 'LQ-2024-005', name: 'Dian Pratama', class: 'XI IPA 2', totalBorrowed: 15, avatar: 'DP' },
  { studentId: 'LQ-2024-001', name: 'Rizky Dermawan', class: 'XI IPA 2', totalBorrowed: 14, avatar: 'RD', isMe: true },
  { studentId: 'LQ-2024-006', name: 'Fadli Ramadhan', class: 'XI IPA 2', totalBorrowed: 12, avatar: 'FR' },
]

export const useLibraryStore = defineStore('library', () => {
  const books = ref(BOOKS)
  const activeBooks = ref(ACTIVE_BOOKS)
  const completedBooks = ref(COMPLETED_BOOKS)
  const borrowLog = ref(BORROW_LOG)
  const borrowRanking = ref(BORROW_RANKING)
  const savedBooks = ref([])           // bookmarked books
  const selectedBook = ref(null)
  const showQuestAI = ref(false)
  const questBook = ref(null)
  const searchQuery = ref('')
  const activeCategory = ref('Semua')

  const categories = ['Semua', 'Sains', 'Sastra', 'Sejarah', 'Teknologi', 'Matematika', 'Sosial']

  const filteredBooks = computed(() => {
    let list = books.value
    if (activeCategory.value !== 'Semua')
      list = list.filter(b => b.category === activeCategory.value)
    if (searchQuery.value.trim())
      list = list.filter(b =>
        b.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    return list
  })

  function selectBook(book)  { selectedBook.value = book }
  function closeBook()       { selectedBook.value = null }

  function isSaved(bookId) { return savedBooks.value.some(b => b.id === bookId) }

  function toggleSave(book) {
    const idx = savedBooks.value.findIndex(b => b.id === book.id)
    if (idx === -1) savedBooks.value.push(book)
    else savedBooks.value.splice(idx, 1)
  }

  function startDigitalRead(book) {
    if (!activeBooks.value.find(a => a.bookId === book.id)) {
      activeBooks.value.unshift({
        bookId: book.id, type: 'digital', status: 'reading',
        startedAt: new Date().toISOString().slice(0, 10),
        currentPage: 0, book
      })
    }
    selectedBook.value = null
  }

  function borrowPhysical(book) {
    const today = new Date()
    const due = new Date(today); due.setDate(due.getDate() + 14)
    activeBooks.value.unshift({
      bookId: book.id, type: 'physical', status: 'borrowed',
      borrowedAt: today.toISOString().slice(0, 10),
      dueDate: due.toISOString().slice(0, 10), book
    })
    selectedBook.value = null
  }

  function triggerQuestAI(bookEntry) {
    questBook.value = bookEntry
    showQuestAI.value = true
  }

  function completeQuest(bookEntry, xpEarned, score) {
    activeBooks.value = activeBooks.value.filter(b => b.bookId !== bookEntry.bookId)
    completedBooks.value.unshift({
      bookId: bookEntry.bookId, type: bookEntry.type,
      completedAt: new Date().toISOString().slice(0, 10),
      xpEarned, score, book: bookEntry.book
    })
    showQuestAI.value = false
    questBook.value = null
    return xpEarned
  }

  function processBorrow(studentCode, bookCode) {
    const book = books.value.find(b => b.id === bookCode)
    if (!book || book.physicalStock === 0) return { success: false, message: 'Buku tidak ditemukan atau stok habis.' }
    book.physicalStock--
    const today = new Date()
    const due = new Date(today); due.setDate(due.getDate() + 14)
    borrowLog.value.unshift({
      id: 'LOG' + Date.now(),
      studentId: studentCode,
      studentName: 'Siswa (' + studentCode + ')',
      bookId: book.id, bookTitle: book.title,
      borrowedAt: today.toISOString().slice(0, 10),
      dueDate: due.toISOString().slice(0, 10), status: 'active'
    })
    // update borrow ranking
    const rank = borrowRanking.value.find(r => r.studentId === studentCode)
    if (rank) rank.totalBorrowed++
    return { success: true, message: `Peminjaman "${book.title}" berhasil dicatat.` }
  }

  function processReturn(logId) {
    const entry = borrowLog.value.find(l => l.id === logId)
    if (!entry) return { success: false }
    entry.status = 'returned'
    const book = books.value.find(b => b.id === entry.bookId)
    if (book) book.physicalStock++
    return { success: true, studentId: entry.studentId, book: entry }
  }

  return {
    books, activeBooks, completedBooks, borrowLog, borrowRanking,
    savedBooks, selectedBook, showQuestAI, questBook,
    searchQuery, activeCategory, categories, filteredBooks,
    selectBook, closeBook, isSaved, toggleSave,
    startDigitalRead, borrowPhysical, triggerQuestAI, completeQuest,
    processBorrow, processReturn
  }
})
