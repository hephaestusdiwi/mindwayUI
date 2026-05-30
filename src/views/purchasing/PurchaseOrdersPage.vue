<template>
  <div class="p-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Penyesuaian Stok</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ pagination.total ?? 0 }} dokumen penyesuaian</p>
      </div>
      <button
        @click="$router.push('/inventory/adjustments/create')"
        class="flex items-center gap-2 px-4 py-2 bg-[#117c6f] hover:bg-[#0e6b5f] text-white text-sm font-medium rounded-xl transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        Buat Penyesuaian
      </button>
    </div>

    <!-- Filter bar -->
    <div class="flex flex-wrap gap-2 mb-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.4"/>
          <path d="M11 11l2.5 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <input
          v-model="filters.search"
          @input="debouncedFetch"
          placeholder="Cari no. dokumen..."
          class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] w-48 transition-all"
        />
      </div>
      <select v-model="filters.status" @change="fetchData"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
        <option value="">Semua Status</option>
        <option value="draft">Draft</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select v-model="filters.type" @change="fetchData"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
        <option value="">Semua Tipe</option>
        <option value="recount">Hitung Ulang</option>
        <option value="addition">Penambahan</option>
        <option value="reduction">Pengurangan</option>
      </select>
      <input v-model="filters.from" @change="fetchData" type="date"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
      <input v-model="filters.to" @change="fetchData" type="date"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/70">
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-36">No. Dokumen</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Tanggal</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Tipe</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Alasan</th>
            <th class="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-20">Item</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Status</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Dibuat oleh</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-36">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">

          <!-- Loading -->
          <tr v-if="loading">
            <td colspan="8" class="text-center py-16 text-gray-400">
              <div class="flex flex-col items-center gap-2">
                <svg class="w-6 h-6 animate-spin text-[#117c6f]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="12"/>
                </svg>
                <span class="text-sm">Memuat...</span>
              </div>
            </td>
          </tr>

          <!-- Empty -->
          <tr v-else-if="!adjustments.length">
            <td colspan="8" class="text-center py-16">
              <div class="flex flex-col items-center gap-3 text-gray-400">
                <svg class="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <rect x="6" y="6" width="28" height="28" rx="4" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M14 20h12M20 14v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <p class="text-sm font-medium">Belum ada penyesuaian stok</p>
                <button @click="$router.push('/inventory/adjustments/create')"
                  class="text-xs text-[#117c6f] hover:underline font-medium">
                  Buat penyesuaian pertama →
                </button>
              </div>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="adj in adjustments"
            :key="adj.id"
            class="hover:bg-gray-50/60 cursor-pointer transition-colors"
            @click="openDetail(adj)"
          >
            <td class="px-4 py-3">
              <span class="font-mono text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                {{ adj.adj_number }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDate(adj.adj_date) }}</td>
            <td class="px-4 py-3">
              <span :class="typeClass(adj.type)" class="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold">
                {{ typeLabel(adj.type) }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-600 text-sm truncate max-w-[200px]">{{ adj.reason || '—' }}</td>
            <td class="px-4 py-3 text-center text-gray-500 text-sm">{{ adj.items_count ?? '—' }}</td>
            <td class="px-4 py-3">
              <span :class="statusClass(adj.status)" class="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold">
                {{ statusLabel(adj.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">{{ adj.created_by?.name ?? '—' }}</td>
            <td class="px-4 py-3 text-right" @click.stop>
              <div class="flex justify-end gap-1.5">
                <button
                  v-if="adj.status === 'draft'"
                  @click.stop="confirmAdj(adj)"
                  class="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Konfirmasi
                </button>
                <button
                  v-if="adj.status === 'draft'"
                  @click.stop="cancelAdj(adj)"
                  class="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Batal
                </button>
              </div>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="flex items-center justify-between mt-4">
      <p class="text-gray-400 text-xs">
        Menampilkan {{ pagination.from }}–{{ pagination.to }} dari {{ pagination.total }} data
      </p>
      <div class="flex items-center gap-1">
        <button @click="page--; fetchData()" :disabled="page <= 1"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8 3L4 7l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <span class="px-3 py-1 text-xs font-medium text-gray-600">{{ page }} / {{ pagination.last_page }}</span>
        <button @click="page++; fetchData()" :disabled="page >= pagination.last_page"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Detail Modal -->
    <AdjustmentDetailModal
      v-if="selectedAdj"
      :adjustment="selectedAdj"
      @close="selectedAdj = null"
    />

    <!-- Cancel Reason Dialog -->
    <CancelReasonDialog
      v-if="cancelTarget"
      :title="`Batalkan ${cancelTarget.adj_number}?`"
      @confirm="submitCancel"
      @close="cancelTarget = null"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useToast } from '@/composables/useToast'
import { formatDate } from '@/lib/utils'
import AdjustmentDetailModal from '../inventory/AdjustmentDetailModal.vue'
import CancelReasonDialog from '../components/shared/CancelReasonDialog.vue'
import api from '@/lib/axios'

const toast        = useToast()
const loading      = ref(false)
const adjustments  = ref<any[]>([])
const pagination   = ref<any>({})
const page         = ref(1)
const selectedAdj  = ref<any>(null)
const cancelTarget = ref<any>(null)
const filters      = reactive({ search: '', status: '', type: '', from: '', to: '' })

async function fetchData() {
  loading.value = true
  try {
    const { data } = await api.get('/auth/stock-adjustments', {
      params: { page: page.value, ...filters },
    })
    adjustments.value = data.data
    pagination.value  = data.meta ?? {}
  } finally {
    loading.value = false
  }
}

const debouncedFetch = useDebounceFn(fetchData, 400)

function openDetail(adj: any) {
  selectedAdj.value = adj
}

async function confirmAdj(adj: any) {
  try {
    await api.patch(`/auth/stock-adjustments/${adj.id}/confirm`)
    toast.success(`${adj.adj_number} dikonfirmasi. Stok diperbarui.`)
    fetchData()
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Gagal mengkonfirmasi.')
  }
}

function cancelAdj(adj: any) {
  cancelTarget.value = adj
}

async function submitCancel(reason: string) {
  if (!cancelTarget.value) return
  try {
    await api.patch(`/auth/stock-adjustments/${cancelTarget.value.id}/cancel`, { reason })
    toast.success('Penyesuaian dibatalkan.')
    cancelTarget.value = null
    fetchData()
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Gagal membatalkan.')
  }
}

function typeLabel(t: string) {
  return { recount: 'Hitung Ulang', addition: 'Penambahan', reduction: 'Pengurangan' }[t] ?? t
}
function typeClass(t: string) {
  return {
    recount:   'bg-blue-50 text-blue-700',
    addition:  'bg-emerald-50 text-emerald-700',
    reduction: 'bg-red-50 text-red-600',
  }[t] ?? 'bg-gray-100 text-gray-600'
}
function statusLabel(s: string) {
  return { draft: 'Draft', confirmed: 'Confirmed', cancelled: 'Cancelled' }[s] ?? s
}
function statusClass(s: string) {
  return {
    draft:     'bg-gray-100 text-gray-600',
    confirmed: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-600',
  }[s] ?? 'bg-gray-100 text-gray-600'
}

onMounted(fetchData)
</script>