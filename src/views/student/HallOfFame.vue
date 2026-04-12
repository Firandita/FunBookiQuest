<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Hall of Fame</h1>
        <p class="text-gray-400 text-sm mt-0.5">{{ userStore.profile.class }} · {{ userStore.profile.school }}</p>
      </div>
      <div class="flex gap-2">
        <button v-for="p in periods" :key="p.id" @click="activePeriod = p.id"
          class="text-xs px-3 py-2 rounded-xl border font-medium transition-all"
          :class="activePeriod === p.id ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-500 border-gray-200'"
        >{{ p.label }}</button>
      </div>
    </div>

    <!-- Tab switcher: XP vs Borrow -->
    <div class="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit mb-6">
      <button @click="activeRank = 'xp'" class="px-5 py-2 text-sm font-medium rounded-lg transition-all" :class="activeRank === 'xp' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-gray-700'">
        Peringkat XP
      </button>
      <button @click="activeRank = 'borrow'" class="px-5 py-2 text-sm font-medium rounded-lg transition-all" :class="activeRank === 'borrow' ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-gray-700'">
        Peringkat Peminjaman
      </button>
    </div>

    <div class="grid grid-cols-3 gap-6">

      <!-- Left: podium -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col items-center justify-end" style="min-height: 280px">
        <h3 class="font-bold text-gray-700 text-sm mb-6 self-start">Top 3</h3>
        <div class="flex items-end justify-center gap-3 w-full">
          <!-- 2nd -->
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600 border-2 border-gray-200 mb-1">{{ top3[1]?.initials }}</div>
            <p class="text-[10px] font-semibold text-gray-600 text-center truncate w-14">{{ top3[1]?.shortName }}</p>
            <p class="text-[9px] text-gray-400">{{ top3[1]?.score }}</p>
            <div class="w-14 bg-gray-200 rounded-t-lg mt-2 flex items-end justify-center pb-1" style="height:52px">
              <span class="text-gray-500 font-bold">2</span>
            </div>
          </div>
          <!-- 1st -->
          <div class="flex flex-col items-center -translate-y-2">
            <div class="w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center text-base font-bold text-white border-2 border-amber-300 mb-1 shadow">{{ top3[0]?.initials }}</div>
            <p class="text-[10px] font-bold text-gray-700 text-center truncate w-16">{{ top3[0]?.shortName }}</p>
            <p class="text-[9px] text-amber-600 font-semibold">{{ top3[0]?.score }}</p>
            <div class="w-16 bg-amber-400 rounded-t-lg mt-2 flex items-end justify-center pb-1" style="height:72px">
              <span class="text-amber-800 font-bold text-lg">1</span>
            </div>
          </div>
          <!-- 3rd -->
          <div class="flex flex-col items-center">
            <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-sm font-bold text-amber-700 border-2 border-amber-200 mb-1">{{ top3[2]?.initials }}</div>
            <p class="text-[10px] font-semibold text-gray-600 text-center truncate w-14">{{ top3[2]?.shortName }}</p>
            <p class="text-[9px] text-gray-400">{{ top3[2]?.score }}</p>
            <div class="w-14 bg-amber-200 rounded-t-lg mt-2 flex items-end justify-center pb-1" style="height:40px">
              <span class="text-amber-700 font-bold">3</span>
            </div>
          </div>
        </div>

        <!-- Reward info -->
        <div class="mt-5 w-full bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
          <p class="text-xs font-semibold text-amber-700">Hadiah Bulan Ini</p>
          <p class="text-[10px] text-amber-600 mt-0.5">Top 3: Voucher koperasi + Sertifikat Literasi</p>
        </div>
      </div>

      <!-- Right: full table (2 cols) -->
      <div class="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-800 text-sm">{{ activeRank === 'xp' ? 'Peringkat XP' : 'Peringkat Peminjaman Terbanyak' }}</h3>
          <span class="text-xs text-gray-400">{{ currentBoard.length }} siswa</span>
        </div>
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">#</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Siswa</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Level</th>
              <th class="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{{ activeRank === 'xp' ? 'XP' : 'Buku Dipinjam' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(entry, i) in currentBoard" :key="entry.id || entry.studentId"
              class="transition-colors"
              :class="entry.isMe ? 'bg-primary-50' : 'hover:bg-gray-50'"
            >
              <td class="px-5 py-3">
                <span v-if="i < 3" class="text-base">{{ ['🥇','🥈','🥉'][i] }}</span>
                <span v-else class="text-sm font-bold text-gray-400">{{ i + 1 }}</span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    :class="entry.isMe ? 'bg-primary-500' : 'bg-gray-400'">
                    {{ entry.initials || entry.avatar }}
                  </div>
                  <div>
                    <div class="flex items-center gap-1.5">
                      <p class="font-semibold text-gray-800 text-sm">{{ entry.name }}</p>
                      <span v-if="entry.isMe" class="text-[10px] bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full">Kamu</span>
                    </div>
                    <p class="text-[10px] text-gray-400">{{ entry.class }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="text-xs text-gray-500">Lv.{{ entry.level }}</span>
              </td>
              <td class="px-5 py-3 text-right">
                <p class="font-bold text-primary-500">{{ activeRank === 'xp' ? entry.xp.toLocaleString() + ' XP' : entry.totalBorrowed + ' buku' }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useLibraryStore } from '@/stores/library'

const userStore = useUserStore()
const libraryStore = useLibraryStore()

const activePeriod = ref('month')
const activeRank = ref('xp')

const periods = [
  { id: 'month', label: 'Bulan Ini' },
  { id: 'semester', label: 'Semester' },
  { id: 'all', label: 'All Time' },
]

const xpBoard = computed(() => [
  { id: 1, name: 'Andini Safitri',    initials: 'AS', shortName: 'Andini', class: 'XI IPA 2', level: 6, xp: 3820, isMe: false },
  { id: 2, name: 'Bagas Firmansyah',  initials: 'BF', shortName: 'Bagas',  class: 'XI IPA 2', level: 5, xp: 3110, isMe: false },
  { id: 3, name: 'Citra Handayani',   initials: 'CH', shortName: 'Citra',  class: 'XI IPA 2', level: 5, xp: 2990, isMe: false },
  { id: 4, name: 'Dian Pratama',      initials: 'DP', shortName: 'Dian',   class: 'XI IPA 2', level: 4, xp: 2680, isMe: false },
  { id: 5, name: userStore.profile.name, initials: userStore.profile.name.split(' ').map(w=>w[0]).join(''), shortName: userStore.profile.name.split(' ')[0], class: 'XI IPA 2', level: userStore.profile.level, xp: userStore.profile.xp, isMe: true },
  { id: 6, name: 'Fadli Ramadhan',    initials: 'FR', shortName: 'Fadli',  class: 'XI IPA 2', level: 4, xp: 2100, isMe: false },
  { id: 7, name: 'Gita Puspita',      initials: 'GP', shortName: 'Gita',   class: 'XI IPA 2', level: 3, xp: 1850, isMe: false },
  { id: 8, name: 'Hendra Wijaya',     initials: 'HW', shortName: 'Hendra', class: 'XI IPA 2', level: 3, xp: 1440, isMe: false },
])

const borrowBoard = computed(() =>
  libraryStore.borrowRanking.map(r => ({
    ...r,
    initials: r.avatar,
    shortName: r.name.split(' ')[0],
    level: 4,
    xp: 0,
  }))
)

const currentBoard = computed(() => activeRank.value === 'xp' ? xpBoard.value : borrowBoard.value)
const top3 = computed(() => currentBoard.value.slice(0, 3))
</script>
