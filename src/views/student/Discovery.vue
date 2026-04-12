<template>
  <div class="p-8 min-h-screen bg-gray-50">

    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Discovery</h1>
        <p class="text-gray-400 text-sm mt-0.5">Temukan buku berikutnya</p>
      </div>
      <button
        @click="showScan = true"
        class="flex items-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm"
      >
        <ScanLine class="w-4 h-4" />
        Scan Barcode
      </button>
    </div>

    <!-- Search + Filter row -->
    <div class="flex items-center gap-3 mb-5">
      <div class="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-primary-400 transition-colors">
        <Search class="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          v-model="libraryStore.searchQuery"
          placeholder="Cari judul, pengarang, ID buku..."
          class="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
        />
        <button v-if="libraryStore.searchQuery" @click="libraryStore.searchQuery = ''" class="text-gray-300 hover:text-gray-500">
          <X class="w-4 h-4" />
        </button>
      </div>
      <div class="flex gap-2">
        <button
          v-for="cat in libraryStore.categories" :key="cat"
          @click="libraryStore.activeCategory = cat"
          class="text-xs px-3 py-2 rounded-xl border font-medium transition-all"
          :class="libraryStore.activeCategory === cat
            ? 'bg-primary-500 text-white border-primary-500'
            : 'bg-white text-gray-500 border-gray-200 hover:border-primary-300'"
        >{{ cat }}</button>
      </div>
    </div>

    <!-- Results count -->
    <p class="text-xs text-gray-400 mb-4">{{ libraryStore.filteredBooks.length }} buku ditemukan</p>

    <!-- Book grid -->
    <div v-if="libraryStore.filteredBooks.length === 0" class="text-center py-16 bg-white rounded-2xl border border-gray-100">
      <p class="text-gray-400 text-sm">Buku tidak ditemukan</p>
    </div>
    <div v-else class="grid grid-cols-5 gap-4">
      <div
        v-for="book in libraryStore.filteredBooks" :key="book.id"
        @click="libraryStore.selectBook(book)"
        class="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-200 transition-all group"
      >
        <!-- Cover -->
        <div class="h-40 bg-gray-50 overflow-hidden">
          <BookCover :book-id="book.id" :title="book.title" :category="book.category" class-name="w-full h-full" />
        </div>
        <div class="p-3">
          <p class="font-semibold text-gray-800 text-xs leading-snug line-clamp-2 mb-1">{{ book.title }}</p>
          <p class="text-[10px] text-gray-400 mb-2 truncate">{{ book.author }}</p>
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">+{{ book.xp }} XP</span>
            <div class="flex items-center gap-1.5 text-[10px] text-gray-400">
              <span v-if="book.digitalAvailable" class="text-primary-400 font-medium">Digital</span>
              <span v-if="book.digitalAvailable && book.physicalStock > 0" class="text-gray-300">·</span>
              <span v-if="book.physicalStock > 0" class="text-mint-600 font-medium">Fisik</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scan Modal -->
    <Teleport to="body">
      <div v-if="showScan" class="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="closeScan">
        <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-gray-800">Scan Barcode Buku</h3>
            <button @click="closeScan" class="text-gray-400 hover:text-gray-600">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6">
            <!-- Camera scanner -->
            <div v-if="!scanResult" class="mb-4">
              <div
                id="qr-reader"
                class="w-full rounded-xl overflow-hidden border-2 border-dashed border-primary-200 bg-gray-50"
                style="min-height: 240px"
              ></div>
              <p class="text-xs text-gray-400 text-center mt-2">Arahkan kamera ke barcode buku</p>
            </div>

            <!-- Scan result -->
            <div v-if="scanResult" class="mb-4 p-4 bg-mint-50 border border-mint-200 rounded-xl flex items-center gap-4">
              <div class="w-14 h-18 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100" style="height:72px">
                <BookCover :book-id="scanResult.id" :title="scanResult.title" :category="scanResult.category" class-name="w-full h-full" />
              </div>
              <div class="flex-1">
                <p class="font-semibold text-gray-800">{{ scanResult.title }}</p>
                <p class="text-sm text-gray-500">{{ scanResult.author }}</p>
                <p class="text-xs text-mint-600 font-medium mt-1">Rak: {{ scanResult.rack }}</p>
              </div>
              <button @click="scanResult = null; restartScan()" class="text-xs text-gray-400 hover:text-gray-600">Scan ulang</button>
            </div>

            <!-- Manual input -->
            <div class="flex gap-2 mb-4">
              <input
                v-model="manualCode"
                @keyup.enter="searchByCode"
                placeholder="Atau ketik ID buku (cth: BK001)"
                class="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400"
              />
              <button @click="searchByCode" class="btn-primary px-4 py-2.5 text-sm">Cari</button>
            </div>
            <p v-if="scanError" class="text-xs text-red-500 mb-3">{{ scanError }}</p>

            <div v-if="scanResult" class="flex gap-3">
              <button @click="borrowFromScan('digital')" :disabled="!scanResult.digitalAvailable" class="flex-1 btn-primary py-2.5 text-sm" :class="!scanResult.digitalAvailable ? 'opacity-40 cursor-not-allowed' : ''">
                Baca Digital
              </button>
              <button @click="borrowFromScan('physical')" :disabled="scanResult.physicalStock === 0" class="flex-1 btn-outline py-2.5 text-sm" :class="scanResult.physicalStock === 0 ? 'opacity-40 cursor-not-allowed' : ''">
                Pinjam Fisik
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { Search, X, ScanLine } from 'lucide-vue-next'
import { Html5Qrcode } from 'html5-qrcode'
import { useLibraryStore } from '@/stores/library'
import BookCover from '@/components/BookCover.vue'

const libraryStore = useLibraryStore()
const showScan = ref(false)
const scanResult = ref(null)
const manualCode = ref('')
const scanError = ref('')

let html5QrCode = null

async function startScanner() {
  await nextTick()
  try {
    html5QrCode = new Html5Qrcode('qr-reader')
    await html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 150 } },
      (decodedText) => {
        handleScanResult(decodedText)
      },
      () => {}
    )
  } catch (err) {
    scanError.value = 'Tidak dapat mengakses kamera. Coba ketik ID buku secara manual.'
  }
}

function handleScanResult(code) {
  stopScanner()
  const found = libraryStore.books.find(b => b.id.toUpperCase() === code.toUpperCase())
  if (found) {
    scanResult.value = found
    scanError.value = ''
  } else {
    scanError.value = `Buku dengan kode "${code}" tidak ditemukan.`
  }
}

async function stopScanner() {
  if (html5QrCode) {
    try { await html5QrCode.stop() } catch {}
    html5QrCode = null
  }
}

async function restartScan() {
  await stopScanner()
  await startScanner()
}

function searchByCode() {
  const code = manualCode.value.trim()
  if (!code) return
  handleScanResult(code)
  manualCode.value = ''
}

function borrowFromScan(type) {
  if (!scanResult.value) return
  if (type === 'digital') libraryStore.startDigitalRead(scanResult.value)
  else libraryStore.borrowPhysical(scanResult.value)
  closeScan()
}

function closeScan() {
  stopScanner()
  showScan.value = false
  scanResult.value = null
  manualCode.value = ''
  scanError.value = ''
}

watch(showScan, (val) => {
  if (val) startScanner()
  else stopScanner()
})

onUnmounted(stopScanner)
</script>
