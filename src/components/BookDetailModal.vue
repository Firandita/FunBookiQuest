<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="libraryStore.closeBook">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style="max-height:90vh;overflow-y:auto">
        <div class="flex gap-6 p-6">

          <!-- Cover -->
          <div class="w-44 flex-shrink-0">
            <div class="w-44 h-60 rounded-xl overflow-hidden bg-gray-100 shadow">
              <BookCover :book-id="book.id" :title="book.title" :category="book.category" class-name="w-full h-full" />
            </div>
            <!-- XP badge -->
            <div class="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
              <p class="text-xs text-amber-600">Hadiah baca</p>
              <p class="text-2xl font-bold text-amber-500">+{{ book.xp }}</p>
              <p class="text-xs text-amber-500">XP</p>
            </div>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-3 mb-1">
              <h2 class="text-xl font-bold text-gray-800 leading-snug">{{ book.title }}</h2>
              <button @click="libraryStore.closeBook" class="text-gray-300 hover:text-gray-500 flex-shrink-0">
                <X class="w-5 h-5" />
              </button>
            </div>
            <p class="text-gray-500 text-sm mb-3">{{ book.author }}</p>

            <!-- Chips -->
            <div class="flex gap-2 flex-wrap mb-4">
              <span class="text-xs px-3 py-1 bg-primary-50 text-primary-600 rounded-full font-medium">{{ book.category }}</span>
              <span class="text-xs px-3 py-1 bg-gray-100 text-gray-500 rounded-full">{{ book.year }}</span>
              <span class="text-xs px-3 py-1 rounded-full font-medium" :class="book.physicalStock > 0 ? 'bg-mint-50 text-mint-600' : 'bg-red-50 text-red-400'">
                Stok fisik: {{ book.physicalStock > 0 ? book.physicalStock + ' eks' : 'Habis' }}
              </span>
              <span v-if="book.digitalAvailable" class="text-xs px-3 py-1 bg-blue-50 text-blue-500 rounded-full">Digital tersedia</span>
            </div>

            <p class="text-sm text-gray-600 leading-relaxed mb-4">{{ book.description }}</p>

            <!-- Detail grid -->
            <div class="grid grid-cols-2 gap-2 mb-5 text-sm">
              <div class="bg-gray-50 rounded-xl p-3">
                <p class="text-xs text-gray-400 mb-0.5">Penerbit</p>
                <p class="font-medium text-gray-700">{{ book.publisher }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <p class="text-xs text-gray-400 mb-0.5">Lokasi Rak</p>
                <p class="font-medium text-gray-700">{{ book.rack }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <p class="text-xs text-gray-400 mb-0.5">Jumlah Halaman</p>
                <p class="font-medium text-gray-700">{{ book.pages }} halaman</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <p class="text-xs text-gray-400 mb-0.5">ID Buku</p>
                <p class="font-mono font-medium text-gray-700">{{ book.id }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                v-if="book.digitalAvailable"
                @click="libraryStore.startDigitalRead(book)"
                class="flex-1 btn-primary py-2.5 text-sm"
              >Baca Digital</button>
              <button
                @click="libraryStore.borrowPhysical(book)"
                :disabled="book.physicalStock === 0"
                class="flex-1 btn-outline py-2.5 text-sm"
                :class="book.physicalStock === 0 ? 'opacity-40 cursor-not-allowed' : ''"
              >Pinjam Fisik</button>
              <button
                @click="libraryStore.toggleSave(book)"
                class="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                :class="libraryStore.isSaved(book.id)
                  ? 'bg-amber-50 border-amber-200 text-amber-600'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'"
                :title="libraryStore.isSaved(book.id) ? 'Hapus dari simpanan' : 'Simpan buku'"
              >{{ libraryStore.isSaved(book.id) ? 'Tersimpan' : 'Simpan' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useLibraryStore } from '@/stores/library'
import BookCover from '@/components/BookCover.vue'

const libraryStore = useLibraryStore()
const book = computed(() => libraryStore.selectedBook)
</script>
