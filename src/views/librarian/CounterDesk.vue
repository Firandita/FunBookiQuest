<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">🖥️ Counter Desk</h1>
      <p class="text-gray-400 text-sm mt-1">Proses peminjaman dan pengembalian buku secara cepat</p>
    </div>

    <div class="grid grid-cols-2 gap-6">

      <!-- BORROW PANEL -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
            <ArrowDownToLine class="w-4 h-4 text-primary-500" />
          </div>
          <h2 class="font-bold text-gray-800">Proses Peminjaman</h2>
        </div>

        <div class="space-y-4">
          <!-- Student scan -->
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              1. ID Akun Siswa
            </label>
            <div class="flex gap-2">
              <div class="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-primary-400 focus-within:bg-white transition-colors">
                <ScanLine class="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  v-model="studentCode"
                  placeholder="Scan barcode / ketik ID (cth: LQ-2024-001)"
                  class="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button @click="simulateStudentScan" class="bg-primary-50 text-primary-600 border border-primary-100 rounded-xl px-3 text-xs font-medium hover:bg-primary-100 transition-colors">
                Demo
              </button>
            </div>
            <!-- Student preview -->
            <div v-if="studentCode" class="mt-2 p-3 bg-primary-50 border border-primary-100 rounded-xl flex items-center gap-2">
              <span class="text-xl">🦊</span>
              <div>
                <p class="text-sm font-semibold text-primary-700">Rizky Dermawan</p>
                <p class="text-xs text-primary-500">XI IPA 2 • Level 4 • {{ studentCode }}</p>
              </div>
              <div class="ml-auto">
                <span class="badge bg-mint-50 text-mint-600 text-[10px]">✅ Aktif</span>
              </div>
            </div>
          </div>

          <!-- Book scan -->
          <div>
            <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              2. Barcode Buku
            </label>
            <div class="flex gap-2">
              <div class="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:border-primary-400 focus-within:bg-white transition-colors">
                <BookOpen class="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  v-model="bookCode"
                  placeholder="Scan barcode / ketik ID buku (cth: BK001)"
                  class="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button @click="simulateBookScan" class="bg-primary-50 text-primary-600 border border-primary-100 rounded-xl px-3 text-xs font-medium hover:bg-primary-100 transition-colors">
                Demo
              </button>
            </div>
            <!-- Book preview -->
            <div v-if="previewBook" class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-2">
              <span class="text-2xl">{{ previewBook.cover }}</span>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-800">{{ previewBook.title }}</p>
                <p class="text-xs text-gray-500">{{ previewBook.author }} • Rak {{ previewBook.rack }}</p>
              </div>
              <span
                class="badge text-[10px]"
                :class="previewBook.physicalStock > 0 ? 'bg-mint-50 text-mint-600' : 'bg-coral-50 text-coral-400'"
              >{{ previewBook.physicalStock > 0 ? `${previewBook.physicalStock} tersedia` : 'Stok habis' }}</span>
            </div>
          </div>

          <!-- Submit -->
          <button
            @click="processBorrow"
            :disabled="!studentCode || !bookCode"
            class="w-full py-3 rounded-xl font-semibold text-sm transition-all"
            :class="studentCode && bookCode
              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
          >
            ✅ Proses Peminjaman
          </button>

          <!-- Success msg -->
          <Transition name="fade">
            <div v-if="borrowSuccess" class="p-3 bg-mint-50 border border-mint-200 rounded-xl text-sm text-mint-700 font-medium text-center">
              ✅ {{ borrowSuccess }}
            </div>
          </Transition>
        </div>
      </div>

      <!-- RETURN PANEL -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-2 mb-5">
          <div class="w-8 h-8 bg-mint-50 rounded-xl flex items-center justify-center">
            <ArrowUpFromLine class="w-4 h-4 text-mint-600" />
          </div>
          <h2 class="font-bold text-gray-800">Proses Pengembalian</h2>
        </div>

        <!-- Active borrows table -->
        <div class="space-y-2 max-h-80 overflow-y-auto pr-1">
          <div v-if="activeBorrows.length === 0" class="text-center py-8 text-gray-400 text-sm">
            Tidak ada peminjaman aktif
          </div>
          <div
            v-for="log in activeBorrows" :key="log.id"
            class="flex items-center gap-3 p-3 rounded-xl border transition-colors"
            :class="log.status === 'overdue' ? 'bg-coral-50 border-coral-100' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'"
          >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ log.bookTitle }}</p>
              <p class="text-xs text-gray-500">{{ log.studentName }} • {{ log.studentId }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-[10px] text-gray-400">Pinjam: {{ log.borrowedAt }}</span>
                <span class="text-[10px]" :class="log.status === 'overdue' ? 'text-coral-400 font-semibold' : 'text-gray-400'">
                  Kembali: {{ log.dueDate }} {{ log.status === 'overdue' ? '⚠️ Terlambat' : '' }}
                </span>
              </div>
            </div>
            <button
              @click="processReturn(log.id)"
              class="flex-shrink-0 text-xs px-3 py-2 rounded-xl font-medium transition-all"
              :class="log.status === 'overdue'
                ? 'bg-coral-400 text-white hover:bg-coral-600'
                : 'bg-mint-50 text-mint-700 border border-mint-200 hover:bg-mint-100'"
            >
              Kembali
            </button>
          </div>
        </div>

        <!-- Return success -->
        <Transition name="fade">
          <div v-if="returnSuccess" class="mt-3 p-3 bg-mint-50 border border-mint-200 rounded-xl text-sm text-mint-700 font-medium">
            <p>✅ Pengembalian berhasil!</p>
            <p class="text-xs mt-1">🧠 QuestAI telah diaktifkan untuk siswa tersebut.</p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-4 gap-4 mt-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
        <p class="text-2xl font-bold text-primary-500">{{ libraryStore.borrowLog.filter(l=>l.status==='active').length }}</p>
        <p class="text-xs text-gray-400 mt-1">Dipinjam Aktif</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
        <p class="text-2xl font-bold text-coral-400">{{ libraryStore.borrowLog.filter(l=>l.status==='overdue').length }}</p>
        <p class="text-xs text-gray-400 mt-1">Terlambat</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
        <p class="text-2xl font-bold text-mint-600">{{ libraryStore.borrowLog.filter(l=>l.status==='returned').length }}</p>
        <p class="text-xs text-gray-400 mt-1">Dikembalikan</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
        <p class="text-2xl font-bold text-gray-800">{{ libraryStore.books.reduce((s,b)=>s+b.physicalStock,0) }}</p>
        <p class="text-xs text-gray-400 mt-1">Stok Tersedia</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ScanLine, BookOpen, ArrowDownToLine, ArrowUpFromLine } from 'lucide-vue-next'
import { useLibraryStore } from '@/stores/library'

const libraryStore = useLibraryStore()

const studentCode = ref('')
const bookCode = ref('')
const borrowSuccess = ref('')
const returnSuccess = ref(false)

const previewBook = computed(() =>
  bookCode.value ? libraryStore.books.find(b => b.id.toUpperCase() === bookCode.value.toUpperCase()) : null
)

const activeBorrows = computed(() =>
  libraryStore.borrowLog.filter(l => l.status === 'active' || l.status === 'overdue')
)

function simulateStudentScan() { studentCode.value = 'LQ-2024-001' }
function simulateBookScan() { bookCode.value = 'BK004' }

function processBorrow() {
  const result = libraryStore.processBorrow(studentCode.value, bookCode.value)
  if (result.success) {
    borrowSuccess.value = result.message
    studentCode.value = ''
    bookCode.value = ''
    setTimeout(() => { borrowSuccess.value = '' }, 4000)
  } else {
    alert(result.message)
  }
}

function processReturn(logId) {
  const result = libraryStore.processReturn(logId)
  if (result.success) {
    returnSuccess.value = true
    setTimeout(() => { returnSuccess.value = false }, 4000)
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
