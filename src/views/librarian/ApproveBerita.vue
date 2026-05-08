<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Approve Artikel</h1>
        <p class="text-gray-400 text-sm mt-0.5">Review dan moderasi artikel yang dikirim siswa</p>
      </div>
      <div class="flex gap-2">
        <button v-for="t in statusTabs" :key="t.id" @click="activeTab = t.id"
          class="text-xs px-4 py-2 rounded-xl border font-medium transition-all"
          :class="activeTab === t.id ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-500 border-gray-200'"
        >
          {{ t.label }}
          <span v-if="t.count" class="ml-1.5 bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">{{ t.count }}</span>
        </button>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <p class="text-2xl font-bold text-amber-500">{{ contentStore.pendingArticles.length }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Menunggu Review</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <p class="text-2xl font-bold text-mint-600">{{ contentStore.approvedArticles.length }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Disetujui</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <p class="text-2xl font-bold text-gray-800">{{ totalViews.toLocaleString() }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Total Tayangan</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <p class="text-2xl font-bold text-red-400">{{ totalLikes }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Total Likes</p>
      </div>
    </div>

    <!-- Article list — YouTube Studio style -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Artikel</th>
            <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Penulis</th>
            <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Buku</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Tanggal</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="art in displayedArticles" :key="art.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-start gap-3">
                <!-- Thumbnail -->
                <div class="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <BookCover :book-id="art.bookId" :title="art.bookTitle" :category="''" class-name="w-full h-full" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-800 line-clamp-2 leading-snug">{{ art.title }}</p>
                  <p class="text-xs text-gray-400 mt-1 line-clamp-2">{{ art.content.substring(0, 80) }}...</p>
                  <div class="flex items-center gap-3 mt-1.5 text-[10px] text-gray-400">
                    <span>👁 {{ art.views }}</span>
                    <span>❤️ {{ art.likes }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4">
              <p class="font-medium text-gray-700 text-sm">{{ art.authorName }}</p>
              <p class="text-xs text-gray-400">{{ art.authorClass }}</p>
            </td>
            <td class="px-4 py-4">
              <p class="text-xs font-medium text-gray-600">{{ art.bookTitle }}</p>
            </td>
            <td class="px-4 py-4 text-center text-xs text-gray-500">{{ art.createdAt }}</td>
            <td class="px-4 py-4 text-center">
              <span class="badge text-[10px]" :class="statusClass(art.status)">{{ statusLabel(art.status) }}</span>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center justify-center gap-2">
                <button @click="preview = art" class="text-xs text-primary-500 hover:text-primary-700 font-medium px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors">
                  Baca
                </button>
                <template v-if="art.status === 'pending'">
                  <button @click="contentStore.approveArticle(art.id)" class="text-xs bg-mint-50 text-mint-700 border border-mint-200 px-3 py-1.5 rounded-lg font-medium hover:bg-mint-100 transition-colors">
                    Setujui
                  </button>
                  <button @click="contentStore.rejectArticle(art.id)" class="text-xs bg-red-50 text-red-500 border border-red-100 px-3 py-1.5 rounded-lg font-medium hover:bg-red-100 transition-colors">
                    Tolak
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="displayedArticles.length === 0" class="text-center py-12 text-gray-400">
        <p class="text-2xl mb-2">📭</p>
        <p class="text-sm">Tidak ada artikel dengan status ini</p>
      </div>
    </div>

    <!-- Preview modal -->
    <Teleport to="body">
      <div v-if="preview" class="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="preview = null">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style="max-height:90vh;overflow-y:auto">
          <div class="bg-primary-500 px-6 py-5 relative">
            <button @click="preview = null" class="absolute top-4 right-4 text-white/70 hover:text-white"><X class="w-5 h-5" /></button>
            <p class="text-primary-200 text-xs mb-1">{{ preview.authorName }} · {{ preview.authorClass }}</p>
            <h2 class="text-white font-bold text-xl">{{ preview.title }}</h2>
            <p class="text-primary-200 text-xs mt-1">Buku: {{ preview.bookTitle }}</p>
          </div>
          <div class="p-6">
            <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-6">{{ preview.content }}</p>
            <div v-if="preview.status === 'pending'" class="flex gap-3 pt-4 border-t border-gray-100">
              <button @click="contentStore.approveArticle(preview.id); preview = null" class="flex-1 bg-mint-400 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-mint-600 transition-colors">
                Setujui & Publikasikan
              </button>
              <button @click="contentStore.rejectArticle(preview.id); preview = null" class="flex-1 bg-red-50 text-red-500 border border-red-100 rounded-xl py-2.5 text-sm font-semibold hover:bg-red-100 transition-colors">
                Tolak
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useContentStore } from '@/stores/content'
import BookCover from '@/components/BookCover.vue'

const contentStore = useContentStore()
const activeTab = ref('pending')
const preview = ref(null)

const statusTabs = computed(() => [
  { id: 'pending',  label: 'Menunggu Review', count: contentStore.pendingArticles.length },
  { id: 'approved', label: 'Disetujui',        count: null },
  { id: 'rejected', label: 'Ditolak',           count: null },
])

const displayedArticles = computed(() =>
  contentStore.articles.filter(a => a.status === activeTab.value)
)

const totalViews = computed(() => contentStore.approvedArticles.reduce((s,a) => s + a.views, 0))
const totalLikes = computed(() => contentStore.approvedArticles.reduce((s,a) => s + a.likes, 0))

function statusLabel(s) { return { pending: 'Menunggu', approved: 'Disetujui', rejected: 'Ditolak' }[s] || s }
function statusClass(s) { return { pending: 'bg-amber-50 text-amber-600', approved: 'bg-mint-50 text-mint-600', rejected: 'bg-red-50 text-red-400' }[s] || '' }
</script>
