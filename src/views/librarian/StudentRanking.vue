<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Peringkat Siswa</h1>
        <p class="text-gray-400 text-sm mt-0.5">Pantau aktivitas literasi seluruh siswa secara rinci</p>
      </div>
      <div class="flex gap-2">
        <button v-for="t in sortOptions" :key="t.id" @click="sortBy = t.id"
          class="text-xs px-3 py-2 rounded-xl border font-medium transition-all"
          :class="sortBy === t.id ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-500 border-gray-200'"
        >{{ t.label }}</button>
      </div>
    </div>

    <!-- Summary stats -->
    <div class="grid grid-cols-5 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <p class="text-2xl font-bold text-gray-800">{{ contentStore.studentStats.length }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Total Siswa</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <p class="text-2xl font-bold text-primary-500">{{ totalXP.toLocaleString() }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Total XP Kelas</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <p class="text-2xl font-bold text-mint-600">{{ totalBooks }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Buku Dibaca</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <p class="text-2xl font-bold text-amber-500">{{ activeStudents }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Aktif Minggu Ini</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <p class="text-2xl font-bold text-red-400">{{ inactiveStudents }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Tidak Aktif</p>
      </div>
    </div>

    <!-- Top 3 highlight -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div v-for="(s, i) in sortedStats.slice(0, 3)" :key="s.id"
        class="bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3"
        :class="i === 0 ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'"
      >
        <span class="text-2xl flex-shrink-0">{{ ['🥇','🥈','🥉'][i] }}</span>
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          :class="['bg-amber-400','bg-gray-400','bg-amber-200'][i]">
          {{ s.avatar }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-gray-800 text-sm truncate">{{ s.name }}</p>
          <p class="text-xs text-gray-400">{{ s.class }}</p>
          <p class="text-xs font-semibold text-primary-500 mt-0.5">{{ currentSortValue(s) }}</p>
        </div>
      </div>
    </div>

    <!-- Full ranking table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">#</th>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Siswa</th>
            <th class="text-center px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Level</th>
            <th class="text-center px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Total XP</th>
            <th class="text-center px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Buku Selesai</th>
            <th class="text-center px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Pinjaman</th>
            <th class="text-center px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Artikel</th>
            <th class="text-center px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Festival</th>
            <th class="text-center px-3 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Streak</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="(s, i) in sortedStats" :key="s.id"
            class="hover:bg-gray-50 transition-colors"
            :class="s.isMe ? 'bg-primary-50/50' : ''"
          >
            <td class="px-4 py-3.5 text-center">
              <span v-if="i < 3" class="text-lg">{{ ['🥇','🥈','🥉'][i] }}</span>
              <span v-else class="text-sm font-bold text-gray-400">{{ i + 1 }}</span>
            </td>
            <td class="px-5 py-3.5">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  :class="activityColor(s)">
                  {{ s.avatar }}
                </div>
                <div>
                  <p class="font-semibold text-gray-800 text-sm">{{ s.name }}</p>
                  <p class="text-[10px] text-gray-400">{{ s.class }} · {{ s.id }}</p>
                </div>
              </div>
            </td>
            <td class="px-3 py-3.5 text-center">
              <span class="badge bg-primary-50 text-primary-600 text-xs">Lv.{{ s.level }}</span>
            </td>
            <td class="px-3 py-3.5 text-center font-bold text-primary-500 text-sm">
              {{ s.xp.toLocaleString() }}
            </td>
            <td class="px-3 py-3.5 text-center text-sm text-gray-700 font-medium">{{ s.booksRead }}</td>
            <td class="px-3 py-3.5 text-center text-sm text-gray-700 font-medium">{{ s.borrowCount }}</td>
            <td class="px-3 py-3.5 text-center">
              <span class="text-sm font-medium" :class="s.articlesWritten > 0 ? 'text-mint-600' : 'text-gray-300'">
                {{ s.articlesWritten }}
              </span>
            </td>
            <td class="px-3 py-3.5 text-center">
              <span class="text-sm font-medium" :class="s.festivalEntries > 0 ? 'text-amber-500' : 'text-gray-300'">
                {{ s.festivalEntries }}
              </span>
            </td>
            <td class="px-3 py-3.5 text-center">
              <div class="flex items-center justify-center gap-1">
                <span class="text-sm font-bold" :class="s.streak >= 7 ? 'text-orange-500' : s.streak >= 3 ? 'text-amber-500' : 'text-gray-400'">
                  {{ s.streak }}
                </span>
                <span v-if="s.streak >= 7" class="text-xs">🔥</span>
              </div>
            </td>
            <td class="px-4 py-3.5 text-center">
              <span class="badge text-[10px]" :class="activityBadge(s.lastActive)">
                {{ activityLabel(s.lastActive) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-6 mt-4 text-xs text-gray-400">
      <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-mint-400"></div> Aktif hari ini</div>
      <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-primary-400"></div> Aktif minggu ini</div>
      <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-amber-400"></div> Aktif bulan ini</div>
      <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-full bg-gray-300"></div> Tidak aktif</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContentStore } from '@/stores/content'

const contentStore = useContentStore()
const sortBy = ref('xp')

const sortOptions = [
  { id: 'xp',       label: 'XP Tertinggi'    },
  { id: 'books',    label: 'Buku Terbanyak'  },
  { id: 'borrow',   label: 'Pinjaman'         },
  { id: 'articles', label: 'Artikel'          },
  { id: 'streak',   label: 'Streak'           },
]

const sortedStats = computed(() => {
  const list = [...contentStore.studentStats]
  const key = { xp:'xp', books:'booksRead', borrow:'borrowCount', articles:'articlesWritten', streak:'streak' }[sortBy.value]
  return list.sort((a,b) => b[key] - a[key])
})

const totalXP      = computed(() => contentStore.studentStats.reduce((s,x) => s + x.xp, 0))
const totalBooks   = computed(() => contentStore.studentStats.reduce((s,x) => s + x.booksRead, 0))
const activeStudents   = computed(() => contentStore.studentStats.filter(s => daysSince(s.lastActive) <= 7).length)
const inactiveStudents = computed(() => contentStore.studentStats.filter(s => daysSince(s.lastActive) > 14).length)

function daysSince(date) {
  return Math.floor((new Date() - new Date(date)) / 86400000)
}

function activityColor(s) {
  const d = daysSince(s.lastActive)
  if (d === 0) return 'bg-mint-400'
  if (d <= 7)  return 'bg-primary-400'
  if (d <= 30) return 'bg-amber-400'
  return 'bg-gray-300'
}

function activityLabel(date) {
  const d = daysSince(date)
  if (d === 0) return 'Hari ini'
  if (d <= 7)  return `${d}h lalu`
  if (d <= 30) return `${d}h lalu`
  return 'Tidak aktif'
}

function activityBadge(date) {
  const d = daysSince(date)
  if (d === 0) return 'bg-mint-50 text-mint-600'
  if (d <= 7)  return 'bg-primary-50 text-primary-600'
  if (d <= 30) return 'bg-amber-50 text-amber-600'
  return 'bg-gray-100 text-gray-400'
}

function currentSortValue(s) {
  const map = { xp: `${s.xp.toLocaleString()} XP`, books: `${s.booksRead} buku`, borrow: `${s.borrowCount} pinjaman`, articles: `${s.articlesWritten} artikel`, streak: `${s.streak} hari streak` }
  return map[sortBy.value]
}
</script>
