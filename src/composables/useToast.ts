// src/composables/useToast.ts
import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

const toasts = ref<Toast[]>([])
let counter = 0

function add(message: string, type: Toast['type'], duration = 3000) {
  const id = ++counter
  toasts.value.push({ id, message, type })
  setTimeout(() => remove(id), duration)
}

function remove(id: number) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

export function useToast() {
  return {
    toasts,
    success: (message: string) => add(message, 'success'),
    error:   (message: string) => add(message, 'error'),
    info:    (message: string) => add(message, 'info'),
    warning: (message: string) => add(message, 'warning'),
    remove,
  }
}