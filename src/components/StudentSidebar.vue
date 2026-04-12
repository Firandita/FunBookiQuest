<template>
  <aside class="w-56 bg-white border-r border-gray-100 min-h-screen flex flex-col flex-shrink-0">
    <!-- Logo -->
    <div class="px-5 py-5 border-b border-gray-100">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">L</div>
        <span class="font-bold text-gray-800 text-base">LibraQuest</span>
      </div>
    </div>

    <!-- XP Snapshot -->
    <div class="px-4 py-3 border-b border-gray-100 bg-primary-50">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
          {{ userStore.profile.level }}
        </div>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-primary-700 truncate">{{ userStore.profile.name.split(' ')[0] }}</p>
          <p class="text-[10px] text-primary-500">{{ userStore.profile.title }}</p>
        </div>
      </div>
      <div class="h-1.5 bg-primary-200 rounded-full overflow-hidden">
        <div class="h-full bg-primary-500 rounded-full transition-all duration-700" :style="{ width: userStore.xpPercent + '%' }"></div>
      </div>
      <p class="text-[10px] text-primary-400 mt-1">{{ userStore.profile.xp }} / {{ userStore.profile.xpToNext }} XP</p>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 px-3 py-4 space-y-0.5">
      <router-link
        v-for="item in navItems" :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
        :class="$route.path === item.to
          ? 'bg-primary-50 text-primary-600 border border-primary-100'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'"
      >
        <component :is="item.icon" class="w-4 h-4 flex-shrink-0" />
        {{ item.label }}
      </router-link>
    </nav>

    <!-- Bottom: school info -->
    <div class="px-4 py-4 border-t border-gray-100 text-[10px] text-gray-400">
      <p class="font-medium text-gray-500">{{ userStore.profile.school }}</p>
      <p class="mt-0.5">{{ userStore.profile.class }}</p>
    </div>
  </aside>
</template>

<script setup>
import { Home, Search, BookOpen, Trophy, BarChart2 } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const navItems = [
  { to: '/basecamp',     icon: Home,      label: 'Basecamp'     },
  { to: '/discovery',    icon: Search,    label: 'Discovery'    },
  { to: '/archive',      icon: BookOpen,  label: 'Archive'      },
  { to: '/hall-of-fame', icon: Trophy,    label: 'Hall of Fame' },
  { to: '/skill-tree',   icon: BarChart2, label: 'Stats'        },
]
</script>
