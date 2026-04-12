import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const studentRoutes = [
  { path: '/', redirect: '/basecamp' },
  { path: '/basecamp', name: 'Basecamp', component: () => import('@/views/student/Basecamp.vue') },
  { path: '/discovery', name: 'Discovery', component: () => import('@/views/student/Discovery.vue') },
  { path: '/archive', name: 'Archive', component: () => import('@/views/student/Archive.vue') },
  { path: '/hall-of-fame', name: 'HallOfFame', component: () => import('@/views/student/HallOfFame.vue') },
  { path: '/skill-tree', name: 'SkillTree', component: () => import('@/views/student/SkillTree.vue') },
]

const librarianRoutes = [
  { path: '/librarian', redirect: '/librarian/counter' },
  { path: '/librarian/counter', name: 'CounterDesk', component: () => import('@/views/librarian/CounterDesk.vue') },
  { path: '/librarian/inventory', name: 'Inventory', component: () => import('@/views/librarian/Inventory.vue') },
  { path: '/librarian/borrow-log', name: 'BorrowLog', component: () => import('@/views/librarian/BorrowLog.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...studentRoutes, ...librarianRoutes],
})

export default router
