<template>
  <div class="space-y-5 animate-fade-in">

    <!-- ── HEADER ─────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display font-bold text-xl text-gray-900">Riwayat Transaksi</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ pagination.total }} transaksi tercatat</p>
      </div>
    </div>

    <!-- ── FILTER BAR ──────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">

      <!-- Tanggal dari -->
      <VueDatePicker
        v-model="filters.date_range"
        range
        :enable-time-picker="false"
        local="id"
        format="dd MM yyyy"
        placeholder="Pilih rentang tanggal"
        class="w-64"
        @update:model-value="fetchTransactions()"
        />

      <!-- Metode bayar -->
      <select
        v-model="filters.payment_method"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white text-gray-600"
        @change="fetchTransactions()"
      >
        <option value="">Semua Metode</option>
        <option value="cash">Cash</option>
        <option value="transfer">Transfer</option>
        <option value="qris">QRIS</option>
      </select>

      <!-- Reset filter -->
      <button
        v-if="hasActiveFilter"
        class="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        @click="resetFilters"
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Reset
      </button>

      <!-- Summary chips -->
      <div class="ml-auto flex items-center gap-2">
        <div class="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
          {{ pagination.total }} transaksi
        </div>
        <div class="bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-lg">
          {{ formatCurrency(totalRevenue) }}
        </div>
      </div>
    </div>

    <!-- ── TABEL ───────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <!-- Loading -->
      <div v-if="isLoading" class="divide-y divide-gray-50">
        <div v-for="i in 8" :key="i" class="flex items-center gap-4 px-6 py-4">
          <div class="w-16 h-3 bg-gray-100 rounded animate-pulse"></div>
          <div class="w-24 h-3 bg-gray-100 rounded animate-pulse"></div>
          <div class="flex-1 h-3 bg-gray-100 rounded animate-pulse"></div>
          <div class="w-20 h-3 bg-gray-100 rounded animate-pulse"></div>
          <div class="w-16 h-6 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="transactions.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 6h20M4 12h20M4 18h12" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="font-semibold text-gray-400">Belum ada transaksi</p>
        <p class="text-sm text-gray-300 mt-1">Transaksi akan muncul setelah kasir melakukan penjualan</p>
      </div>

      <!-- Table -->
      <div v-else>
        <!-- Header -->
        <div class="grid grid-cols-[80px_1fr_140px_120px_100px_80px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <span>#ID</span>
          <span>Waktu</span>
          <span>Items</span>
          <span>Total</span>
          <span>Metode</span>
          <span></span>
        </div>

        <!-- Rows -->
        <div class="divide-y divide-gray-50">
          <div
            v-for="trx in transactions"
            :key="trx.id"
            class="grid grid-cols-[80px_1fr_140px_120px_100px_80px] gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors cursor-pointer group"
            @click="openDetail(trx.id)"
          >
            <!-- ID -->
            <span class="text-sm font-bold text-gray-400">#{{ String(trx.id).padStart(5, '0') }}</span>

            <!-- Waktu -->
            <div>
              <p class="text-sm font-semibold text-gray-800">{{ formatDate(trx.created_at) }}</p>
              <p class="text-xs text-gray-400">{{ formatTime(trx.created_at) }}</p>
            </div>

            <!-- Items -->
            <div class="flex items-center gap-1.5">
              <div class="flex -space-x-1.5">
                <div
                  v-for="(item, i) in trx.items?.slice(0, 3)"
                  :key="i"
                  class="w-7 h-7 rounded-lg bg-gray-100 border-2 border-white overflow-hidden flex-shrink-0"
                >
                  <img v-if="item.product?.image_url" :src="item.product.image_url" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-400">
                    {{ item.product?.name?.charAt(0) }}
                  </div>
                </div>
              </div>
              <span class="text-xs text-gray-500">
                {{ trx.items?.length ?? 0 }} item
                <span v-if="trx.items?.length > 3" class="text-gray-400">+{{ trx.items.length - 3 }}</span>
              </span>
            </div>

            <!-- Total -->
            <span class="text-sm font-bold text-gray-900">{{ formatCurrency(trx.total_price) }}</span>

            <!-- Metode -->
            <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold" :class="paymentBadgeClass(trx.payment_method)">
              {{ trx.payment_method?.toUpperCase() ?? 'CASH' }}
            </span>

            <!-- Detail button -->
            <button class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-semibold text-[#117c6f] hover:underline">
              Detail
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PAGINATION ──────────────────────────────────────────── -->
    <div v-if="pagination.last_page > 1" class="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-3 shadow-sm">
      <p class="text-sm text-gray-500">
        Menampilkan {{ pagination.from }}–{{ pagination.to }} dari {{ pagination.total }}
      </p>
      <div class="flex items-center gap-1">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
          :class="page === pagination.current_page ? 'bg-[#117c6f] text-white' : 'text-gray-600 hover:bg-gray-100'"
          @click="changePage(page)"
        >{{ page }}</button>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- ── MODAL DETAIL ───────────────────────────────────────── -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-if="showDetail" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" @click.self="showDetail = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 class="font-display font-bold text-lg text-gray-900">Detail Transaksi</h3>
              <p class="text-xs text-gray-400 mt-0.5">#{{ String(selectedTrx?.id ?? 0).padStart(5, '0') }}</p>
            </div>
            <button class="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors" @click="showDetail = false">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Loading detail -->
          <div v-if="isLoadingDetail" class="p-6 space-y-3">
            <div v-for="i in 4" :key="i" class="flex gap-3">
              <div class="w-10 h-10 bg-gray-100 rounded-xl animate-pulse"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 bg-gray-100 rounded animate-pulse"></div>
                <div class="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Detail content -->
          <div v-else-if="selectedTrx" class="p-6 space-y-5">

            <!-- Info transaksi -->
            <div class="grid grid-cols-2 gap-3">
              <div class="bg-gray-50 rounded-xl p-3">
                <p class="text-xs text-gray-400 mb-1">Waktu</p>
                <p class="text-sm font-semibold text-gray-800">{{ formatDate(selectedTrx.created_at) }}</p>
                <p class="text-xs text-gray-500">{{ formatTime(selectedTrx.created_at) }}</p>
              </div>
              <div class="bg-gray-50 rounded-xl p-3">
                <p class="text-xs text-gray-400 mb-1">Metode Bayar</p>
                <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold" :class="paymentBadgeClass(selectedTrx.payment_method)">
                  {{ selectedTrx.payment_method?.toUpperCase() ?? 'CASH' }}
                </span>
              </div>
            </div>

            <!-- Item list -->
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Item Dibeli</p>
              <div class="space-y-2">
                <div v-for="item in selectedTrx.items" :key="item.id" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                    <img v-if="item.product?.image_url" :src="item.product.image_url" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold text-gray-300">
                      {{ item.product?.name?.charAt(0) }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-gray-800 truncate">{{ item.product?.name ?? 'Produk dihapus' }}</p>
                    <p class="text-xs text-gray-400">{{ item.qty }} x {{ formatCurrency(item.price) }}</p>
                  </div>
                  <p class="text-sm font-bold text-gray-900 flex-shrink-0">{{ formatCurrency(item.price * item.qty) }}</p>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="bg-[#117c6f]/5 border border-[#117c6f]/10 rounded-xl p-4 space-y-2">
              <div class="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{{ formatCurrency(selectedTrx.items?.reduce((s, i) => s + i.price * i.qty, 0) ?? 0) }}</span>
              </div>
              <div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-[#117c6f]/10">
                <span>Total</span>
                <span class="text-[#117c6f]">{{ formatCurrency(selectedTrx.total_price) }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-5">
            <button class="w-full py-2.5 bg-[#117c6f] text-white text-sm font-semibold rounded-xl hover:bg-[#1B6CA8] transition-colors" @click="showDetail = false">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/lib/axios'

// ── Types ─────────────────────────────────────────────────────────────────────
interface TransactionItem {
  id: number
  product_id: number
  qty: number
  price: number
  product: { name: string; image_url: string | null } | null
}

interface Transaction {
  id: number
  total_price: number
  payment_method: string | null
  created_at: string
  items: TransactionItem[]
}

// ── State ─────────────────────────────────────────────────────────────────────
const isLoading       = ref(true)
const isLoadingDetail = ref(false)
const showDetail      = ref(false)
const transactions    = ref<Transaction[]>([])
const selectedTrx     = ref<Transaction | null>(null)
const totalRevenue    = ref(0)

const pagination = reactive({
  total: 0, current_page: 1, last_page: 1, from: 0, to: 0
})

const filters = reactive({
    date_range: null as [Date, Date] | null,
    payment_method: '',
})

// ── Computed ──────────────────────────────────────────────────────────────────
const hasActiveFilter = computed(() => {
  return filters.date_range !== null || filters.payment_method !== '' || filters.payment_method !== ''
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, pagination.current_page - 2)
  const end   = Math.min(pagination.last_page, pagination.current_page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchTransactions(page = 1) {
  isLoading.value = true
  try {
    const params: any = { page, per_page: 15 }
    if (filters.date_range) {
        params.date_from = filters.date_range[0].toISOString().split('T')[0]
        params.date_to   = filters.date_range[1].toISOString().split('T')[0]
    }
    if (filters.payment_method)  params.payment_method  = filters.payment_method

    const { data } = await api.get('/auth/transactions', { params })

    transactions.value = data.data
    Object.assign(pagination, {
      total:        data.total,
      current_page: data.current_page,
      last_page:    data.last_page,
      from:         data.from,
      to:           data.to,
    })

    // Hitung total revenue dari halaman ini
    totalRevenue.value = data.data.reduce((sum: number, t: Transaction) => sum + t.total_price, 0)

  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function openDetail(id: number) {
  showDetail.value      = true
  isLoadingDetail.value = true
  selectedTrx.value     = null
  try {
    const { data } = await api.get(`/auth/transactions/${id}`)
    selectedTrx.value = data
  } catch (err) {
    console.error(err)
    showDetail.value = false
  } finally {
    isLoadingDetail.value = false
  }
}

onMounted(() => fetchTransactions())

// ── Filter ────────────────────────────────────────────────────────────────────
function resetFilters() {
  filters.date_range = null
  filters.payment_method = ''
  fetchTransactions()
}

function changePage(page: number) {
  if (page < 1 || page > pagination.last_page) return
  fetchTransactions(page)
}

// ── Badge class ───────────────────────────────────────────────────────────────
function paymentBadgeClass(method: string | null) {
  if (method === 'transfer') return 'bg-blue-50 text-blue-600'
  if (method === 'qris')     return 'bg-violet-50 text-violet-600'
  return 'bg-emerald-50 text-emerald-600'
}

// ── Format ────────────────────────────────────────────────────────────────────
function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(value ?? 0)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  })
}
</script>