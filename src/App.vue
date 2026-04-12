<template>
  <div class="min-h-screen bg-gray-50">
    <template v-if="isStudentRoute">
      <div class="flex min-h-screen">
        <StudentSidebar />
        <div class="flex-1 overflow-auto relative">
          <router-view />
          <LibraAI />
          <QuestAI v-if="libraryStore.showQuestAI" />
          <BookDetailModal v-if="libraryStore.selectedBook" />
        </div>
      </div>
    </template>
    <template v-else-if="isLibrarianRoute">
      <div class="flex min-h-screen">
        <LibrarianSidebar />
        <div class="flex-1 overflow-auto">
          <router-view />
          <QuestAI v-if="libraryStore.showQuestAI" />
        </div>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLibraryStore } from '@/stores/library'
import StudentSidebar from '@/components/StudentSidebar.vue'
import LibrarianSidebar from '@/components/LibrarianSidebar.vue'
import LibraAI from '@/components/LibraAI.vue'
import QuestAI from '@/components/QuestAI.vue'
import BookDetailModal from '@/components/BookDetailModal.vue'

const route = useRoute()
const libraryStore = useLibraryStore()

const studentPaths = ['/basecamp', '/discovery', '/archive', '/hall-of-fame', '/skill-tree']
const isStudentRoute   = computed(() => studentPaths.some(p => route.path.startsWith(p)))
const isLibrarianRoute = computed(() => route.path.startsWith('/librarian'))
</script>
