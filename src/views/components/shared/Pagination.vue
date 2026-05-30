<template>
  <div class="flex items-center justify-between mt-4 text-sm">
    <!-- Info -->
    <p class="text-gray-500 text-xs">
      Menampilkan {{ meta.from ?? 0 }}–{{ meta.to ?? 0 }} dari {{ meta.total ?? 0 }} data
    </p>

    <!-- Buttons -->
    <div class="flex items-center gap-1">
      <!-- Prev -->
      <button
        @click="$emit('change', meta.current_page - 1)"
        :disabled="meta.current_page <= 1"
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M8 3L4 7l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Page numbers -->
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="w-8 h-8 flex items-center justify-center text-gray-400 text-xs">
          ···
        </span>
        <button
          v-else
          @click="$emit('change', page)"
          class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors"
          :class="page === meta.current_page
            ? 'bg-[#117c6f] text-white border border-[#117c6f]'
            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next -->
      <button
        @click="$emit('change', meta.current_page + 1)"
        :disabled="meta.current_page >= meta.last_page"
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M6 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ meta: any }>()
defineEmits<{ change: [page: number] }>()

const visiblePages = computed(() => {
  const current = props.meta.current_page ?? 1
  const last    = props.meta.last_page    ?? 1
  const pages: (number | string)[] = []

  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > 3)           pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < last - 2)    pages.push('...')
  pages.push(last)

  return pages
})
</script>