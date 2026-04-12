<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">

        <!-- Intro Screen -->
        <div v-if="phase === 'intro'" class="p-6 text-center">
          <div class="text-5xl mb-3">🧠</div>
          <h2 class="text-xl font-bold text-gray-800 mb-1">Siap diuji?</h2>
          <p class="text-gray-500 text-sm mb-1">
            Kamu sudah selesai membaca
          </p>
          <p class="font-semibold text-primary-500 text-base mb-4">{{ bookTitle }}</p>
          <div class="bg-primary-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span class="text-lg">❓</span> {{ questions.length }} pertanyaan pilihan ganda
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span class="text-lg">⏱️</span> 20 detik per soal
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span class="text-lg">⭐</span> Hadiah hingga {{ questBook?.book?.xp || 100 }} XP
            </div>
          </div>
          <button @click="startQuiz" class="btn-primary w-full py-3 text-base">
            Mulai QuestAI! 🚀
          </button>
          <button @click="libraryStore.showQuestAI = false" class="mt-3 text-sm text-gray-400 hover:text-gray-600 w-full py-2">
            Nanti saja
          </button>
        </div>

        <!-- Quiz Screen -->
        <div v-else-if="phase === 'quiz'">
          <!-- Progress header -->
          <div class="bg-primary-500 px-5 pt-4 pb-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-white/80 text-xs font-medium">Soal {{ currentQ + 1 }} / {{ questions.length }}</span>
              <div class="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
                <Timer class="w-3.5 h-3.5 text-white" />
                <span class="text-white font-bold text-sm tabular-nums">{{ timeLeft }}s</span>
              </div>
            </div>
            <!-- Timer bar -->
            <div class="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-none"
                :class="timeLeft > 10 ? 'bg-mint-100' : timeLeft > 5 ? 'bg-amber-100' : 'bg-red-300'"
                :style="{ width: (timeLeft / TIMER_SECONDS * 100) + '%', transition: 'width 1s linear' }"
              ></div>
            </div>
          </div>

          <!-- Question -->
          <div class="px-5 py-4">
            <p class="text-gray-800 font-semibold text-base leading-snug mb-4">
              {{ current.question }}
            </p>

            <!-- Options -->
            <div class="space-y-2.5">
              <button
                v-for="(opt, i) in current.options" :key="i"
                @click="selectAnswer(i)"
                :disabled="answered"
                class="w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all"
                :class="optionClass(i)"
              >
                <span class="inline-flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    :class="optionBadgeClass(i)"
                  >{{ 'ABCD'[i] }}</span>
                  {{ opt }}
                </span>
              </button>
            </div>

            <!-- Feedback -->
            <Transition name="fade">
              <div v-if="answered" class="mt-4 p-3 rounded-xl text-sm font-medium" :class="isCorrect ? 'bg-mint-50 text-mint-600' : 'bg-coral-50 text-coral-400'">
                {{ isCorrect ? '✅ Tepat sekali! +' + pointsEarned + ' poin' : '❌ Kurang tepat. Jawaban: ' + current.options[current.answer] }}
              </div>
            </Transition>

            <button v-if="answered" @click="nextQuestion" class="btn-primary w-full mt-4 py-3">
              {{ currentQ < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil 🎉' }}
            </button>
          </div>
        </div>

        <!-- Result Screen -->
        <div v-else-if="phase === 'result'" class="p-6 text-center">
          <div class="text-5xl mb-2">{{ resultEmoji }}</div>
          <h2 class="text-xl font-bold text-gray-800 mb-1">{{ resultTitle }}</h2>
          <p class="text-gray-500 text-sm mb-5">Skor kamu untuk buku ini</p>

          <!-- Score ring -->
          <div class="relative w-28 h-28 mx-auto mb-5">
            <svg class="w-28 h-28 -rotate-90">
              <circle cx="56" cy="56" r="48" fill="none" stroke="#EEEDFE" stroke-width="8"/>
              <circle cx="56" cy="56" r="48" fill="none" stroke="#534AB7" stroke-width="8"
                stroke-dasharray="301.6"
                :stroke-dashoffset="301.6 - (scorePercent / 100) * 301.6"
                stroke-linecap="round"
                style="transition: stroke-dashoffset 1s ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-bold text-primary-500">{{ scorePercent }}%</span>
              <span class="text-xs text-gray-400">{{ correctCount }}/{{ questions.length }}</span>
            </div>
          </div>

          <!-- XP earned -->
          <div class="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-5 inline-flex items-center gap-3">
            <span class="text-3xl">⭐</span>
            <div class="text-left">
              <p class="text-xs text-amber-600">XP Diperoleh</p>
              <p class="text-2xl font-bold text-amber-600">+{{ xpEarned }}</p>
            </div>
          </div>

          <button @click="finishQuest" class="btn-primary w-full py-3 text-base mb-2">
            Klaim XP & Lanjutkan 🚀
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import { Timer } from 'lucide-vue-next'
import { useLibraryStore } from '@/stores/library'
import { useUserStore } from '@/stores/user'

const libraryStore = useLibraryStore()
const userStore = useUserStore()

const TIMER_SECONDS = 20
const phase = ref('intro')
const currentQ = ref(0)
const answered = ref(false)
const selectedIdx = ref(null)
const isCorrect = ref(false)
const correctCount = ref(0)
const pointsEarned = ref(0)
const timeLeft = ref(TIMER_SECONDS)
let timer = null

const questBook = computed(() => libraryStore.questBook)
const bookTitle = computed(() => questBook.value?.book?.title || 'Buku ini')

// Static questions — in real app these come from AI API
const questions = ref([
  {
    question: 'Apa tema utama yang diangkat dalam buku ini?',
    options: ['Petualangan dan eksplorasi', 'Pendidikan dan perjuangan', 'Romansa dan cinta', 'Politik dan kekuasaan'],
    answer: 1,
  },
  {
    question: 'Nilai moral apa yang paling kuat disampaikan penulis?',
    options: ['Kekayaan adalah segalanya', 'Semangat pantang menyerah', 'Kesendirian itu indah', 'Teknologi menggantikan manusia'],
    answer: 1,
  },
  {
    question: 'Latar tempat utama yang digambarkan dalam buku ini adalah?',
    options: ['Kota metropolitan modern', 'Lingkungan sekolah/pendidikan', 'Hutan belantara', 'Istana kerajaan'],
    answer: 1,
  },
])

const current = computed(() => questions.value[currentQ.value])

const scorePercent = computed(() =>
  Math.round((correctCount.value / questions.value.length) * 100)
)
const xpEarned = computed(() =>
  Math.round((questBook.value?.book?.xp || 100) * (scorePercent.value / 100))
)

const resultEmoji = computed(() => {
  if (scorePercent.value >= 90) return '🏆'
  if (scorePercent.value >= 70) return '🎉'
  if (scorePercent.value >= 50) return '😊'
  return '📖'
})

const resultTitle = computed(() => {
  if (scorePercent.value >= 90) return 'Luar biasa!'
  if (scorePercent.value >= 70) return 'Bagus sekali!'
  if (scorePercent.value >= 50) return 'Terus berlatih!'
  return 'Jangan menyerah!'
})

function optionClass(i) {
  if (!answered.value) return 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 cursor-pointer'
  if (i === current.value.answer) return 'border-mint-400 bg-mint-50 text-mint-600'
  if (i === selectedIdx.value && i !== current.value.answer) return 'border-coral-400 bg-coral-50 text-coral-400'
  return 'border-gray-100 bg-gray-50 text-gray-400 cursor-default'
}

function optionBadgeClass(i) {
  if (!answered.value) return 'bg-gray-100 text-gray-500'
  if (i === current.value.answer) return 'bg-mint-400 text-white'
  if (i === selectedIdx.value) return 'bg-coral-400 text-white'
  return 'bg-gray-100 text-gray-400'
}

function startQuiz() {
  phase.value = 'quiz'
  startTimer()
}

function startTimer() {
  timeLeft.value = TIMER_SECONDS
  clearInterval(timer)
  timer = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) { clearInterval(timer); autoAnswer() }
  }, 1000)
}

function autoAnswer() {
  if (!answered.value) selectAnswer(-1)
}

function selectAnswer(i) {
  if (answered.value) return
  clearInterval(timer)
  answered.value = true
  selectedIdx.value = i
  isCorrect.value = i === current.value.answer
  if (isCorrect.value) {
    correctCount.value++
    pointsEarned.value = Math.round((questBook.value?.book?.xp || 100) / questions.value.length * (timeLeft.value / TIMER_SECONDS + 0.5))
  } else {
    pointsEarned.value = 0
  }
}

function nextQuestion() {
  if (currentQ.value < questions.value.length - 1) {
    currentQ.value++
    answered.value = false
    selectedIdx.value = null
    startTimer()
  } else {
    phase.value = 'result'
  }
}

function finishQuest() {
  userStore.addXP(xpEarned.value)
  libraryStore.completeQuest(questBook.value, xpEarned.value, scorePercent.value)
}

onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
