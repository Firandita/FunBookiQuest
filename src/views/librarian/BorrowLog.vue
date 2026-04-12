<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">📋 Log Peminjaman</h1>
        <p class="text-gray-400 text-sm mt-1">Riwayat lengkap semua transaksi peminjaman</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="f in filters" :key="f.id"
          @click="activeFilter = f.id"
          class="text-xs px-3 py-2 rounded-xl font-medium border transition-all"
          :class="activeFilter === f.id ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-500 border-gray-200 hover:border-primary-300'"
        >{{ f.label }} ({{ f.count }})</button>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Siswa</th>
            <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Buku</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal Pinjam</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Batas Kembali</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="log in filteredLog" :key="log.id"
            class="hover:bg-gray-50 transition-colors"
            :class="log.status === 'overdue' ? 'bg-coral-50/50' : ''"
          >
            <td class="px-5 py-3.5">
              <p class="font-semibold text-gray-800">{{ log.studentName }}</p>
              <p class="text-xs text-gray-400 font-mono">{{ log.studentId }}</p>
            </td>
            <td class="px-4 py-3.5">
              <p class="font-medium text-gray-700">{{ log.bookTitle }}</p>
              <p class="text-xs text-gray-400">{{ log.bookId }}</p>
            </td>
            <td class="px-4 py-3.5 text-center text-xs text-gray-600">{{ log.borrowedAt }}</td>
            <td class="px-4 py-3.5 text-center text-xs font-medium" :class="log.status === 'overdue' ? 'text-coral-400' : 'text-gray-600'">
              {{ log.dueDate }}
            </td>
            <td class="px-4 py-3.5 text-center">
              <span class="badge text-[10px]" :class="statusClass(log.status)">{{ statusLabel(log.status) }}</span>
            </td>
            <td class="px-4 py-3.5 text-center">
              <button
                v-if="log.status !== 'returned'"
                @click="processReturn(log.id)"
                class="text-xs px-3 py-1.5 rounded-xl font-medium transition-all"
                :class="log.status === 'overdue' ? 'bg-coral-50 text-coral-600 hover:bg-coral-100' : 'bg-mint-50 text-mint-700 hover:bg-mint-100'"
              >Proses Kembali</button>
              <span v-else class="text-xs text-gray-300">—</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredLog.length === 0" class="text-center py-12 text-gray-400">
        <p class="text-2xl mb-2">📋</p>
        <p class="text-sm">Tidak ada data dengan filter ini</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLibraryStore } from '@/stores/library'

const libraryStore = useLibraryStore()
const activeFilter = ref('all')

const filters = computed(() => [
  { id: 'all',      label: 'Semua',      count: libraryStore.borrowLog.length },
  { id: 'active',   label: 'Aktif',      count: libraryStore.borrowLog.filter(l=>l.status==='active').length },
  { id: 'overdue',  label: 'Terlambat',  count: libraryStore.borrowLog.filter(l=>l.status==='overdue').length },
  { id: 'returned', label: 'Dikembalikan', count: libraryStore.borrowLog.filter(l=>l.status==='returned').length },
])

const filteredLog = computed(() => {
  if (activeFilter.value === 'all') return libraryStore.borrowLog
  return libraryStore.borrowLog.filter(l => l.status === activeFilter.value)
})

function statusLabel(s) {
  return { active: '📖 Dipinjam', overdue: '⚠️ Terlambat', returned: '✅ Dikembalikan' }[s] || s
}
function statusClass(s) {
  return {
    active: 'bg-primary-50 text-primary-600',
    overdue: 'bg-coral-50 text-coral-400',
    returned: 'bg-mint-50 text-mint-600',
  }[s] || 'bg-gray-100 text-gray-500'
}

function processReturn(id) {
  libraryStore.processReturn(id)
}
</script>
