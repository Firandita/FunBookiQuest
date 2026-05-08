<template>
  <div class="p-8 min-h-screen bg-gray-50">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Artikel & Ulasan</h1>
        <p class="text-gray-400 text-sm mt-0.5">Tulis ulasan buku dan bagikan ke sesama pembaca</p>
      </div>
      <button @click="showWrite = true" class="flex items-center gap-2 bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm">
        <PenLine class="w-4 h-4" />
        Tulis Artikel
      </button>
    </div>

    <!-- Top stats -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Total Artikel</p>
        <p class="text-2xl font-bold text-gray-800">{{ contentStore.approvedArticles.length }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Artikel Terbaca</p>
        <p class="text-2xl font-bold text-primary-500">{{ totalViews.toLocaleString() }}</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
        <p class="text-xs text-gray-400 mb-1">Total Likes</p>
        <p class="text-2xl font-bold text-red-400">{{ totalLikes }}</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">

      <!-- Main feed (2 cols) -->
      <div class="col-span-2">
        <!-- Filter tabs -->
        <div class="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit mb-5">
          <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            :class="activeTab === t.id ? 'bg-primary-500 text-white' : 'text-gray-500 hover:text-gray-700'"
          >{{ t.label }}</button>
        </div>

        <!-- Article list -->
        <div class="space-y-4">
          <div v-for="art in displayedArticles" :key="art.id"
            class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            @click="openArticle(art)"
          >
            <div class="flex gap-4">
              <!-- Book cover thumbnail -->
              <div class="w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                <BookCover :book-id="art.bookId" :title="art.bookTitle" :category="''" class-name="w-full h-full" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h3 class="font-bold text-gray-800 text-base leading-snug line-clamp-2">{{ art.title }}</h3>
                </div>
                <p class="text-xs text-gray-400 mb-2">
                  oleh <span class="font-medium text-gray-600">{{ art.authorName }}</span> · {{ art.authorClass }} · {{ art.createdAt }}
                </p>
                <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ art.content.substring(0, 150) }}...</p>
                <div class="flex items-center gap-4">
                  <span class="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full font-medium">{{ art.bookTitle }}</span>
                  <div class="flex items-center gap-3 text-xs text-gray-400">
                    <span class="flex items-center gap-1">
                      <Heart class="w-3.5 h-3.5" /> {{ art.likes }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Eye class="w-3.5 h-3.5" /> {{ art.views }}
                    </span>
                  </div>
                  <span class="ml-auto text-xs text-primary-500 font-medium">+{{ art.referralXp }} XP referral</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar: Top artikel -->
      <div class="space-y-5">

        <!-- Top by likes -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-bold text-gray-800 text-sm mb-4">Paling Banyak Disukai</h3>
          <div class="space-y-3">
            <div v-for="(art, i) in contentStore.topByLikes" :key="art.id"
              @click="openArticle(art)"
              class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-1.5 -mx-1.5 transition-colors"
            >
              <span class="text-lg flex-shrink-0">{{ ['🥇','🥈','🥉','4️⃣','5️⃣'][i] }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-700 line-clamp-2 leading-snug">{{ art.title }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ art.authorName }} · ❤️ {{ art.likes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Top by views -->
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-bold text-gray-800 text-sm mb-4">Paling Banyak Dibaca</h3>
          <div class="space-y-3">
            <div v-for="(art, i) in contentStore.topByViews" :key="art.id"
              @click="openArticle(art)"
              class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-1.5 -mx-1.5 transition-colors"
            >
              <span class="text-sm font-bold text-gray-300 flex-shrink-0 w-5 text-center">{{ i + 1 }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-700 line-clamp-2 leading-snug">{{ art.title }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ art.authorName }} · 👁 {{ art.views }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Referral XP info -->
        <div class="bg-primary-50 border border-primary-100 rounded-2xl p-4">
          <h3 class="font-bold text-primary-700 text-sm mb-2">Cara Dapat Referral XP</h3>
          <p class="text-xs text-primary-600 leading-relaxed">Tulis artikel tentang buku yang sudah kamu baca. Kalau ada teman yang baca artikelmu lalu meminjam buku tersebut dan menyelesaikan QuestAI — kamu dapat <strong>+15 XP</strong> bonus!</p>
        </div>

      </div>
    </div>

    <!-- Write Article Modal -->
    <Teleport to="body">
      <div v-if="showWrite" class="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showWrite = false">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style="max-height:90vh;overflow-y:auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-gray-800">Tulis Artikel Baru</h3>
            <button @click="showWrite = false" class="text-gray-400 hover:text-gray-600"><X class="w-5 h-5" /></button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Buku yang Diulas</label>
              <select v-model="form.bookId" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400">
                <option value="">-- Pilih buku --</option>
                <option v-for="b in libraryStore.completedBooks" :key="b.bookId" :value="b.bookId">{{ b.book.title }}</option>
              </select>
              <p class="text-xs text-gray-400 mt-1">Hanya buku yang sudah selesai dibaca yang bisa diulas</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Judul Artikel</label>
              <input v-model="form.title" placeholder="Tulis judul yang menarik..." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Isi Artikel</label>
              <textarea v-model="form.content" rows="8" placeholder="Ceritakan apa yang kamu pelajari, bagian paling berkesan, atau mengapa teman-teman perlu membaca buku ini..." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400 resize-none"></textarea>
              <p class="text-xs text-gray-400 mt-1">{{ form.content.length }} karakter · Minimal 200 karakter</p>
            </div>
            <div class="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
              Artikel akan direview oleh pustakawan sebelum dipublikasikan. Biasanya proses review selesai dalam 1x24 jam.
            </div>
            <div class="flex gap-3">
              <button @click="submitArticle" :disabled="!canSubmit" class="flex-1 btn-primary py-3" :class="!canSubmit ? 'opacity-40 cursor-not-allowed' : ''">
                Kirim untuk Review
              </button>
              <button @click="showWrite = false" class="btn-outline px-5 py-3">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Article Detail Modal -->
    <Teleport to="body">
      <div v-if="activeArticle" class="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="activeArticle = null">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style="max-height:90vh;overflow-y:auto">
          <router-link :to="'/artikel/' + activeArticle.id" @click="activeArticle = null" custom v-slot="{ navigate }">
            <div @click="navigate" class="cursor-pointer">
              <div class="bg-primary-500 px-6 py-5">
                <p class="text-primary-200 text-xs mb-1">Artikel oleh {{ activeArticle.authorName }}</p>
                <h2 class="text-white font-bold text-xl leading-snug">{{ activeArticle.title }}</h2>
              </div>
              <div class="p-6">
                <p class="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-6">{{ activeArticle.content }}</p>
                <div class="border-t border-gray-100 pt-4 flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <button @click.stop="contentStore.likeArticle(activeArticle.id, 'LQ-2024-001')"
                      class="flex items-center gap-1.5 text-sm font-medium transition-colors"
                      :class="activeArticle.likedBy.includes('LQ-2024-001') ? 'text-red-500' : 'text-gray-400 hover:text-red-400'"
                    ><Heart class="w-4 h-4" /> {{ activeArticle.likes }}</button>
                    <span class="flex items-center gap-1.5 text-sm text-gray-400"><Eye class="w-4 h-4" /> {{ activeArticle.views }}</span>
                  </div>
                  <div class="flex gap-2">
                    <button @click.stop="goToBook(activeArticle.bookId)" class="btn-primary text-xs px-4 py-2">Baca Bukunya</button>
                    <button @click.stop="activeArticle = null" class="btn-outline text-xs px-4 py-2">Tutup</button>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PenLine, Heart, Eye, X } from 'lucide-vue-next'
import { useContentStore } from '@/stores/content'
import { useLibraryStore } from '@/stores/library'
import { useRouter } from 'vue-router'
import BookCover from '@/components/BookCover.vue'

const contentStore = useContentStore()
const libraryStore = useLibraryStore()
const router = useRouter()

const activeTab = ref('terbaru')
const showWrite = ref(false)
const activeArticle = ref(null)

const tabs = [
  { id: 'terbaru',  label: 'Terbaru'         },
  { id: 'terlikes', label: 'Terlikes'         },
  { id: 'terbaca',  label: 'Terbanyak Dibaca' },
]

const displayedArticles = computed(() => {
  const list = [...contentStore.approvedArticles]
  if (activeTab.value === 'terlikes')  return list.sort((a,b) => b.likes - a.likes)
  if (activeTab.value === 'terbaca')   return list.sort((a,b) => b.views - a.views)
  return list
})

const totalViews = computed(() => contentStore.approvedArticles.reduce((s,a) => s + a.views, 0))
const totalLikes = computed(() => contentStore.approvedArticles.reduce((s,a) => s + a.likes, 0))

const form = ref({ bookId: '', title: '', content: '' })
const canSubmit = computed(() => form.value.bookId && form.value.title.trim() && form.value.content.length >= 200)

function openArticle(art) {
  contentStore.viewArticle(art.id)
  activeArticle.value = art
}

function submitArticle() {
  const book = libraryStore.completedBooks.find(b => b.bookId === form.value.bookId)
  if (!book) return
  contentStore.submitArticle({
    title: form.value.title,
    content: form.value.content,
    authorId: 'LQ-2024-001',
    authorName: 'Rizky Dermawan',
    authorClass: 'XI IPA 2',
    bookId: form.value.bookId,
    bookTitle: book.book.title,
  })
  form.value = { bookId: '', title: '', content: '' }
  showWrite.value = false
  alert('Artikel berhasil dikirim dan menunggu review pustakawan!')
}

function goToBook(bookId) {
  const book = libraryStore.books.find(b => b.id === bookId)
  if (book) { libraryStore.selectBook(book); activeArticle.value = null }
}
</script>
