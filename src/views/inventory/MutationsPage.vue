<template>
  <div class="space-y-5">

    <!-- ── HEADER ─────────────────────────────────────────────── -->
    <div>
      <h2 class="font-bold text-xl text-gray-900">Mutasi Stok</h2>
      <p class="text-sm text-gray-400 mt-0.5">Riwayat semua perubahan stok produk</p>
    </div>

    <!-- ── FILTER ─────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
      <!-- Search produk -->
      <div class="relative flex-1 min-w-[200px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari nama produk..."
          class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] focus:ring-2 focus:ring-[#117c6f]/10 transition-all"
          @input="debouncedFetch"
        />
      </div>

      <!-- Tipe -->
      <select
        v-model="filters.type"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white text-gray-600"
        @change="fetchMutations"
      >
        <option value="">Semua Tipe</option>
        <option value="opname">Stok Opname</option>
        <option value="in">Stok Masuk</option>
        <option value="out">Stok Keluar</option>
      </select>

      <!-- Tanggal dari -->
      <input
        v-model="filters.date_from"
        type="date"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white text-gray-600"
        @change="fetchMutations"
      />

      <!-- Tanggal sampai -->
      <input
        v-model="filters.date_to"
        type="date"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white text-gray-600"
        @change="fetchMutations"
      />

      <!-- Reset -->
      <button
        v-if="hasFilter"
        class="flex items-center gap-1.5 px-3 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        @click="resetFilters"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        Reset
      </button>
    </div>

    <!-- ── TABLE ──────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <!-- Loading -->
      <div v-if="isLoading">
        <div v-for="i in 8" :key="i" class="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
          <div class="w-9 h-9 bg-gray-100 rounded-lg animate-pulse shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-100 rounded animate-pulse w-1/3"></div>
            <div class="h-2.5 bg-gray-50 rounded animate-pulse w-1/4"></div>
          </div>
          <div class="h-5 w-16 bg-gray-100 rounded-full animate-pulse"></div>
          <div class="h-5 w-12 bg-gray-100 rounded animate-pulse"></div>
          <div class="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="mutations.length === 0" class="py-20 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 8h20M4 14h20M4 20h12" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="font-semibold text-gray-500">Belum ada mutasi stok</p>
        <p class="text-sm text-gray-400 mt-1">Mutasi akan tercatat saat ada transaksi atau stok opname</p>
      </div>

      <!-- Table -->
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/60">
            <th class="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Produk</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tipe</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sebelum</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sesudah</th>
            <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Selisih</th>
            <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Catatan</th>
            <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Oleh</th>
            <th class="text-right px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Waktu</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="mut in mutations"
            :key="mut.id"
            class="hover:bg-gray-50/50 transition-colors"
          >
            <!-- Produk -->
            <td class="px-6 py-3.5">
              <p class="text-sm font-semibold text-gray-800">{{ mut.product?.name ?? '—' }}</p>
              <p class="text-xs text-gray-400 font-mono">{{ mut.product?.sku || '—' }}</p>
            </td>

            <!-- Tipe -->
            <td class="px-4 py-3.5 text-center">
              <span
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="typeBadgeClass(mut.type)"
              >
                {{ typeLabel(mut.type) }}
              </span>
            </td>

            <!-- Before -->
            <td class="px-4 py-3.5 text-center">
              <span class="text-sm font-semibold text-gray-600">{{ mut.quantity_before }}</span>
            </td>

            <!-- After -->
            <td class="px-4 py-3.5 text-center">
              <span class="text-sm font-semibold text-gray-800">{{ mut.quantity_after }}</span>
            </td>

            <!-- Diff -->
            <td class="px-4 py-3.5 text-center">
              <span
                class="text-sm font-bold"
                :class="mut.quantity_diff > 0 ? 'text-emerald-600' : mut.quantity_diff < 0 ? 'text-red-500' : 'text-gray-400'"
              >
                {{ mut.quantity_diff > 0 ? '+' : '' }}{{ mut.quantity_diff }}
              </span>
            </td>

            <!-- Catatan -->
            <td class="px-4 py-3.5 hidden md:table-cell">
              <p class="text-xs text-gray-500 max-w-[160px] truncate">{{ mut.notes || '—' }}</p>
            </td>

            <!-- User -->
            <td class="px-4 py-3.5 hidden lg:table-cell">
              <p class="text-xs text-gray-500">{{ mut.user?.name ?? 'Sistem' }}</p>
            </td>

            <!-- Waktu -->
            <td class="px-6 py-3.5 text-right">
              <p class="text-xs font-semibold text-gray-700">{{ formatDate(mut.created_at) }}</p>
              <p class="text-[10px] text-gray-400">{{ formatTime(mut.created_at) }}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Menampilkan {{ pagination.from }}–{{ pagination.to }} dari {{ pagination.total }}
        </p>
        <div class="flex items-center gap-1">
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
            :disabled="pagination.current_page === 1"
            @click="changePage(pagination.current_page - 1)"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
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
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/lib/axios'

interface Mutation {
  id: number
  type: 'opname' | 'in' | 'out'
  quantity_before: number
  quantity_after: number
  quantity_diff: number
  notes: string | null
  reference: string | null
  created_at: string
  product: { id: number; name: string; sku: string | null } | null
  user: { id: number; name: string } | null
}

const isLoading = ref(true)
const mutations = ref<Mutation[]>([])

const pagination = reactive({ total: 0, current_page: 1, last_page: 1, from: 0, to: 0 })
const filters    = reactive({ search: '', type: '', date_from: '', date_to: '' })

const hasFilter = computed(() =>
  filters.search || filters.type || filters.date_from || filters.date_to
)

const visiblePages = computed(() => {
  const pages = [], s = Math.max(1, pagination.current_page - 2), e = Math.min(pagination.last_page, pagination.current_page + 2)
  for (let i = s; i <= e; i++) pages.push(i)
  return pages
})

async function fetchMutations(page = 1) {
  isLoading.value = true
  try {
    const params: any = { page, per_page: 20 }
    if (filters.search)    params.search    = filters.search
    if (filters.type)      params.type      = filters.type
    if (filters.date_from) params.date_from = filters.date_from
    if (filters.date_to)   params.date_to   = filters.date_to
    const { data } = await api.get('/auth/inventory/mutations', { params })
    mutations.value = data.data
    Object.assign(pagination, { total: data.total, current_page: data.current_page, last_page: data.last_page, from: data.from, to: data.to })
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(fetchMutations)

let searchTimer: ReturnType<typeof setTimeout>
function debouncedFetch() { clearTimeout(searchTimer); searchTimer = setTimeout(() => fetchMutations(), 400) }
function changePage(p: number) { if (p >= 1 && p <= pagination.last_page) fetchMutations(p) }
function resetFilters() { Object.assign(filters, { search: '', type: '', date_from: '', date_to: '' }); fetchMutations() }

function typeLabel(type: string) {
  return { opname: 'Opname', in: 'Masuk', out: 'Keluar' }[type] ?? type
}

function typeBadgeClass(type: string) {
  return {
    opname: 'bg-blue-50 text-blue-700',
    in:     'bg-emerald-50 text-emerald-700',
    out:    'bg-red-50 text-red-600',
  }[type] ?? 'bg-gray-100 text-gray-600'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
@reference "tailwindcss";
</style>