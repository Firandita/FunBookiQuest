import { createRouter, createWebHistory } from 'vue-router'

const studentRoutes = [
  { path: '/', redirect: '/basecamp' },
  { path: '/basecamp',     name: 'Basecamp',      component: () => import('@/views/student/Basecamp.vue') },
  { path: '/discovery',    name: 'Discovery',     component: () => import('@/views/student/Discovery.vue') },
  { path: '/archive',      name: 'Archive',       component: () => import('@/views/student/Archive.vue') },
  { path: '/hall-of-fame', name: 'HallOfFame',    component: () => import('@/views/student/HallOfFame.vue') },
  { path: '/skill-tree',   name: 'SkillTree',     component: () => import('@/views/student/SkillTree.vue') },
  { path: '/artikel',      name: 'Artikel',       component: () => import('@/views/student/Artikel.vue') },
  { path: '/artikel/:id',  name: 'ArtikelDetail', component: () => import('@/views/student/ArtikelDetail.vue') },
  { path: '/festival',     name: 'Festival',      component: () => import('@/views/student/FestivalKarya.vue') },
  { path: '/galeri-karya', name: 'GaleriKarya',   component: () => import('@/views/student/GaleriKarya.vue') },
]

const librarianRoutes = [
  { path: '/librarian',                redirect: '/librarian/counter' },
  { path: '/librarian/counter',        name: 'CounterDesk',      component: () => import('@/views/librarian/CounterDesk.vue') },
  { path: '/librarian/inventory',      name: 'Inventory',        component: () => import('@/views/librarian/Inventory.vue') },
  { path: '/librarian/borrow-log',     name: 'BorrowLog',        component: () => import('@/views/librarian/BorrowLog.vue') },
  { path: '/librarian/approve-berita', name: 'ApproveBerita',    component: () => import('@/views/librarian/ApproveBerita.vue') },
  { path: '/librarian/peringkat',      name: 'LibrarianRanking', component: () => import('@/views/librarian/StudentRanking.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [...studentRoutes, ...librarianRoutes],
})

export default router
