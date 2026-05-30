<template>
  <div class="p-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <button
          @click="$router.back()"
          class="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L6 8l4 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div>
          <h1 class="text-xl font-semibold text-gray-900">Kartu Stok</h1>
          <p class="text-sm text-gray-400 mt-0.5">
            <template v-if="product">
              {{ product.name }} —
              Stok saat ini:
              <strong class="text-gray-700">{{ product.current_stock }}</strong>
            </template>
            <template v-else>Pilih produk untuk melihat riwayat mutasi</template>
          </p>
        </div>
      </div>
    </div>

    <!-- Filter bar -->
    <div class="flex flex-wrap gap-2 mb-4">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.4"/>
          <path d="M11 11l2.5 2.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <input
          v-model="searchQuery"
          @input="filterProducts"
          placeholder="Cari produk..."
          class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] w-56 transition-all"
        />
      </div>
      <select
        v-model="selectedProductId"
        @change="fetchLedger"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] w-64 transition-all"
      >
        <option value="">— Pilih Produk —</option>
        <option v-for="p in filteredProducts" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>
      <input
        v-model="filters.from"
        @change="fetchLedger"
        type="date"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all"
      />
      <input
        v-model="filters.to"
        @change="fetchLedger"
        type="date"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all"
      />
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/70">
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-36">Tanggal</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Keterangan</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-32">No. Dokumen</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-24">Masuk</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-24">Keluar</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-24">Saldo</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-32">Harga Pokok</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Oleh</th>
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

          <!-- Belum pilih produk -->
          <tr v-else-if="!selectedProductId">
            <td colspan="8" class="text-center py-16">
              <div class="flex flex-col items-center gap-3 text-gray-400">
                <svg class="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <rect x="5" y="5" width="30" height="30" rx="4" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M12 14h16M12 20h12M12 26h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <p class="text-sm font-medium">Pilih produk untuk melihat kartu stok</p>
              </div>
            </td>
          </tr>

          <!-- Tidak ada data -->
          <tr v-else-if="!ledger.length">
            <td colspan="8" class="text-center py-16">
              <div class="flex flex-col items-center gap-3 text-gray-400">
                <svg class="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <rect x="5" y="5" width="30" height="30" rx="4" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M20 14v12M14 20h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <p class="text-sm font-medium">Belum ada mutasi stok untuk produk ini</p>
              </div>
            </td>
          </tr>

          <!-- Rows -->
          <tr
            v-for="row in ledger"
            :key="row.id"
            class="hover:bg-gray-50/60 transition-colors"
          >
            <td class="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{{ formatDateTime(row.created_at) }}</td>
            <td class="px-4 py-3">
              <span class="text-xs font-medium text-gray-800">{{ row.ref_label }}</span>
              <span v-if="row.notes" class="text-xs text-gray-400 ml-1">— {{ row.notes }}</span>
            </td>
            <td class="px-4 py-3">
              <span v-if="row.ref_number" class="font-mono text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">
                {{ row.ref_number }}
              </span>
              <span v-else class="text-gray-400 text-xs">—</span>
            </td>
            <td class="px-4 py-3 text-right">
              <span v-if="row.qty_in > 0" class="text-emerald-600 font-semibold text-sm">+{{ row.qty_in }}</span>
              <span v-else class="text-gray-300 text-sm">—</span>
            </td>
            <td class="px-4 py-3 text-right">
              <span v-if="row.qty_out > 0" class="text-red-500 font-semibold text-sm">-{{ row.qty_out }}</span>
              <span v-else class="text-gray-300 text-sm">—</span>
            </td>
            <td class="px-4 py-3 text-right font-semibold text-gray-900 text-sm">{{ row.qty_balance }}</td>
            <td class="px-4 py-3 text-right text-xs text-gray-500">{{ formatCurrency(row.unit_cost) }}</td>
            <td class="px-4 py-3 text-xs text-gray-500">{{ row.created_by?.name || '—' }}</td>
          </tr>

        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import api from '@/lib/axios'

const loading           = ref(false)
const products          = ref<any[]>([])
const ledger            = ref<any[]>([])
const product           = ref<any>(null)
const selectedProductId = ref('')
const searchQuery       = ref('')
const filters           = reactive({ from: '', to: '' })

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => p.name.toLowerCase().includes(q))
})

function filterProducts() {
  // Reactivity handled by computed — just clears selection if product no longer visible
  if (selectedProductId.value) {
    const still = filteredProducts.value.find(p => p.id == selectedProductId.value)
    if (!still) {
      selectedProductId.value = ''
      ledger.value = []
      product.value = null
    }
  }
}

async function fetchLedger() {
  if (!selectedProductId.value) return
  loading.value = true
  try {
    const { data } = await api.get(`/auth/stock-ledger/${selectedProductId.value}`, { params: filters })
    product.value = data.product
    ledger.value  = data.ledger
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const { data } = await api.get('/auth/products', { params: { is_active: 1, per_page: 500 } })
  products.value = data.data
})
</script>