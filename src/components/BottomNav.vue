<template>
  <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 pb-safe z-40 shadow-lg">
    <div class="flex items-center justify-around px-2 pt-2 pb-1">
      <router-link
        v-for="item in navItems" :key="item.to"
        :to="item.to"
        class="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
        :class="$route.path === item.to
          ? 'text-primary-500'
          : 'text-gray-400 hover:text-gray-600'"
      >
        <div class="relative">
          <component :is="item.icon" class="w-5 h-5" :stroke-width="$route.path === item.to ? 2.5 : 1.8" />
          <span
            v-if="item.badge"
            class="absolute -top-1 -right-1 w-2 h-2 bg-coral-400 rounded-full"
          ></span>
        </div>
        <span class="text-[10px] font-medium leading-none">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { Home, Search, BookOpen, Trophy, BarChart2 } from 'lucide-vue-next'

const navItems = [
  { to: '/basecamp',     icon: Home,      label: 'Basecamp' },
  { to: '/discovery',    icon: Search,    label: 'Discovery' },
  { to: '/archive',      icon: BookOpen,  label: 'Archive' },
  { to: '/hall-of-fame', icon: Trophy,    label: 'Hall of Fame' },
  { to: '/skill-tree',   icon: BarChart2, label: 'Stats' },
]
</script>
