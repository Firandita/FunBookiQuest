import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // Role: 'student' | 'librarian'
  const role = ref('student')
  const profile = ref({
    id: 'LQ-2024-001',
    name: 'Firandita Yunia Rahmawati',
    class: 'XI IPA 2',
    school: 'SMA Negeri Jogoroto',
    avatar: '🦊',
    level: 4,
    title: 'Penjelajah Kata',
    xp: 2450,
    xpToNext: 3000,
    streak: 7,
  })

  const xpPercent = computed(() =>
    Math.round((profile.value.xp / profile.value.xpToNext) * 100)
  )

  const levelTitles = [
    'Pembaca Pemula', 'Pembaca Muda', 'Penjelajah Kata',
    'Penjaga Pustaka', 'Maestro Literasi'
  ]

  function addXP(amount) {
    profile.value.xp += amount
    if (profile.value.xp >= profile.value.xpToNext) {
      profile.value.level++
      profile.value.xp -= profile.value.xpToNext
      profile.value.xpToNext = Math.round(profile.value.xpToNext * 1.5)
      profile.value.title = levelTitles[Math.min(profile.value.level - 1, 4)]
    }
  }

  function switchRole(newRole) { role.value = newRole }

  return { role, profile, xpPercent, addXP, switchRole }
})
