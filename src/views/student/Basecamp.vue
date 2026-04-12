<template>
  <div class="p-8 min-h-screen bg-gray-50">

    <!-- Top header bar -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Selamat datang, {{ user.name.split(' ')[0] }}! 👋</h1>
        <p class="text-gray-400 text-sm mt-0.5">{{ todayStr }} · Ayo lanjutkan petualangan membacamu!</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-xs text-gray-400">Streak</p>
          <p class="font-bold text-orange-500 text-lg">🔥 {{ user.streak }} hari</p>
        </div>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Level</p>
        <p class="text-2xl font-bold text-primary-500">{{ user.level }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ user.title }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Total XP</p>
        <p class="text-2xl font-bold text-gray-800">{{ user.xp.toLocaleString() }}</p>
        <p class="text-xs text-gray-400 mt-0.5">{{ user.xpToNext - user.xp }} XP ke Level {{ user.level + 1 }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Buku Selesai</p>
        <p class="text-2xl font-bold text-gray-800">{{ libraryStore.completedBooks.length }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Bulan ini: 3 buku</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Badge Diraih</p>
        <p class="text-2xl font-bold text-amber-500">7</p>
        <p class="text-xs text-gray-400 mt-0.5">3 badge lagi</p>
      </div>
    </div>

    <!-- XP Progress bar -->
    <div class="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold text-sm text-gray-700">Progres Level {{ user.level }} → {{ user.level + 1 }}</span>
        <span class="text-sm text-gray-400">{{ user.xp }} / {{ user.xpToNext }} XP</span>
      </div>
      <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-primary-500 rounded-full transition-all duration-1000"
          :style="{ width: userStore.xpPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Two column: Active missions + Completed -->
    <div class="grid grid-cols-3 gap-6">

      <!-- Active missions (2/3) -->
      <div class="col-span-2">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-bold text-gray-800">Misi Aktif</h2>
          <router-link to="/archive" class="text-xs text-primary-500 font-medium hover:underline">Lihat semua</router-link>
        </div>

        <div v-if="libraryStore.activeBooks.length === 0" class="bg-white rounded-2xl border border-gray-100 p-10 text-center shadow-sm">
          <p class="text-gray-400 text-sm">Belum ada buku aktif</p>
          <router-link to="/discovery" class="btn-primary inline-block mt-3 text-sm px-4 py-2">Cari Buku</router-link>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="entry in libraryStore.activeBooks" :key="entry.bookId"
            class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm border-l-4"
            :class="entry.type === 'digital' ? 'border-l-primary-500' : 'border-l-mint-400'"
          >
            <div class="flex gap-4">
              <!-- Cover -->
              <div class="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <BookCover :book-id="entry.book.id" :title="entry.book.title" :category="entry.book.category" class-name="w-full h-full" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div>
                    <p class="font-semibold text-gray-800 leading-snug">{{ entry.book.title }}</p>
                    <p class="text-sm text-gray-400 mt-0.5">{{ entry.book.author }}</p>
                  </div>
                  <span
                    class="text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0"
                    :class="entry.type === 'digital' ? 'bg-primary-50 text-primary-500' : 'bg-mint-50 text-mint-600'"
                  >{{ entry.type === 'digital' ? 'Digital' : 'Fisik' }}</span>
                </div>

                <!-- Digital progress -->
                <template v-if="entry.type === 'digital'">
                  <div class="mt-3">
                    <div class="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>Halaman dibaca</span>
                      <span>{{ entry.currentPage }} / {{ entry.book.pages }}</span>
                    </div>
                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div class="h-full bg-primary-400 rounded-full transition-all" :style="{ width: (entry.currentPage / entry.book.pages * 100) + '%' }"></div>
                    </div>
                  </div>
                  <div class="mt-3 flex gap-2">
                    <button @click="continueReading(entry)" class="btn-primary text-xs px-4 py-2">Lanjut Baca</button>
                    <button @click="finishDigital(entry)" class="btn-outline text-xs px-4 py-2">Tandai Selesai</button>
                  </div>
                </template>

                <!-- Physical info -->
                <template v-else>
                  <div class="mt-3 flex gap-4 text-sm">
                    <div>
                      <p class="text-xs text-gray-400">Dipinjam</p>
                      <p class="font-medium text-gray-700">{{ formatDate(entry.borrowedAt) }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-400">Batas kembali</p>
                      <p class="font-medium" :class="isOverdue(entry.dueDate) ? 'text-red-500' : 'text-gray-700'">
                        {{ formatDate(entry.dueDate) }}{{ isOverdue(entry.dueDate) ? ' (Terlambat)' : '' }}
                      </p>
                    </div>
                  </div>
                  <button @click="libraryStore.triggerQuestAI(entry)" class="btn-primary mt-3 text-xs px-4 py-2">
                    Selesai Baca &amp; Ikuti Kuis
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recently completed (1/3) -->
      <div>
        <h2 class="font-bold text-gray-800 mb-3">Baru Diselesaikan</h2>
        <div v-if="libraryStore.completedBooks.length === 0" class="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm text-gray-400 text-sm">
          Belum ada
        </div>
        <div v-else class="space-y-2.5">
          <div
            v-for="entry in libraryStore.completedBooks.slice(0,4)" :key="entry.bookId"
            class="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm flex gap-3"
          >
            <div class="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <BookCover :book-id="entry.book.id" :title="entry.book.title" :category="entry.book.category" class-name="w-full h-full" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-700 line-clamp-2 leading-snug">{{ entry.book.title }}</p>
              <p class="text-[10px] text-gray-400 mt-1">Skor: {{ entry.score }}%</p>
              <p class="text-xs font-bold text-amber-500 mt-0.5">+{{ entry.xpEarned }} XP</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLibraryStore } from '@/stores/library'
import BookCover from '@/components/BookCover.vue'

const userStore = useUserStore()
const libraryStore = useLibraryStore()
const user = computed(() => userStore.profile)

const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
function isOverdue(d) { return d && new Date(d) < new Date() }

function continueReading(entry) {
  entry.currentPage = Math.min(entry.currentPage + 50, entry.book.pages)
}
function finishDigital(entry) {
  entry.currentPage = entry.book.pages
  libraryStore.triggerQuestAI(entry)
}
</script>
