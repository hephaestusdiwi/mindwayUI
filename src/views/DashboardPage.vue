<template>
  <div class="space-y-6 animate-fade-in">
    <!-- ── STAT CARDS ─────────────────────────────────────────── -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Penjualan hari ini -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >Penjualan Hari Ini</span
          >
          <div class="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 10h14M3 6h14M3 14h8"
                stroke="#3B82F6"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 font-display">
          {{ formatCurrency(stats.today_sales) }}
        </p>
        <div class="flex items-center gap-1.5 mt-1.5">
          <span
            class="text-xs font-semibold px-1.5 py-0.5 rounded-md"
            :class="
              stats.sales_growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            "
          >
            {{ stats.sales_growth >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.sales_growth) }}%
          </span>
          <span class="text-xs text-gray-400">vs kemarin</span>
        </div>
      </div>

      <!-- Transaksi -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >Transaksi</span
          >
          <div class="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="#7C3AED" stroke-width="1.6" />
              <path d="M2 8h16" stroke="#7C3AED" stroke-width="1.6" />
              <path
                d="M6 12h2M10 12h2"
                stroke="#7C3AED"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 font-display">{{ stats.today_transactions }}</p>
        <div class="flex items-center gap-1.5 mt-1.5">
          <span
            class="text-xs font-semibold px-1.5 py-0.5 rounded-md"
            :class="
              stats.transaction_growth >= 0
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-500'
            "
          >
            {{ stats.transaction_growth >= 0 ? '↑' : '↓' }}
            {{ Math.abs(stats.transaction_growth) }}%
          </span>
          <span class="text-xs text-gray-400">vs kemarin</span>
        </div>
      </div>

      <!-- Pelanggan -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >Total Pelanggan</span
          >
          <div class="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="8" cy="6" r="3" stroke="#10B981" stroke-width="1.6" />
              <path
                d="M2 17c0-3.3 2.7-6 6-6s6 2.7 6 6"
                stroke="#10B981"
                stroke-width="1.6"
                stroke-linecap="round"
              />
              <path
                d="M15 8v4M13 10h4"
                stroke="#10B981"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 font-display">{{ stats.total_customers }}</p>
        <div class="flex items-center gap-1.5 mt-1.5">
          <span
            class="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600"
          >
            +{{ stats.new_customers_today }} hari ini
          </span>
        </div>
      </div>

      <!-- Total produk -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >Total Produk</span
          >
          <div class="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 5l7-3 7 3v8l-7 4-7-4V5z"
                stroke="#F97316"
                stroke-width="1.6"
                stroke-linejoin="round"
              />
              <path
                d="M10 2v14M3 5l7 4 7-4"
                stroke="#F97316"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-gray-900 font-display">{{ stats.total_products }}</p>
        <div class="flex items-center gap-1.5 mt-1.5">
          <span class="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-orange-50 text-orange-500">
            {{ lowStock.length }} stok menipis
          </span>
        </div>
      </div>
    </div>

    <!-- ── ROW 2: Grafik + Produk Terlaris ────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- Grafik mingguan -->
      <div class="xl:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-5">
          <div>
            <h3 class="font-bold text-gray-900 font-display">Penjualan Mingguan</h3>
            <p class="text-xs text-gray-400 mt-0.5">7 hari terakhir</p>
          </div>
        </div>

        <!-- Bar chart manual -->
        <div v-if="!isLoading" class="flex items-end gap-2 h-40">
          <div
            v-for="(day, i) in weeklySales"
            :key="i"
            class="flex-1 flex flex-col items-center gap-1.5 group"
          >
            <span
              class="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              {{ formatCurrencyShort(day.total) }}
            </span>
            <div
              class="w-full rounded-t-lg transition-all duration-500 relative self-end"
              :style="barStyle(day.total)"
              :class="i === 6 ? 'bg-[#117c6f]' : 'bg-[#117c6f]/20 group-hover:bg-[#117c6f]/40'"
            ></div>
            <span class="text-[11px] text-gray-400 font-medium">{{ day.date }}</span>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-else class="flex items-end gap-2 h-40">
          <div v-for="i in 7" :key="i" class="flex-1 flex flex-col items-center gap-1.5">
            <div
              class="w-full rounded-t-lg bg-gray-100 animate-pulse"
              :style="`height: ${Math.random() * 80 + 20}%`"
            ></div>
            <div class="w-6 h-3 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Produk terlaris -->
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="mb-5">
          <h3 class="font-bold text-gray-900 font-display">Produk Terlaris</h3>
          <p class="text-xs text-gray-400 mt-0.5">Minggu ini</p>
        </div>

        <div v-if="!isLoading" class="space-y-3">
          <div
            v-for="(product, i) in topProducts"
            :key="product.id"
            class="flex items-center gap-3"
          >
            <span
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              :class="
                i === 0
                  ? 'bg-yellow-100 text-yellow-600'
                  : i === 1
                    ? 'bg-gray-100 text-gray-500'
                    : i === 2
                      ? 'bg-orange-100 text-orange-500'
                      : 'bg-gray-50 text-gray-400'
              "
            >
              {{ i + 1 }}
            </span>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ product.name }}</p>
              <p class="text-xs text-gray-400">{{ product.sold_count }} terjual</p>
            </div>
            <span class="text-sm font-bold text-gray-900 flex-shrink-0">{{
              formatCurrencyShort(product.price)
            }}</span>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-else class="space-y-3">
          <div v-for="i in 5" :key="i" class="flex items-center gap-3">
            <div class="w-6 h-6 rounded-full bg-gray-100 animate-pulse"></div>
            <div class="flex-1 space-y-1">
              <div class="h-3 bg-gray-100 rounded animate-pulse"></div>
              <div class="h-2.5 bg-gray-100 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── ROW 3: Stok Hampir Habis ───────────────────────────── -->
    <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div class="flex items-center justify-between mb-5">
        <div>
          <h3 class="font-bold text-gray-900 font-display">Stok Hampir Habis</h3>
          <p class="text-xs text-gray-400 mt-0.5">Produk dengan stok ≤ 10</p>
        </div>
        <router-link to="/products" class="text-xs font-semibold text-[#117c6f] hover:underline"
          >Kelola Produk →</router-link
        >
      </div>

      <div v-if="!isLoading">
        <div v-if="lowStock.length === 0" class="text-center py-8 text-gray-400 text-sm">
          🎉 Semua stok dalam kondisi aman
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="product in lowStock"
            :key="product.id"
            class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/50 transition-colors"
          >
            <div
              class="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 6v5M10 14h.01"
                  stroke="#F97316"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <path
                  d="M3 17L10 3l7 14H3z"
                  stroke="#F97316"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-gray-800 truncate">{{ product.name }}</p>
              <p
                class="text-xs font-bold"
                :class="
                  product.stock === 0
                    ? 'text-red-500'
                    : product.stock <= 5
                      ? 'text-orange-500'
                      : 'text-yellow-500'
                "
              >
                {{ product.stock === 0 ? 'Habis!' : `Sisa ${product.stock}` }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div
          v-for="i in 4"
          :key="i"
          class="flex items-center gap-3 p-3 rounded-xl border border-gray-100"
        >
          <div class="w-9 h-9 rounded-xl bg-gray-100 animate-pulse"></div>
          <div class="flex-1 space-y-1.5">
            <div class="h-3 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-2.5 bg-gray-100 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/lib/axios'

// ── State ─────────────────────────────────────────────────────────────────────
const isLoading = ref(true)

const stats = ref({
  today_sales: 0,
  sales_growth: 0,
  today_transactions: 0,
  transaction_growth: 0,
  total_customers: 0,
  new_customers_today: 0,
  total_products: 0,
})

const weeklySales = ref<{ date: string; total: number; count: number }[]>([])
const topProducts = ref<{ id: number; name: string; price: number; sold_count: number }[]>([])
const lowStock = ref<{ id: number; name: string; stock: number; price: number }[]>([])

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchDashboard() {
  try {
    const { data } = await api.get('/auth/dashboard')

    console.log('FULL DATA:', data)
    console.log('WEEKLY SALES:', data.weekly_sales)

    stats.value = data.stats
    weeklySales.value = data.weekly_sales
    topProducts.value = data.top_products
    lowStock.value = data.low_stock
  } catch (err) {
    console.error('Gagal fetch dashboard:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchDashboard)

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

function formatCurrencyShort(value: number) {
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`
  return `Rp ${value}`
}

const maxSales = computed(() => Math.max(...weeklySales.value.map((d) => d.total), 1))

function barStyle(total: number) {
  const value = Number(total) || 0
  const max = maxSales.value || 1

  const maxHeight = 160 // sama dengan h-40 (160px)
  const height = (value / max) * maxHeight

  return {
    height: Math.max(height, 12) + 'px',
  }
}
</script>
