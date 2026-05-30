<template>
  <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 items-end">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[260px] max-w-[360px] cursor-pointer"
        :class="typeClass(toast.type)"
        @click="remove(toast.id)"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 w-5 h-5">
          <!-- success -->
          <svg v-if="toast.type === 'success'" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6 10l3 3 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <!-- error -->
          <svg v-else-if="toast.type === 'error'" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <!-- warning -->
          <svg v-else-if="toast.type === 'warning'" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L1 17h18L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M10 8v4M10 13.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <!-- info -->
          <svg v-else viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M10 9v5M10 6.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>

        <span class="flex-1">{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

function typeClass(type: string) {
  return {
    success: 'bg-green-600 text-white',
    error:   'bg-red-600 text-white',
    warning: 'bg-amber-500 text-white',
    info:    'bg-blue-600 text-white',
  }[type] ?? 'bg-gray-800 text-white'
}
</script>