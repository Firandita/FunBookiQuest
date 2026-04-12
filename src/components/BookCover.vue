<template>
  <div
    class="w-full h-full flex items-center justify-center overflow-hidden"
    :class="[bgClass, className]"
  >
    <img
      v-if="imgSrc"
      :src="imgSrc"
      :alt="title"
      class="w-full h-full object-cover"
      @error="imgSrc = null"
    />
    <div v-else class="flex flex-col items-center justify-center gap-1 p-2 text-center w-full h-full">
      <div class="w-8 h-10 border-2 rounded-sm flex items-center justify-center opacity-30" :class="borderClass">
        <span class="text-[8px] font-bold opacity-60" :class="textClass">{{ bookId }}</span>
      </div>
      <span class="text-[9px] leading-tight opacity-40 line-clamp-2 px-1" :class="textClass">{{ title }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  bookId: { type: String, required: true },
  title:  { type: String, default: '' },
  category: { type: String, default: '' },
  className: { type: String, default: '' },
})

const imgSrc = ref(null)

// Try loading cover image from assets/covers/{bookId}.jpg or .png or .webp
onMounted(async () => {
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    try {
      const mod = await import(`../assets/covers/${props.bookId}.${ext}`)
      imgSrc.value = mod.default
      break
    } catch {}
  }
})

const palette = {
  Sains:      { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-400'   },
  Sejarah:    { bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-400'  },
  Sastra:     { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-400' },
  Teknologi:  { bg: 'bg-slate-100', border: 'border-slate-200',  text: 'text-slate-400'  },
  Matematika: { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-400'    },
  Sosial:     { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-400' },
}
const c = computed(() => palette[props.category] || { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-400' })
const bgClass     = computed(() => c.value.bg)
const borderClass = computed(() => c.value.border)
const textClass   = computed(() => c.value.text)
</script>
