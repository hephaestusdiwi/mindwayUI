<template>
  <div class="p-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Peringatan Stok</h1>
        <p class="text-sm text-gray-400 mt-0.5">Produk yang perlu segera diisi ulang</p>
      </div>
      <button
        @click="$router.push('/purchasing/purchase-orders/create')"
        class="flex items-center gap-2 px-4 py-2 bg-[#117c6f] hover:bg-[#0e6b5f] text-white text-sm font-medium rounded-xl transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        Buat PO
      </button>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="text-red-500">
            <circle cx="11" cy="11" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M11 7v5M11 13.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-0.5">Habis (Stok = 0)</p>
          <p class="text-2xl font-bold text-red-600">{{ summary.out_of_stock }}</p>
          <p class="text-xs text-gray-400">produk</p>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="text-amber-500">
            <path d="M11 3L2 18h18L11 3z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
            <path d="M11 9v5M11 15.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-0.5">Kritis (≤ stok min)</p>
          <p class="text-2xl font-bold text-amber-500">{{ summary.critical }}</p>
          <p class="text-xs text-gray-400">produk</p>
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="text-yellow-500">
            <path d="M11 2v4M11 16v4M2 11h4M16 11h4M4.93 4.93l2.83 2.83M14.24 14.24l2.83 2.83M4.93 17.07l2.83-2.83M14.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div>
          <p class="text-xs text-gray-400 mb-0.5">Rendah (≤ reorder point)</p>
          <p class="text-2xl font-bold text-yellow-600">{{ summary.low }}</p>
          <p class="text-xs text-gray-400">produk</p>
        </div>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex flex-wrap gap-2 mb-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.4"/>
          <path d="M11 11l2.5 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <input v-model="search" placeholder="Cari produk..."
          class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] w-56 transition-all" />
      </div>
      <select v-model="filterLevel"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
        <option value="">Semua Level</option>
        <option value="out_of_stock">Habis</option>
        <option value="critical">Kritis</option>
        <option value="low">Rendah</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/70">
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Produk</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Kategori</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Stok Saat Ini</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-24">Stok Min</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Reorder Point</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-24">Kekurangan</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-24">Level</th>
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
          <tr v-else-if="!filteredProducts.length">
            <td colspan="7" class="text-center py-16">
              <div class="flex flex-col items-center gap-3 text-gray-400">
                <svg class="w-12 h-12" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M16 24l5 5 11-11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <p class="text-sm font-medium">
                  {{ allProducts.length ? 'Tidak ada produk sesuai filter' : 'Semua stok aman!' }}
                </p>
                <p class="text-xs text-gray-300">Tidak ada produk yang perlu perhatian saat ini</p>
              </div>
            </td>
          </tr>
          <tr v-for="p in filteredProducts" :key="p.id" class="hover:bg-gray-50/60 transition-colors">
            <td class="px-4 py-3">
              <div class="font-medium text-gray-900">{{ p.name }}</div>
              <div v-if="p.sku" class="text-xs text-gray-400 font-mono mt-0.5">{{ p.sku }}</div>
            </td>
            <td class="px-4 py-3 text-xs text-gray-500">{{ p.category?.name || '—' }}</td>
            <td class="px-4 py-3 text-right">
              <span class="font-bold text-sm"
                :class="p.current_stock <= 0 ? 'text-red-600' : 'text-gray-900'">
                {{ p.current_stock }}
              </span>
            </td>
            <td class="px-4 py-3 text-right text-gray-500 text-sm">{{ p.min_stock }}</td>
            <td class="px-4 py-3 text-right text-gray-500 text-sm">{{ p.reorder_point }}</td>
            <td class="px-4 py-3 text-right">
              <span v-if="p.shortage > 0" class="font-bold text-sm text-red-500">{{ p.shortage }}</span>
              <span v-else class="text-gray-300 text-sm">—</span>
            </td>
            <td class="px-4 py-3">
              <span :class="levelClass(p.status_level)" class="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold">
                {{ levelLabel(p.status_level) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStockAlertStore } from '@/stores/stockAlert'

const store   = useStockAlertStore()
const loading = ref(false)
const search  = ref('')
const filterLevel = ref('')

const allProducts = computed(() => store.lowStockProducts as any[])
const summary     = computed(() => store.summary)

const filteredProducts = computed(() =>
  allProducts.value.filter(p => {
    const matchSearch = !search.value
      || p.name.toLowerCase().includes(search.value.toLowerCase())
      || p.sku?.includes(search.value)
    const matchLevel = !filterLevel.value || p.status_level === filterLevel.value
    return matchSearch && matchLevel
  })
)

function levelClass(level: string) {
  return {
    out_of_stock: 'bg-red-50 text-red-600',
    critical:     'bg-amber-50 text-amber-600',
    low:          'bg-yellow-50 text-yellow-700',
  }[level] ?? 'bg-gray-100 text-gray-600'
}

function levelLabel(level: string) {
  return { out_of_stock: 'Habis', critical: 'Kritis', low: 'Rendah' }[level] ?? level
}

onMounted(async () => {
  loading.value = true
  await store.fetchLowStock()
  loading.value = false
})
</script>