<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box w-[420px]">
      <div class="modal-header">
        <h2 class="text-base font-medium">{{ title }}</h2>
        <button @click="$emit('close')" class="btn-icon">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="modal-body">
        <p class="text-sm text-gray-500 mb-3">
          Tindakan ini tidak dapat dibatalkan. Stok akan dikembalikan ke kondisi sebelumnya.
        </p>
        <label class="form-label">
          Alasan Pembatalan <span class="text-red-500">*</span>
        </label>
        <textarea
          v-model="reason"
          rows="3"
          class="input-field w-full resize-none mt-1"
          placeholder="Tulis alasan pembatalan..."
        />
        <p v-if="showError" class="text-red-500 text-xs mt-1">Alasan harus diisi.</p>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">Kembali</button>
        <button @click="confirm" class="btn-danger">Batalkan Dokumen</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps<{ title: string }>()
const emit = defineEmits(['confirm', 'close'])

const reason    = ref('')
const showError = ref(false)

function confirm() {
  if (!reason.value.trim()) {
    showError.value = true
    return
  }
  emit('confirm', reason.value)
}
</script>