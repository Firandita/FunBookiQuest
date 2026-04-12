<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">📦 Inventaris Buku</h1>
        <p class="text-gray-400 text-sm mt-1">Kelola koleksi fisik dan digital perpustakaan</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
          <Search class="w-4 h-4 text-gray-400" />
          <input v-model="search" placeholder="Cari buku..." class="text-sm outline-none bg-transparent w-48 text-gray-700" />
        </div>
        <select v-model="filterCat" class="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 shadow-sm outline-none">
          <option value="">Semua Kategori</option>
          <option v-for="c in categories" :key="c">{{ c }}</option>
        </select>
        <button class="bg-primary-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-primary-600 transition-colors flex items-center gap-2 shadow-sm">
          <Plus class="w-4 h-4" /> Tambah Buku
        </button>
      </div>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Total Judul</p>
        <p class="text-2xl font-bold text-gray-800">{{ libraryStore.books.length }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Stok Fisik Total</p>
        <p class="text-2xl font-bold text-primary-500">{{ totalPhysical }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Tersedia Digital</p>
        <p class="text-2xl font-bold text-mint-600">{{ totalDigital }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Stok Habis</p>
        <p class="text-2xl font-bold text-coral-400">{{ outOfStock }}</p>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Buku</th>
            <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Kategori</th>
            <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rak</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stok Fisik</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Digital</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">XP</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="book in filteredBooks" :key="book.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ book.cover }}</span>
                <div>
                  <p class="font-semibold text-gray-800 leading-snug">{{ book.title }}</p>
                  <p class="text-xs text-gray-400">{{ book.author }} • {{ book.year }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3.5">
              <span class="badge bg-primary-50 text-primary-600 text-xs">{{ book.category }}</span>
            </td>
            <td class="px-4 py-3.5">
              <span class="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">{{ book.rack }}</span>
            </td>
            <td class="px-4 py-3.5 text-center">
              <span
                class="badge text-xs"
                :class="book.physicalStock === 0 ? 'bg-coral-50 text-coral-400' : book.physicalStock <= 2 ? 'bg-amber-50 text-amber-600' : 'bg-mint-50 text-mint-600'"
              >
                {{ book.physicalStock === 0 ? 'Habis' : `${book.physicalStock} eks` }}
              </span>
            </td>
            <td class="px-4 py-3.5 text-center">
              <span v-if="book.digitalAvailable" class="text-mint-500 font-bold">✓</span>
              <span v-else class="text-gray-300">—</span>
            </td>
            <td class="px-4 py-3.5 text-center">
              <span class="badge bg-amber-50 text-amber-600 text-xs">+{{ book.xp }}</span>
            </td>
            <td class="px-4 py-3.5 text-center">
              <div class="flex items-center justify-center gap-1.5">
                <button class="text-xs text-primary-500 hover:text-primary-700 font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors">Edit</button>
                <button class="text-xs text-gray-400 hover:text-gray-600 font-medium px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors">Detail</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredBooks.length === 0" class="text-center py-12 text-gray-400">
        <p class="text-2xl mb-2">📭</p>
        <p class="text-sm">Tidak ada buku yang sesuai filter</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus } from 'lucide-vue-next'
import { useLibraryStore } from '@/stores/library'

const libraryStore = useLibraryStore()
const search = ref('')
const filterCat = ref('')
const categories = ['Sains', 'Sastra', 'Sejarah', 'Teknologi', 'Matematika', 'Sosial']

const filteredBooks = computed(() => {
  let list = libraryStore.books
  if (search.value) list = list.filter(b => b.title.toLowerCase().includes(search.value.toLowerCase()) || b.author.toLowerCase().includes(search.value.toLowerCase()))
  if (filterCat.value) list = list.filter(b => b.category === filterCat.value)
  return list
})

const totalPhysical = computed(() => libraryStore.books.reduce((s, b) => s + b.physicalStock, 0))
const totalDigital = computed(() => libraryStore.books.filter(b => b.digitalAvailable).length)
const outOfStock = computed(() => libraryStore.books.filter(b => b.physicalStock === 0).length)
</script>
