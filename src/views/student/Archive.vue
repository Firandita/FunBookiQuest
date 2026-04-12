<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Archive</h1>
        <p class="text-gray-400 text-sm mt-0.5">Riwayat dan koleksi bacaanmu</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit mb-6">
      <button
        v-for="tab in tabs" :key="tab.id"
        @click="activeTab = tab.id"
        class="px-5 py-2 text-sm font-medium rounded-lg transition-all"
        :class="activeTab === tab.id ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
      >{{ tab.label }} <span class="ml-1 text-xs opacity-70">({{ tab.count }})</span></button>
    </div>

    <!-- SEDANG DIBACA -->
    <template v-if="activeTab === 'reading'">
      <div v-if="libraryStore.activeBooks.length === 0" class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <p class="text-gray-400 text-sm">Tidak ada buku yang sedang dibaca</p>
        <router-link to="/discovery" class="btn-primary inline-block mt-4 text-sm px-5 py-2.5">Cari Buku</router-link>
      </div>
      <div v-else class="grid grid-cols-2 gap-4">
        <div
          v-for="entry in libraryStore.activeBooks" :key="entry.bookId"
          class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex gap-4"
        >
          <div class="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <BookCover :book-id="entry.book.id" :title="entry.book.title" :category="entry.book.category" class-name="w-full h-full" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-800 text-sm leading-snug">{{ entry.book.title }}</p>
            <p class="text-xs text-gray-400 mt-0.5 mb-2">{{ entry.book.author }}</p>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="entry.type === 'digital' ? 'bg-primary-50 text-primary-500' : 'bg-mint-50 text-mint-600'">
              {{ entry.type === 'digital' ? 'Digital' : 'Fisik' }}
            </span>
            <div v-if="entry.type === 'digital'" class="mt-2">
              <div class="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>{{ entry.currentPage }} / {{ entry.book.pages }} hal</span>
                <span>{{ Math.round(entry.currentPage / entry.book.pages * 100) }}%</span>
              </div>
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-primary-400 rounded-full" :style="{ width: (entry.currentPage / entry.book.pages * 100) + '%' }"></div>
              </div>
            </div>
            <div v-else class="mt-2 text-xs text-gray-500">
              Kembali: <span :class="isOverdue(entry.dueDate) ? 'text-red-500 font-semibold' : 'font-medium'">{{ formatDate(entry.dueDate) }}</span>
            </div>
            <button @click="libraryStore.triggerQuestAI(entry)" class="mt-3 text-xs bg-primary-50 text-primary-600 border border-primary-100 px-3 py-1.5 rounded-lg font-medium hover:bg-primary-100 transition-colors">
              Tandai Selesai
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- SELESAI -->
    <template v-if="activeTab === 'done'">
      <div v-if="libraryStore.completedBooks.length === 0" class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <p class="text-gray-400 text-sm">Belum ada buku yang diselesaikan</p>
      </div>
      <div v-else class="grid grid-cols-3 gap-4">
        <div
          v-for="entry in libraryStore.completedBooks" :key="entry.bookId"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
        >
          <div class="h-36 bg-gray-50">
            <BookCover :book-id="entry.book.id" :title="entry.book.title" :category="entry.book.category" class-name="w-full h-full" />
          </div>
          <div class="p-3">
            <p class="font-semibold text-sm text-gray-800 leading-snug line-clamp-2 mb-1">{{ entry.book.title }}</p>
            <p class="text-xs text-gray-400 mb-2">{{ entry.book.author }}</p>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-400">{{ formatDate(entry.completedAt) }}</span>
              <div class="text-right">
                <span class="text-sm font-bold text-amber-500">+{{ entry.xpEarned }} XP</span>
                <span class="text-xs text-gray-400 ml-1">{{ entry.score }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- DISIMPAN -->
    <template v-if="activeTab === 'saved'">
      <div v-if="libraryStore.savedBooks.length === 0" class="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <p class="text-gray-400 text-sm mb-1">Belum ada buku yang disimpan</p>
        <p class="text-xs text-gray-300">Tap ikon simpan di halaman Discovery untuk menyimpan buku</p>
        <router-link to="/discovery" class="btn-outline inline-block mt-4 text-sm px-5 py-2.5">Ke Discovery</router-link>
      </div>
      <div v-else class="grid grid-cols-4 gap-4">
        <div
          v-for="book in libraryStore.savedBooks" :key="book.id"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm group"
        >
          <div class="relative h-36 bg-gray-50">
            <BookCover :book-id="book.id" :title="book.title" :category="book.category" class-name="w-full h-full" />
            <button
              @click="libraryStore.toggleSave(book)"
              class="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              title="Hapus dari simpanan"
            >
              <X class="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          <div class="p-3">
            <p class="font-semibold text-xs text-gray-800 line-clamp-2 leading-snug mb-1">{{ book.title }}</p>
            <p class="text-[10px] text-gray-400 mb-2">{{ book.author }}</p>
            <button @click="libraryStore.selectBook(book)" class="text-xs text-primary-500 font-medium hover:underline">Lihat detail</button>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useLibraryStore } from '@/stores/library'
import BookCover from '@/components/BookCover.vue'

const libraryStore = useLibraryStore()
const activeTab = ref('reading')

const tabs = computed(() => [
  { id: 'reading', label: 'Sedang Dibaca', count: libraryStore.activeBooks.length },
  { id: 'done',    label: 'Selesai',       count: libraryStore.completedBooks.length },
  { id: 'saved',   label: 'Disimpan',      count: libraryStore.savedBooks.length },
])

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
function isOverdue(d) { return d && new Date(d) < new Date() }
</script>
