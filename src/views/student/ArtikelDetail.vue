<template>
  <div class="p-8 min-h-screen bg-gray-50" v-if="article">
    <div class="max-w-3xl mx-auto">
      <!-- Back -->
      <router-link to="/artikel" class="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-6 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Kembali ke Artikel
      </router-link>

      <!-- Article card -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="bg-primary-500 px-8 py-6">
          <p class="text-primary-200 text-xs mb-2">Artikel oleh {{ article.authorName }} · {{ article.authorClass }}</p>
          <h1 class="text-white text-2xl font-bold leading-snug">{{ article.title }}</h1>
          <p class="text-primary-200 text-sm mt-2">{{ article.createdAt }}</p>
        </div>

        <!-- Book link banner -->
        <div class="mx-6 -mt-4">
          <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div class="w-14 h-18 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100" style="height:72px">
              <BookCover :book-id="article.bookId" :title="article.bookTitle" :category="''" class-name="w-full h-full" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gray-400 mb-0.5">Buku yang diulas</p>
              <p class="font-bold text-gray-800">{{ article.bookTitle }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                  +{{ article.referralXp }} XP referral untuk penulis
                </span>
              </div>
            </div>
            <button @click="goToBook" class="btn-primary text-sm px-5 py-2.5 flex-shrink-0">
              Baca / Pinjam Buku
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="px-8 py-6">
          <p class="text-gray-700 text-base leading-relaxed whitespace-pre-line">{{ article.content }}</p>
        </div>

        <!-- Action bar -->
        <div class="px-8 py-4 border-t border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-5">
            <button
              @click="contentStore.likeArticle(article.id, 'LQ-2024-001')"
              class="flex items-center gap-2 text-sm font-medium transition-colors"
              :class="article.likedBy.includes('LQ-2024-001') ? 'text-red-500' : 'text-gray-400 hover:text-red-400'"
            >
              <Heart class="w-5 h-5" :fill="article.likedBy.includes('LQ-2024-001') ? 'currentColor' : 'none'" />
              {{ article.likes }} Suka
            </button>
            <span class="flex items-center gap-2 text-sm text-gray-400">
              <Eye class="w-5 h-5" /> {{ article.views }} Pembaca
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 bg-primary-50 text-primary-600 px-3 py-2 rounded-xl">
            Jika kamu membaca buku ini lewat artikel ini, penulis mendapat +{{ article.referralXp }} XP bonus!
          </div>
        </div>
      </div>

      <!-- Info referral XP -->
      <div v-if="justBorrowed" class="mt-4 p-4 bg-mint-50 border border-mint-200 rounded-xl text-sm text-mint-700 font-medium">
        Buku berhasil dipinjam! Setelah kamu menyelesaikan QuestAI, {{ article.authorName }} akan mendapat +{{ article.referralXp }} XP bonus.
      </div>
    </div>
  </div>
  <div v-else class="p-8 text-center text-gray-400">
    <p>Artikel tidak ditemukan.</p>
    <router-link to="/artikel" class="text-primary-500 text-sm mt-2 block">Kembali ke daftar artikel</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Heart, Eye } from 'lucide-vue-next'
import { useContentStore } from '@/stores/content'
import { useLibraryStore } from '@/stores/library'
import BookCover from '@/components/BookCover.vue'

const route = useRoute()
const contentStore = useContentStore()
const libraryStore = useLibraryStore()
const justBorrowed = ref(false)

const article = computed(() =>
  contentStore.articles.find(a => a.id === route.params.id)
)

onMounted(() => {
  if (article.value) contentStore.viewArticle(article.value.id)
})

function goToBook() {
  const book = libraryStore.books.find(b => b.id === article.value?.bookId)
  if (book) {
    libraryStore.selectBook(book)
    justBorrowed.value = true
  }
}
</script>
