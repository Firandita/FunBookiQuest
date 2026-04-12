<template>
  <aside class="w-60 bg-white border-r border-gray-100 min-h-screen flex flex-col shadow-sm flex-shrink-0">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-gray-100">
      <div class="flex items-center gap-2.5">
        <div class="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">L</div>
        <div>
          <p class="font-bold text-gray-800 text-sm">LibraQuest</p>
          <p class="text-[10px] text-gray-400">Pustakawan Panel</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1">
      <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-2 mb-2">Menu</p>
      <router-link
        v-for="item in navItems" :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
        :class="$route.path === item.to
          ? 'bg-primary-50 text-primary-600 border border-primary-100'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
        {{ item.label }}
        <span v-if="item.badge" class="ml-auto bg-coral-400 text-white text-[10px] rounded-full px-1.5 py-0.5 font-semibold">{{ item.badge }}</span>
      </router-link>
    </nav>

    <!-- Bottom profile -->
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
import { ScanLine, Package, BookMarked, ClipboardList } from 'lucide-vue-next'
import { useLibraryStore } from '@/stores/library'
import { computed } from 'vue'

const libraryStore = useLibraryStore()
const overdueCount = computed(() => libraryStore.borrowLog.filter(l => l.status === 'overdue').length)

const navItems = computed(() => [
  { to: '/librarian/counter',   icon: ScanLine,     label: 'Counter Desk' },
  { to: '/librarian/inventory', icon: Package,      label: 'Inventaris Buku' },
  { to: '/librarian/borrow-log', icon: ClipboardList, label: 'Log Peminjaman', badge: overdueCount.value || null },
])
</script>
