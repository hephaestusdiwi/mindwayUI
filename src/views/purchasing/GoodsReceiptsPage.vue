<template>
  <div class="p-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Penerimaan Barang (GRN)</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ pagination.total ?? 0 }} dokumen GRN</p>
      </div>
      <button
        @click="$router.push('/purchasing/goods-receipts/create')"
        class="flex items-center gap-2 px-4 py-2 bg-[#117c6f] hover:bg-[#0e6b5f] text-white text-sm font-medium rounded-xl transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        Terima Barang
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
          placeholder="Cari no. GRN..."
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
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-36">No. GRN</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Supplier</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-36">Ref. PO</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Tgl Terima</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-36">Total</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Status</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-32">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-if="loading">
            <td colspan="7" class="text-center py-16">
              <div class="flex flex-col items-center gap-2 text-gray-400">
                <svg class="w-6 h-6 animate-spin text-[#117c6f]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="12"/>
                </svg>
                <span class="text-sm">Memuat...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="!grns.length">
            <td colspan="7" class="text-center py-16">
              <div class="flex flex-col items-center gap-3 text-gray-400">
                <svg class="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <path d="M8 10l12-6 12 6v14l-12 6-12-6V10z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  <path d="M8 10l12 6 12-6M20 16v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <p class="text-sm font-medium">Belum ada penerimaan barang</p>
                <button @click="$router.push('/purchasing/goods-receipts/create')"
                  class="text-xs text-[#117c6f] hover:underline font-medium">
                  Buat GRN pertama →
                </button>
              </div>
            </td>
          </tr>
          <tr
            v-for="g in grns" :key="g.id"
            class="hover:bg-gray-50/60 cursor-pointer transition-colors group"
            @click="$router.push(`/purchasing/goods-receipts/${g.id}`)"
          >
            <td class="px-4 py-3">
              <span class="font-mono text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg">
                {{ g.grn_number }}
              </span>
            </td>
            <td class="px-4 py-3 font-medium text-gray-900">{{ g.supplier?.name }}</td>
            <td class="px-4 py-3">
              <span v-if="g.purchase_order?.po_number"
                class="font-mono text-xs text-gray-500 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg">
                {{ g.purchase_order.po_number }}
              </span>
              <span v-else class="text-gray-400 text-xs">— Tanpa PO</span>
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDate(g.received_date) }}</td>
            <td class="px-4 py-3 text-right font-semibold text-gray-900">{{ formatCurrency(g.total_cost) }}</td>
            <td class="px-4 py-3">
              <span :class="statusClass(g.status)" class="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold">
                {{ statusLabel(g.status) }}
              </span>
            </td>
            <td class="px-4 py-3 text-right" @click.stop>
              <div class="flex justify-end gap-1.5">
                <button
                  v-if="g.status === 'draft'"
                  @click.stop="confirmGRN(g)"
                  class="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Konfirmasi
                </button>
                <button
                  v-if="g.status === 'confirmed'"
                  @click.stop="openCancel(g)"
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

    <!-- Cancel dialog -->
    <div v-if="cancelTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-[420px]">
        <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="text-red-500">
            <path d="M11 8v5M11 14.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M9.5 3.5L2 18h18L11.5 3.5a.6.6 0 00-1 0z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="text-center font-semibold text-gray-900 mb-1">Batalkan GRN?</p>
        <p class="text-center text-sm text-gray-500 mb-4">
          GRN <span class="font-medium text-gray-700">{{ cancelTarget.grn_number }}</span> akan dibatalkan dan stok dikembalikan.
        </p>
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-500 mb-1.5">Alasan Pembatalan <span class="text-red-500">*</span></label>
          <textarea v-model="cancelReason" rows="2" placeholder="Tulis alasan..."
            class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 resize-none transition-all" />
        </div>
        <div class="flex gap-3">
          <button @click="cancelTarget = null; cancelReason = ''"
            class="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Kembali
          </button>
          <button @click="doCancel"
            class="flex-1 py-2.5 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">
            Batalkan GRN
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { usePurchasingStore } from '@/stores/purchasing'
import { formatDate, formatCurrency } from '@/lib/utils'
import { useDebounceFn } from '@vueuse/core'
import { useToast } from '@/composables/useToast'

const store  = usePurchasingStore()
const toast  = useToast()
const { loading } = store
const grns         = ref<any[]>([])
const pagination   = ref<any>({})
const page         = ref(1)
const cancelTarget = ref<any>(null)
const cancelReason = ref('')
const filters      = reactive({ search: '', status: '', from: '', to: '' })

async function fetchData() {
  const data = await store.fetchGoodsReceipts({ page: page.value, ...filters })
  grns.value       = data.data
  pagination.value = data.meta ?? {}
}

const debouncedFetch = useDebounceFn(fetchData, 400)

async function confirmGRN(g: any) {
  try {
    await store.confirmGRN(g.id)
    toast.success(`GRN ${g.grn_number} dikonfirmasi. Stok diperbarui.`)
    fetchData()
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Gagal mengkonfirmasi.')
  }
}

function openCancel(g: any) { cancelTarget.value = g; cancelReason.value = '' }

async function doCancel() {
  if (!cancelReason.value.trim()) return
  try {
    await store.cancelGRN(cancelTarget.value.id, cancelReason.value)
    toast.success('GRN dibatalkan. Stok dikembalikan.')
    cancelTarget.value = null
    cancelReason.value = ''
    fetchData()
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Gagal membatalkan.')
  }
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