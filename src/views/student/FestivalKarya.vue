<template>
  <div class="p-8 min-h-screen bg-gray-50">

    <!-- Hero banner -->
    <div class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 mb-6 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
      <div class="relative">
        <div class="flex items-start justify-between">
          <div>
            <span class="bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block">
              {{ contentStore.festivalOpen ? '🟢 Pendaftaran Dibuka' : '🔴 Pendaftaran Ditutup' }}
            </span>
            <h1 class="text-white text-2xl font-bold mb-1">Festival Karya Literasi</h1>
            <p class="text-primary-100 text-sm">Semester {{ contentStore.currentSemester }}</p>
            <p class="text-primary-200 text-xs mt-2">Kirim karya terbaikmu — cerpen, essay, atau puisi. Top 10 masuk Galeri Karya, Top 3 dapat reward spesial!</p>
          </div>
          <button v-if="contentStore.festivalOpen" @click="showSubmit = true" class="bg-white text-primary-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-50 transition-colors shadow flex-shrink-0">
            + Kirim Karya
          </button>
        </div>
      </div>
    </div>

    <!-- Reward info -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm text-center">
        <div class="text-3xl mb-2">🥇</div>
        <p class="font-bold text-gray-800 text-sm">Juara 1</p>
        <p class="text-xs text-gray-400 mt-1">Sertifikat + 500 XP + Badge "Penulis Terbaik"</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <div class="text-3xl mb-2">🥈</div>
        <p class="font-bold text-gray-800 text-sm">Juara 2</p>
        <p class="text-xs text-gray-400 mt-1">Sertifikat + 300 XP + Badge "Pena Emas"</p>
      </div>
      <div class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
        <div class="text-3xl mb-2">🥉</div>
        <p class="font-bold text-gray-800 text-sm">Juara 3</p>
        <p class="text-xs text-gray-400 mt-1">Sertifikat + 150 XP + Badge "Bintang Literasi"</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">

      <!-- Entry list (2 cols) -->
      <div class="col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-bold text-gray-800">Karya Semester Ini</h2>
          <div class="flex gap-2">
            <button v-for="t in typeFilters" :key="t" @click="typeFilter = t"
              class="text-xs px-3 py-1.5 rounded-xl border font-medium transition-all"
              :class="typeFilter === t ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-500 border-gray-200'"
            >{{ t }}</button>
          </div>
        </div>

        <div class="space-y-3">
          <div v-for="(entry, i) in filteredEntries" :key="entry.id"
            class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            @click="activeEntry = entry"
          >
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 text-center">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                  :class="entry.status === 'top3' ? 'bg-amber-100 text-amber-600' : entry.status === 'top10' ? 'bg-primary-50 text-primary-600' : 'bg-gray-100 text-gray-500'"
                >
                  {{ entry.status === 'top3' ? ['🥇','🥈','🥉'][contentStore.top3Entries.findIndex(e=>e.id===entry.id)] || '🏆' : i + 1 }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-bold text-gray-800">{{ entry.title }}</h3>
                  <span class="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    :class="typeColor(entry.type)">{{ entry.type }}</span>
                  <span v-if="entry.status === 'top3'" class="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Top 3</span>
                  <span v-else-if="entry.status === 'top10'" class="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-bold">Top 10 Galeri</span>
                </div>
                <p class="text-xs text-gray-400 mb-2">oleh {{ entry.authorName }} · {{ entry.authorClass }}</p>
                <p class="text-sm text-gray-500 line-clamp-2">{{ entry.content.substring(0, 120) }}...</p>
                <div class="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>👁 {{ entry.views }} dilihat</span>
                  <span>🗳 {{ entry.votes }} suara</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar: Top 3 + link galeri -->
      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 class="font-bold text-gray-800 text-sm mb-4">Juara Festival</h3>
          <div class="space-y-3">
            <div v-for="(entry, i) in contentStore.top3Entries" :key="entry.id"
              @click="activeEntry = entry"
              class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -mx-2 transition-colors"
            >
              <span class="text-xl flex-shrink-0">{{ ['🥇','🥈','🥉'][i] }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-800 line-clamp-1">{{ entry.title }}</p>
                <p class="text-[10px] text-gray-400">{{ entry.authorName }}</p>
              </div>
            </div>
          </div>
        </div>

        <router-link to="/galeri-karya" class="block bg-primary-500 rounded-2xl p-5 shadow-sm hover:bg-primary-600 transition-colors">
          <p class="text-white font-bold text-sm mb-1">Galeri Karya</p>
          <p class="text-primary-100 text-xs">Lihat {{ contentStore.galeriEntries.length }} karya terbaik dari festival sebelumnya</p>
          <p class="text-white text-xs font-semibold mt-2">Buka Galeri →</p>
        </router-link>

        <div class="bg-gray-50 rounded-2xl border border-gray-100 p-4">
          <p class="text-xs font-semibold text-gray-600 mb-2">Ketentuan Karya</p>
          <ul class="text-xs text-gray-500 space-y-1.5">
            <li>• Cerpen: maks. 2.000 kata</li>
            <li>• Essay: maks. 1.500 kata</li>
            <li>• Puisi: bebas, min. 3 bait</li>
            <li>• Karya orisinal, belum pernah dipublikasikan</li>
            <li>• Berkaitan dengan tema literasi</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Submit modal -->
    <Teleport to="body">
      <div v-if="showSubmit" class="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="showSubmit = false">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style="max-height:90vh;overflow-y:auto">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-gray-800">Kirim Karya ke Festival</h3>
            <button @click="showSubmit = false" class="text-gray-400 hover:text-gray-600"><X class="w-5 h-5" /></button>
          </div>
          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Jenis Karya</label>
                <select v-model="submitForm.type" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400">
                  <option>Cerpen</option><option>Essay</option><option>Puisi</option>
                </select>
              </div>
              <div>
                <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Judul</label>
                <input v-model="submitForm.title" placeholder="Judul karya..." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400" />
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Isi Karya</label>
              <textarea v-model="submitForm.content" rows="10" placeholder="Tulis karya di sini..." class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-400 resize-none"></textarea>
              <p class="text-xs text-gray-400 mt-1">{{ submitForm.content.split(/\s+/).filter(Boolean).length }} kata</p>
            </div>
            <div class="flex gap-3">
              <button @click="doSubmit" :disabled="!submitForm.title || !submitForm.content" class="flex-1 btn-primary py-3">Kirim Karya</button>
              <button @click="showSubmit = false" class="btn-outline px-5 py-3">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Entry detail modal -->
    <Teleport to="body">
      <div v-if="activeEntry" class="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="activeEntry = null">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style="max-height:90vh;overflow-y:auto">
          <div class="bg-primary-500 px-6 py-5 relative">
            <button @click="activeEntry = null" class="absolute top-4 right-4 text-white/70 hover:text-white"><X class="w-5 h-5" /></button>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs px-2.5 py-1 rounded-full font-semibold" :class="typeColor(activeEntry.type)">{{ activeEntry.type }}</span>
              <span v-if="activeEntry.status === 'top3'" class="bg-amber-400 text-amber-900 text-xs px-2.5 py-1 rounded-full font-bold">🏆 Top 3</span>
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
import { X } from 'lucide-vue-next'
import { useContentStore } from '@/stores/content'

const contentStore = useContentStore()
const showSubmit = ref(false)
const activeEntry = ref(null)
const typeFilter = ref('Semua')
const typeFilters = ['Semua', 'Cerpen', 'Essay', 'Puisi']

const submitForm = ref({ type: 'Cerpen', title: '', content: '' })

const filteredEntries = computed(() => {
  const all = contentStore.festivalEntries.filter(e => e.status !== 'submitted' || true)
  if (typeFilter.value === 'Semua') return all
  return all.filter(e => e.type === typeFilter.value)
})

function typeColor(type) {
  return { Cerpen: 'bg-mint-50 text-mint-600', Essay: 'bg-primary-50 text-primary-600', Puisi: 'bg-amber-50 text-amber-700' }[type] || 'bg-gray-100 text-gray-500'
}

function doSubmit() {
  contentStore.submitFestivalEntry({ ...submitForm.value, authorId: 'LQ-2024-001', authorName: 'Rizky Dermawan', authorClass: 'XI IPA 2' })
  submitForm.value = { type: 'Cerpen', title: '', content: '' }
  showSubmit.value = false
  alert('Karya berhasil dikirim! Menunggu seleksi dari panitia.')
}
</script>
