<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box w-[680px]">
      <!-- Header -->
      <div class="modal-header">
        <div>
          <h2 class="text-base font-medium">{{ adjustment.adj_number }}</h2>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ formatDate(adjustment.adj_date) }} &middot;
            {{ typeLabel(adjustment.type) }} &middot;
            {{ adjustment.created_by?.name }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <StatusBadge :status="adjustment.status" type="adj" />
          <button @click="$emit('close')" class="btn-icon">
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="modal-body">
        <div class="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
          <span class="text-gray-500">Alasan: </span>
          <span class="font-medium text-gray-800">{{ adjustment.reason }}</span>
          <span v-if="adjustment.notes" class="text-gray-400 ml-2">— {{ adjustment.notes }}</span>
        </div>

        <!-- Items table -->
        <table class="w-full text-sm">
          <thead class="table-head">
            <tr>
              <th class="th-cell">Produk</th>
              <th class="th-cell w-24 text-right">Stok Sistem</th>
              <th class="th-cell w-24 text-right">Stok Aktual</th>
              <th class="th-cell w-24 text-right">Selisih</th>
              <th class="th-cell w-28 text-right">Harga Pokok</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingDetail">
              <td colspan="5" class="td-cell text-center py-6 text-gray-400">Memuat...</td>
            </tr>
            <tr v-for="item in detail?.items ?? []" :key="item.id" class="tr-row">
              <td class="td-cell font-medium">{{ item.product?.name }}</td>
              <td class="td-cell text-right text-gray-500">{{ item.qty_system }}</td>
              <td class="td-cell text-right">{{ item.qty_actual }}</td>
              <td
                class="td-cell text-right font-medium"
                :class="item.qty_difference > 0 ? 'text-green-600' : item.qty_difference < 0 ? 'text-red-500' : 'text-gray-400'"
              >
                {{ item.qty_difference > 0 ? '+' : '' }}{{ item.qty_difference }}
              </td>
              <td class="td-cell text-right text-gray-500">{{ formatCurrency(item.unit_cost) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-footer">
        <button @click="$emit('close')" class="btn-secondary">Tutup</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import StatusBadge from '../components/shared/StatusBadge.vue'
import { formatDate, formatCurrency } from '@/lib/utils'
import api from '@/lib/axios'

const props = defineProps<{ adjustment: any }>()
defineEmits(['close'])

const detail       = ref<any>(null)
const loadingDetail = ref(false)

watch(() => props.adjustment, async (adj) => {
  if (!adj) return
  loadingDetail.value = true
  try {
    const { data } = await api.get(`/stock-adjustments/${adj.id}`)
    detail.value = data
  } finally {
    loadingDetail.value = false
  }
}, { immediate: true })

function typeLabel(type: string) {
  return { recount: 'Hitung Ulang', addition: 'Penambahan', reduction: 'Pengurangan' }[type] ?? type
}
</script>