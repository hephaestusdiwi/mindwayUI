<template>
  <div class="space-y-5 animate-fade-in">

    <!-- ── HEADER ─────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display font-bold text-xl text-gray-900">Laporan</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ periodLabel }}</p>
      </div>

      <!-- Period selector -->
      <div class="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
        <button
          v-for="p in periods"
          :key="p.value"
          class="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          :class="period === p.value ? 'bg-[#117c6f] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="changePeriod(p.value)"
        >{{ p.label }}</button>
      </div>
    </div>

    <!-- ── SUMMARY CARDS ───────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">

      <!-- Pendapatan -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Pendapatan</span>
          <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M3 10h14M3 6h14M3 14h8" stroke="#3B82F6" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
        <p v-if="isLoading" class="h-8 w-32 bg-gray-100 rounded animate-pulse"></p>
        <p v-else class="text-2xl font-bold text-gray-900 font-display">{{ formatCurrency(summary.current_revenue) }}</p>
        <div class="flex items-center gap-1.5 mt-1.5">
          <span class="text-xs font-semibold px-1.5 py-0.5 rounded-md" :class="growthClass(summary.revenue_growth)">
            {{ summary.revenue_growth >= 0 ? '↑' : '↓' }} {{ Math.abs(summary.revenue_growth) }}%
          </span>
          <span class="text-xs text-gray-400">vs periode lalu</span>
        </div>
      </div>

      <!-- Transaksi -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Transaksi</span>
          <div class="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="#7C3AED" stroke-width="1.6"/>
              <path d="M2 8h16" stroke="#7C3AED" stroke-width="1.6"/>
            </svg>
          </div>
        </div>
        <p v-if="isLoading" class="h-8 w-20 bg-gray-100 rounded animate-pulse"></p>
        <p v-else class="text-2xl font-bold text-gray-900 font-display">{{ summary.current_trx }}</p>
        <div class="flex items-center gap-1.5 mt-1.5">
          <span class="text-xs font-semibold px-1.5 py-0.5 rounded-md" :class="growthClass(summary.trx_growth)">
            {{ summary.trx_growth >= 0 ? '↑' : '↓' }} {{ Math.abs(summary.trx_growth) }}%
          </span>
          <span class="text-xs text-gray-400">vs periode lalu</span>
        </div>
      </div>

      <!-- Rata-rata -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rata-rata Transaksi</span>
          <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4 14l4-4 3 3 5-6" stroke="#10B981" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <p v-if="isLoading" class="h-8 w-28 bg-gray-100 rounded animate-pulse"></p>
        <p v-else class="text-2xl font-bold text-gray-900 font-display">{{ formatCurrency(summary.avg_transaction) }}</p>
        <p class="text-xs text-gray-400 mt-1.5">per transaksi</p>
      </div>
    </div>

    <!-- ── GRAFIK PENJUALAN ────────────────────────────────────── -->
    <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="font-display font-bold text-gray-900">Grafik Penjualan</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ periodLabel }}</p>
        </div>
        <div class="flex items-center gap-3 text-xs text-gray-400">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-sm bg-[#117c6f]"></div>
            <span>Pendapatan</span>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex items-end gap-2 h-48">
        <div v-for="i in 7" :key="i" class="flex-1 flex flex-col items-center gap-2">
          <div class="w-full rounded-t-lg bg-gray-100 animate-pulse" :style="'height:' + (Math.random() * 70 + 20) + '%'"></div>
          <div class="w-8 h-2.5 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- Chart -->
      <div v-else class="flex items-end gap-1.5 h-48 group/chart">
        <div
          v-for="(item, i) in salesChart"
          :key="i"
          class="flex-1 flex flex-col items-center gap-1.5 group"
        >
          <div class="relative w-full flex flex-col items-center">
            <!-- Tooltip -->
            <div class="absolute bottom-full mb-1.5 bg-gray-900 text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {{ formatCurrencyShort(item.total) }}
              <br/>
              <span class="text-gray-400">{{ item.count }} trx</span>
            </div>
            <!-- Bar -->
            <div
              class="w-full rounded-t-lg transition-all duration-500"
              :class="item.total > 0 ? 'bg-[#117c6f] group-hover:bg-[#1B6CA8]' : 'bg-gray-100'"
              :style="barStyle(item.total)"
            ></div>
          </div>
          <span class="text-[9px] text-gray-400 font-medium text-center leading-tight">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- ── ROW 2: Produk Terlaris + Metode Bayar ──────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">

      <!-- Produk terlaris -->
      <div class="xl:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="mb-5">
          <h3 class="font-display font-bold text-gray-900">Produk Terlaris</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ periodLabel }}</p>
        </div>

        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-gray-100 animate-pulse"></div>
            <div class="flex-1 space-y-1.5">
              <div class="h-3 bg-gray-100 rounded animate-pulse"></div>
              <div class="h-2 bg-gray-100 rounded animate-pulse w-3/4"></div>
            </div>
            <div class="w-16 h-3 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="topProducts.length === 0" class="text-center py-8 text-gray-400 text-sm">
          Belum ada data penjualan
        </div>

        <div v-else class="space-y-3">
          <div v-for="(product, i) in topProducts" :key="product.id" class="flex items-center gap-3">
            <!-- Rank -->
            <span
              class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="rankClass(i)"
            >{{ i + 1 }}</span>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ product.name }}</p>
              <!-- Progress bar -->
              <div class="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full bg-[#117c6f] transition-all duration-700"
                  :style="'width:' + productBarWidth(product.total_qty) + '%'"
                ></div>
              </div>
            </div>

            <!-- Stats -->
            <div class="text-right flex-shrink-0">
              <p class="text-sm font-bold text-gray-900">{{ product.total_qty }} terjual</p>
              <p class="text-xs text-gray-400">{{ formatCurrencyShort(product.total_revenue) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Metode pembayaran -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="mb-5">
          <h3 class="font-display font-bold text-gray-900">Metode Bayar</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ periodLabel }}</p>
        </div>

        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="space-y-1.5">
            <div class="h-3 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-2 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="paymentMethods.length === 0" class="text-center py-8 text-gray-400 text-sm">
          Belum ada data
        </div>

        <div v-else class="space-y-4">
          <div v-for="method in paymentMethods" :key="method.payment_method">
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full" :class="paymentDotClass(method.payment_method)"></div>
                <span class="text-sm font-semibold text-gray-700 uppercase">{{ method.payment_method ?? 'Cash' }}</span>
              </div>
              <div class="text-right">
                <span class="text-sm font-bold text-gray-900">{{ method.count }}x</span>
                <span class="text-xs text-gray-400 ml-1">({{ paymentPercent(method.count) }}%)</span>
              </div>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-700"
                :class="paymentBarClass(method.payment_method)"
                :style="'width:' + paymentPercent(method.count) + '%'"
              ></div>
            </div>
            <p class="text-xs text-gray-400 mt-1">{{ formatCurrency(method.total) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── PEAK HOURS ──────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div class="mb-5">
        <h3 class="font-display font-bold text-gray-900">Jam Tersibuk</h3>
        <p class="text-xs text-gray-400 mt-0.5">Distribusi transaksi per jam</p>
      </div>

      <div v-if="isLoading" class="flex items-end gap-1 h-24">
        <div v-for="i in 16" :key="i" class="flex-1 bg-gray-100 rounded-t animate-pulse" :style="'height:' + (Math.random() * 80 + 10) + '%'"></div>
      </div>

      <div v-else class="flex items-end gap-1 h-24">
        <div
          v-for="(item, i) in peakHours"
          :key="i"
          class="flex-1 flex flex-col items-center gap-1 group"
        >
          <div class="relative w-full">
            <div class="absolute bottom-full mb-1 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 left-1/2 -translate-x-1/2">
              {{ item.count }} trx
            </div>
            <div
              class="w-full rounded-t transition-all duration-500"
              :class="item.count > 0 ? 'bg-[#117c6f]/70 group-hover:bg-[#117c6f]' : 'bg-gray-100'"
              :style="peakBarStyle(item.count)"
            ></div>
          </div>
          <span class="text-[8px] text-gray-400">{{ item.hour }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/lib/axios'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Summary {
  current_revenue:  number
  previous_revenue: number
  revenue_growth:   number
  current_trx:      number
  previous_trx:     number
  trx_growth:       number
  avg_transaction:  number
}

interface SalesChart {
  label: string
  total: number
  count: number
}

interface TopProduct {
  id: number
  name: string
  price: number
  total_qty: number
  total_revenue: number
}

interface PaymentMethod {
  payment_method: string | null
  count: number
  total: number
}

interface PeakHour {
  hour: string
  count: number
  total: number
}

// ── State ─────────────────────────────────────────────────────────────────────
const isLoading    = ref(true)
const period       = ref('weekly')
const summary      = ref<Summary>({ current_revenue: 0, previous_revenue: 0, revenue_growth: 0, current_trx: 0, previous_trx: 0, trx_growth: 0, avg_transaction: 0 })
const salesChart   = ref<SalesChart[]>([])
const topProducts  = ref<TopProduct[]>([])
const paymentMethods = ref<PaymentMethod[]>([])
const peakHours    = ref<PeakHour[]>([])

const periods = [
  { label: 'Harian',   value: 'daily' },
  { label: 'Mingguan', value: 'weekly' },
  { label: 'Bulanan',  value: 'monthly' },
]

// ── Computed ──────────────────────────────────────────────────────────────────
const periodLabel = computed(() => {
  if (period.value === 'daily')   return 'Hari ini'
  if (period.value === 'monthly') return 'Bulan ini'
  return 'Minggu ini'
})

const maxSales = computed(() => Math.max(...salesChart.value.map(d => d.total), 1))

const maxPeak = computed(() => Math.max(...peakHours.value.map(d => d.count), 1))

const totalTrxCount = computed(() => paymentMethods.value.reduce((sum, m) => sum + m.count, 0))

const maxProductQty = computed(() => Math.max(...topProducts.value.map(p => p.total_qty), 1))

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchReport() {
  isLoading.value = true
  try {
    const { data } = await api.get('/auth/reports', { params: { period: period.value } })
    summary.value        = data.summary
    salesChart.value     = data.sales_chart
    topProducts.value    = data.top_products
    paymentMethods.value = data.payment_methods
    peakHours.value      = data.peak_hours
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

function changePeriod(p: string) {
  period.value = p
  fetchReport()
}

onMounted(fetchReport)

// ── Style helpers ─────────────────────────────────────────────────────────────
function barStyle(total: number) {
  const value = Number(total) || 0
  const max = maxSales.value || 1

  const maxHeight = 192 // h-48 = 192px
  const height = (value / max) * maxHeight

  return {
    height: Math.max(height, value > 0 ? 12 : 0) + 'px',
  }
}

function peakBarStyle(count: number) {
  const value = Number(count) || 0
  const max = maxPeak.value || 1

  const maxHeight = 96 // h-24 = 96px
  const height = (value / max) * maxHeight

  return {
    height: Math.max(height, value > 0 ? 8 : 0) + 'px',
  }
}

function productBarWidth(qty: number) {
  return Math.max((qty / maxProductQty.value) * 100, 4)
}

function paymentPercent(count: number) {
  if (totalTrxCount.value === 0) return 0
  return Math.round((count / totalTrxCount.value) * 100)
}

// ── Class helpers ─────────────────────────────────────────────────────────────
function growthClass(growth: number) {
  return growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
}

function rankClass(i: number) {
  if (i === 0) return 'bg-yellow-100 text-yellow-600'
  if (i === 1) return 'bg-gray-100 text-gray-500'
  if (i === 2) return 'bg-orange-100 text-orange-500'
  return 'bg-gray-50 text-gray-400'
}

function paymentDotClass(method: string | null) {
  if (method === 'transfer') return 'bg-blue-500'
  if (method === 'qris')     return 'bg-violet-500'
  return 'bg-emerald-500'
}

function paymentBarClass(method: string | null) {
  if (method === 'transfer') return 'bg-blue-400'
  if (method === 'qris')     return 'bg-violet-400'
  return 'bg-emerald-400'
}

// ── Format ────────────────────────────────────────────────────────────────────
function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(value ?? 0)
}

function formatCurrencyShort(value: number) {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`
  if (value >= 1_000)     return `Rp ${(value / 1_000).toFixed(0)}rb`
  return `Rp ${value}`
}
</script>