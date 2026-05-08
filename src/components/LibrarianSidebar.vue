<template>
  <aside class="w-60 bg-white border-r border-gray-100 min-h-screen flex flex-col shadow-sm flex-shrink-0">
    <div class="px-5 py-5 border-b border-gray-100">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">L</div>
        <div>
          <p class="font-bold text-gray-800 text-sm">LibraQuest</p>
          <p class="text-[10px] text-gray-400">Pustakawan Panel</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-3 py-4 space-y-0.5">
      <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-2 mb-2">Sirkulasi</p>
      <router-link v-for="item in circulationNav" :key="item.to" :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
        :class="$route.path === item.to ? 'bg-primary-50 text-primary-600 border border-primary-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
        <span class="flex-1">{{ item.label }}</span>
        <span v-if="item.badge" class="bg-red-100 text-red-600 text-[10px] rounded-full px-1.5 py-0.5 font-semibold">{{ item.badge }}</span>
      </router-link>

      <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-2 mt-4 mb-2">Konten & Siswa</p>
      <router-link v-for="item in contentNav" :key="item.to" :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
        :class="$route.path === item.to ? 'bg-primary-50 text-primary-600 border border-primary-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
        <span class="flex-1">{{ item.label }}</span>
        <span v-if="item.badge" class="bg-amber-100 text-amber-700 text-[10px] rounded-full px-1.5 py-0.5 font-semibold">{{ item.badge }}</span>
      </router-link>
    </nav>

    <div class="px-4 py-4 border-t border-gray-100">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-mint-50 rounded-full flex items-center justify-center text-sm">👩‍💼</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-700 truncate">Bu Sari Dewi</p>
          <p class="text-[10px] text-gray-400">Pustakawan</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { ScanLine, Package, ClipboardList, CheckSquare, BarChart2 } from 'lucide-vue-next'
import { useLibraryStore } from '@/stores/library'
import { useContentStore } from '@/stores/content'

const libraryStore = useLibraryStore()
const contentStore = useContentStore()

const overdueCount  = computed(() => libraryStore.borrowLog.filter(l => l.status === 'overdue').length)
const pendingCount  = computed(() => contentStore.pendingArticles.length)

const circulationNav = computed(() => [
  { to: '/librarian/counter',    icon: ScanLine,     label: 'Counter Desk',    badge: null },
  { to: '/librarian/inventory',  icon: Package,      label: 'Inventaris Buku', badge: null },
  { to: '/librarian/borrow-log', icon: ClipboardList, label: 'Log Peminjaman', badge: overdueCount.value || null },
])

const contentNav = computed(() => [
  { to: '/librarian/approve-berita', icon: CheckSquare, label: 'Approve Artikel', badge: pendingCount.value || null },
  { to: '/librarian/peringkat',      icon: BarChart2,   label: 'Peringkat Siswa', badge: null },
])
</script>
