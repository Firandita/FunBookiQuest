<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Stats</h1>
      <p class="text-gray-400 text-sm mt-0.5">Statistik dan pencapaian membacamu</p>
    </div>

    <div class="grid grid-cols-3 gap-6">

      <!-- Left column -->
      <div class="space-y-5">

        <!-- Streak card -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-bold text-gray-800 text-sm mb-4">Reading Streak</h3>
          <div class="flex items-center justify-around mb-4">
            <div class="text-center">
              <p class="text-3xl font-bold text-orange-500">{{ userStore.profile.streak }}</p>
              <p class="text-xs text-gray-400 mt-0.5">hari berturut</p>
            </div>
            <div class="w-px h-10 bg-gray-100"></div>
            <div class="text-center">
              <p class="text-3xl font-bold text-primary-500">28</p>
              <p class="text-xs text-gray-400 mt-0.5">rekor terbaik</p>
            </div>
          </div>
          <!-- Week -->
          <div class="flex gap-1.5 justify-between">
            <div v-for="d in weekDays" :key="d.label" class="flex-1 flex flex-col items-center gap-1">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center text-[9px]"
                :class="d.active ? 'bg-orange-100 text-orange-600 font-bold' : 'bg-gray-100 text-gray-400'">
                {{ d.active ? '✓' : '' }}
              </div>
              <span class="text-[9px] text-gray-400">{{ d.label }}</span>
            </div>
          </div>
        </div>

        <!-- Buku per bulan -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-bold text-gray-800 text-sm mb-4">Buku Selesai per Bulan</h3>
          <div class="flex items-end gap-2 h-24">
            <div v-for="m in monthlyData" :key="m.label" class="flex-1 flex flex-col items-center gap-1">
              <span class="text-[10px] text-gray-500 font-medium">{{ m.val }}</span>
              <div class="w-full bg-primary-400 rounded-sm transition-all duration-700"
                :style="{ height: (m.val / maxMonth * 56) + 'px' }"></div>
              <span class="text-[9px] text-gray-400">{{ m.label }}</span>
            </div>
          </div>
        </div>

        <!-- Reading time -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-bold text-gray-800 text-sm mb-3">Waktu Membaca</h3>
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-primary-50 rounded-xl p-3 text-center">
              <p class="text-xl font-bold text-primary-500">42</p>
              <p class="text-[10px] text-primary-400">Jam bulan ini</p>
            </div>
            <div class="bg-mint-50 rounded-xl p-3 text-center">
              <p class="text-xl font-bold text-mint-600">1.4</p>
              <p class="text-[10px] text-mint-500">Rata-rata/hari</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Middle column -->
      <div class="space-y-5">

        <!-- Genre radar -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-bold text-gray-800 text-sm mb-4">Genre yang Dibaca</h3>
          <div class="space-y-3">
            <div v-for="g in genreStats" :key="g.name">
              <div class="flex justify-between text-xs mb-1">
                <span class="font-medium text-gray-600">{{ g.name }}</span>
                <span class="text-gray-400">{{ g.books }} buku</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-1000" :class="g.color" :style="{ width: g.pct + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reward store -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800 text-sm">Tukar Reward</h3>
            <span class="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">{{ userStore.profile.xp.toLocaleString() }} XP</span>
          </div>
          <div class="space-y-2">
            <div v-for="r in rewards" :key="r.name" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span class="text-xl">{{ r.icon }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-700">{{ r.name }}</p>
                <p class="text-[10px] text-gray-400 truncate">{{ r.desc }}</p>
              </div>
              <button
                class="text-xs px-3 py-1.5 rounded-xl font-semibold flex-shrink-0 transition-all"
                :class="userStore.profile.xp >= r.cost ? 'bg-primary-500 text-white hover:bg-primary-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                :disabled="userStore.profile.xp < r.cost"
              >{{ r.cost }} XP</button>
            </div>
          </div>
        </div>

      </div>

      <!-- Right column: Badges -->
      <div>
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-bold text-gray-800 text-sm mb-4">Koleksi Badge</h3>
          <div class="grid grid-cols-3 gap-3">
            <div v-for="badge in badges" :key="badge.name" class="flex flex-col items-center gap-1.5">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all"
                :class="badge.earned ? 'border-amber-200 bg-amber-50 shadow-sm' : 'border-gray-100 bg-gray-50 opacity-30'">
                {{ badge.icon }}
              </div>
              <p class="text-[9px] text-center text-gray-500 leading-tight">{{ badge.name }}</p>
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

const userStore = useUserStore()
const libraryStore = useLibraryStore()

const weekDays = [
  { label: 'Sen', active: true }, { label: 'Sel', active: true }, { label: 'Rab', active: true },
  { label: 'Kam', active: true }, { label: 'Jum', active: true }, { label: 'Sab', active: true },
  { label: 'Min', active: false },
]

const genreStats = [
  { name: 'Sains',     books: 5, pct: 75, color: 'bg-primary-400' },
  { name: 'Teknologi', books: 4, pct: 60, color: 'bg-mint-400'    },
  { name: 'Sejarah',   books: 3, pct: 45, color: 'bg-amber-400'   },
  { name: 'Sastra',    books: 2, pct: 30, color: 'bg-red-300'     },
  { name: 'Sosial',    books: 1, pct: 15, color: 'bg-gray-300'    },
]

const badges = [
  { name: 'Pembaca Perdana', icon: '📖', earned: true  },
  { name: 'Pembaca Gila',   icon: '🔥', earned: true  },
  { name: 'Bintang Kelas',  icon: '⭐', earned: true  },
  { name: 'Sains Lover',    icon: '🔬', earned: true  },
  { name: 'Sastrawan',      icon: '✍️', earned: true  },
  { name: 'Tech Geek',      icon: '💻', earned: true  },
  { name: 'Maestro',        icon: '👑', earned: false },
  { name: '50 Buku',        icon: '🚀', earned: false },
  { name: 'Top Borrower',   icon: '🏆', earned: false },
]

const monthlyData = [
  { label: 'Nov', val: 2 }, { label: 'Des', val: 3 }, { label: 'Jan', val: 4 },
  { label: 'Feb', val: 3 }, { label: 'Mar', val: 5 }, { label: 'Apr', val: 3 },
]
const maxMonth = computed(() => Math.max(...monthlyData.map(m => m.val)))

const rewards = [
  { icon: '📝', name: 'Nilai Tambahan +5',    desc: '1 mata pelajaran pilihan',    cost: 500  },
  { icon: '🛒', name: 'Voucher Koperasi',      desc: 'Rp5.000 di koperasi sekolah', cost: 800  },
  { icon: '🏆', name: 'Sertifikat Literasi',   desc: 'Sertifikat resmi sekolah',    cost: 1500 },
  { icon: '📌', name: 'Prioritas Pinjam Buku', desc: 'Antrian terdepan buku baru',  cost: 300  },
]
</script>
