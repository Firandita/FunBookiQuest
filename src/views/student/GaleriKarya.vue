<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="flex items-center gap-3 mb-2">
      <router-link to="/festival" class="text-gray-400 hover:text-gray-600 transition-colors">
        <ArrowLeft class="w-5 h-5" />
      </router-link>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Galeri Karya</h1>
        <p class="text-gray-400 text-sm mt-0.5">{{ contentStore.galeriEntries.length }} karya terbaik dari Festival Literasi</p>
      </div>
    </div>

    <!-- Top 3 podium banner -->
    <div class="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-5 mb-6 mt-4">
      <p class="text-amber-900 font-bold text-sm mb-3">Juara Festival Semester Ini</p>
      <div class="grid grid-cols-3 gap-3">
        <div v-for="(entry, i) in contentStore.top3Entries" :key="entry.id"
          @click="activeEntry = entry"
          class="bg-white/30 rounded-xl p-3 cursor-pointer hover:bg-white/40 transition-colors"
        >
          <p class="text-lg mb-1">{{ ['🥇','🥈','🥉'][i] }}</p>
          <p class="font-bold text-amber-900 text-sm line-clamp-1">{{ entry.title }}</p>
          <p class="text-amber-800 text-xs mt-0.5">{{ entry.authorName }}</p>
          <span class="text-[10px] bg-white/40 text-amber-900 px-2 py-0.5 rounded-full mt-1 inline-block font-semibold">{{ entry.type }}</span>
        </div>
      </div>
    </div>

    <!-- Category filter -->
    <div class="flex gap-2 mb-5">
      <button v-for="t in typeFilters" :key="t" @click="typeFilter = t"
        class="text-xs px-3 py-2 rounded-xl border font-medium transition-all"
        :class="typeFilter === t ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-500 border-gray-200'"
      >{{ t }}</button>
    </div>

    <!-- Grid karya -->
    <div class="grid grid-cols-3 gap-4">
      <div v-for="entry in filteredGaleri" :key="entry.id"
        @click="activeEntry = entry"
        class="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition-all group"
      >
        <!-- Color header based on type -->
        <div class="h-24 flex items-center justify-center relative"
          :class="{ 'bg-mint-50': entry.type === 'Cerpen', 'bg-primary-50': entry.type === 'Essay', 'bg-amber-50': entry.type === 'Puisi' }"
        >
          <span class="text-5xl opacity-30">{{ { Cerpen: '📖', Essay: '✍️', Puisi: '🎭' }[entry.type] }}</span>
          <span v-if="entry.status === 'top3'" class="absolute top-2 right-2 text-xl">
            {{ ['🥇','🥈','🥉'][contentStore.top3Entries.findIndex(e=>e.id===entry.id)] }}
          </span>
        </div>
        <div class="p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              :class="{ 'bg-mint-50 text-mint-600': entry.type === 'Cerpen', 'bg-primary-50 text-primary-600': entry.type === 'Essay', 'bg-amber-50 text-amber-700': entry.type === 'Puisi' }">
              {{ entry.type }}
            </span>
          </div>
          <h3 class="font-bold text-gray-800 text-sm leading-snug line-clamp-2 mb-1">{{ entry.title }}</h3>
          <p class="text-xs text-gray-400 mb-2">{{ entry.authorName }}</p>
          <p class="text-xs text-gray-500 line-clamp-2">{{ entry.content.substring(0, 80) }}...</p>
          <div class="flex items-center justify-between mt-3 text-[10px] text-gray-400">
            <span>👁 {{ entry.views }}</span>
            <span>🗳 {{ entry.votes }} suara</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Entry detail modal -->
    <Teleport to="body">
      <div v-if="activeEntry" class="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="activeEntry = null">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style="max-height:90vh;overflow-y:auto">
          <div class="bg-primary-500 px-6 py-5 relative">
            <button @click="activeEntry = null" class="absolute top-4 right-4 text-white/70 hover:text-white"><X class="w-5 h-5" /></button>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs px-2.5 py-1 rounded-full font-semibold bg-white/20 text-white">{{ activeEntry.type }}</span>
              <span v-if="activeEntry.status === 'top3'" class="bg-amber-400 text-amber-900 text-xs px-2.5 py-1 rounded-full font-bold">🏆 Juara Festival</span>
            </div>
            <h2 class="text-white font-bold text-xl leading-snug">{{ activeEntry.title }}</h2>
            <p class="text-primary-200 text-sm mt-1">oleh {{ activeEntry.authorName }} · {{ activeEntry.authorClass }}</p>
          </div>
          <div class="p-6">
            <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{{ activeEntry.content }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, X } from 'lucide-vue-next'
import { useContentStore } from '@/stores/content'

const contentStore = useContentStore()
const typeFilter = ref('Semua')
const typeFilters = ['Semua', 'Cerpen', 'Essay', 'Puisi']
const activeEntry = ref(null)

const filteredGaleri = computed(() => {
  if (typeFilter.value === 'Semua') return contentStore.galeriEntries
  return contentStore.galeriEntries.filter(e => e.type === typeFilter.value)
})
</script>
