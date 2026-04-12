<template>
  <!-- Floating LibraAI button -->
  <div class="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-2">
    <!-- Chat bubble -->
    <Transition name="slide-up">
      <div v-if="isOpen" class="bg-white rounded-2xl shadow-xl border border-gray-100 w-72 mb-1 animate-fade-in overflow-hidden">
        <!-- Header -->
        <div class="bg-primary-500 px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 bg-white/20 rounded-full flex items-center justify-content-center text-sm">🤖</div>
            <div>
              <p class="text-white text-sm font-semibold">LibraAI</p>
              <p class="text-primary-100 text-[10px]">Asisten Literasi Kamu</p>
            </div>
          </div>
          <button @click="isOpen = false" class="text-white/70 hover:text-white">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Messages -->
        <div class="h-48 overflow-y-auto p-3 space-y-2 bg-gray-50" ref="chatContainer">
          <div v-for="msg in messages" :key="msg.id" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
            <div
              class="max-w-[85%] text-xs px-3 py-2 rounded-2xl leading-relaxed"
              :class="msg.role === 'user'
                ? 'bg-primary-500 text-white rounded-br-sm'
                : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-bl-sm'"
            >{{ msg.text }}</div>
          </div>
          <div v-if="isTyping" class="flex justify-start">
            <div class="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-bl-sm px-3 py-2">
              <span class="flex gap-1">
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0ms"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:150ms"></span>
                <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay:300ms"></span>
              </span>
            </div>
          </div>
        </div>

        <!-- Quick prompts -->
        <div class="px-3 pt-2 flex gap-1.5 flex-wrap">
          <button
            v-for="q in quickPrompts" :key="q"
            @click="sendMessage(q)"
            class="text-[10px] px-2 py-1 bg-primary-50 text-primary-600 rounded-full border border-primary-100 hover:bg-primary-100 transition-colors"
          >{{ q }}</button>
        </div>

        <!-- Input -->
        <div class="p-3 flex gap-2">
          <input
            v-model="inputText"
            @keyup.enter="sendMessage()"
            placeholder="Tanya LibraAI..."
            class="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400 bg-white"
          />
          <button @click="sendMessage()" class="bg-primary-500 text-white rounded-xl px-3 py-2 hover:bg-primary-600 transition-colors">
            <Send class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- FAB Button -->
    <button
      @click="isOpen = !isOpen"
      class="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all active:scale-90"
      :class="isOpen ? 'bg-gray-700' : 'bg-primary-500 hover:bg-primary-600'"
    >
      <span v-if="!isOpen" class="text-2xl">🤖</span>
      <X v-else class="w-5 h-5 text-white" />
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { X, Send } from 'lucide-vue-next'

const isOpen = ref(false)
const inputText = ref('')
const isTyping = ref(false)
const chatContainer = ref(null)
let msgId = 0

const quickPrompts = ['Rekomendasi buku', 'Apa itu XP?', 'Cara pinjam buku']

const messages = ref([
  { id: msgId++, role: 'ai', text: 'Halo! Aku LibraAI 👋 Tanya apa aja tentang buku, kata yang nggak dimengerti, atau minta rekomendasi bacaan yuk!' }
])

const aiReplies = {
  'rekomendasi buku': 'Berdasarkan riwayat bacaanmu, aku rekomendasikan "Filosofi Teras" karena kamu suka buku yang thoughtful. Mau aku cariin di katalog? 📚',
  'apa itu xp': 'XP (Experience Points) adalah poin yang kamu dapat setelah selesai membaca dan lulus kuis QuestAI. Kumpulkan XP buat naik level dan tukar dengan reward! ⭐',
  'cara pinjam buku': 'Untuk buku fisik: buka Discovery → pilih buku → tap "Pinjam Fisik" → tunjukkan kode akunmu ke pustakawan. Gampang kan? 😊',
}

async function sendMessage(text) {
  const msg = text || inputText.value.trim()
  if (!msg) return
  inputText.value = ''
  messages.value.push({ id: msgId++, role: 'user', text: msg })
  scrollToBottom()

  isTyping.value = true
  await new Promise(r => setTimeout(r, 1200))
  isTyping.value = false

  const key = Object.keys(aiReplies).find(k => msg.toLowerCase().includes(k))
  const reply = key
    ? aiReplies[key]
    : `Pertanyaan bagus! Soal "${msg}" — aku sedang mencari di database buku. Coba cek juga di katalog Discovery ya! 🔍`

  messages.value.push({ id: msgId++, role: 'ai', text: reply })
  scrollToBottom()
}

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(12px); }
.slide-up-leave-to { opacity: 0; transform: translateY(12px); }
</style>
