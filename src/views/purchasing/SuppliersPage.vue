<template>
  <div class="p-6">

    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Master Supplier</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ pagination.total ?? 0 }} supplier terdaftar</p>
      </div>
      <button
        @click="openForm()"
        class="flex items-center gap-2 px-4 py-2 bg-[#117c6f] hover:bg-[#0e6b5f] text-white text-sm font-medium rounded-xl transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        Tambah Supplier
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
          placeholder="Cari nama / kode..."
          class="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] w-56 transition-all"
        />
      </div>
      <select v-model="filters.status" @change="fetchData"
        class="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
        <option value="">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="inactive">Non-aktif</option>
      </select>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/70">
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-28">Kode</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Nama Supplier</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Kontak</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-32">Termin</th>
            <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-24">Status</th>
            <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 w-20">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-if="loading">
            <td colspan="6" class="text-center py-16">
              <div class="flex flex-col items-center gap-2 text-gray-400">
                <svg class="w-6 h-6 animate-spin text-[#117c6f]" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="12"/>
                </svg>
                <span class="text-sm">Memuat...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="!suppliers.length">
            <td colspan="6" class="text-center py-16">
              <div class="flex flex-col items-center gap-3 text-gray-400">
                <svg class="w-10 h-10" viewBox="0 0 40 40" fill="none">
                  <path d="M8 10h24M8 20h16M8 30h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <circle cx="30" cy="30" r="7" fill="white" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M30 27v6M27 30h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <p class="text-sm font-medium">Belum ada supplier</p>
                <button @click="openForm()" class="text-xs text-[#117c6f] hover:underline font-medium">
                  Tambah supplier pertama →
                </button>
              </div>
            </td>
          </tr>
          <tr
            v-for="s in suppliers" :key="s.id"
            class="hover:bg-gray-50/60 transition-colors group"
          >
            <td class="px-4 py-3">
              <span class="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg">{{ s.code }}</span>
            </td>
            <td class="px-4 py-3">
              <div class="font-medium text-gray-900">{{ s.name }}</div>
              <div v-if="s.email" class="text-xs text-gray-400 mt-0.5">{{ s.email }}</div>
            </td>
            <td class="px-4 py-3">
              <div class="text-gray-700 text-sm">{{ s.contact_person || '—' }}</div>
              <div v-if="s.phone" class="text-xs text-gray-400 mt-0.5">{{ s.phone }}</div>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                {{ termLabel(s.payment_terms) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span :class="s.status === 'active'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-gray-100 text-gray-500'"
                class="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold">
                {{ s.status === 'active' ? 'Aktif' : 'Non-aktif' }}
              </span>
            </td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="openForm(s)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M10.5 2.5l2 2L5 12H3v-2l7.5-7.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button
                  @click="confirmDelete(s)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="Hapus"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M3 4h9M6 4V2.5h3V4M5.5 4v7.5h4V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
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

    <!-- Modal Form -->
    <SupplierFormModal
      v-if="showForm"
      :supplier="selectedSupplier"
      @close="showForm = false"
      @saved="onSaved"
    />

    <!-- Delete confirm dialog -->
    <div v-if="deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-[380px]">
        <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="text-red-500">
            <path d="M11 8v5M11 14.5v.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M9.5 3.5L2 18h18L11.5 3.5a.6.6 0 00-1 0z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="text-center font-semibold text-gray-900 mb-1">Hapus Supplier?</p>
        <p class="text-center text-sm text-gray-500 mb-6">
          <span class="font-medium text-gray-700">{{ deleteTarget.name }}</span> akan dihapus permanen.
        </p>
        <div class="flex gap-3">
          <button @click="deleteTarget = null"
            class="flex-1 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button @click="doDelete"
            class="flex-1 py-2.5 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors">
            Hapus
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { usePurchasingStore } from '@/stores/purchasing'
import SupplierFormModal from '../components/products/purchasing/SupplierFormModal.vue'
import { useDebounceFn } from '@vueuse/core'
import { useToast } from '@/composables/useToast'

const store = usePurchasingStore()
const toast = useToast()
const { loading } = store

const suppliers      = ref<any[]>([])
const pagination     = ref<any>({})
const page           = ref(1)
const showForm       = ref(false)
const selectedSupplier = ref<any>(null)
const deleteTarget   = ref<any>(null)
const filters        = reactive({ search: '', status: '' })

async function fetchData() {
  const data = await store.fetchSuppliers({ page: page.value, ...filters })
  suppliers.value  = data.data
  pagination.value = data.meta ?? {}
}

const debouncedFetch = useDebounceFn(fetchData, 400)

function openForm(s: any = null) {
  selectedSupplier.value = s
  showForm.value = true
}

function onSaved() {
  showForm.value = false
  fetchData()
}

function confirmDelete(s: any) { deleteTarget.value = s }

async function doDelete() {
  await store.deleteSupplier(deleteTarget.value.id)
  toast.success('Supplier dihapus')
  deleteTarget.value = null
  fetchData()
}

function termLabel(t: string) {
  return { cash: 'Tunai', net7: 'Net 7', net14: 'Net 14', net30: 'Net 30', net60: 'Net 60' }[t] ?? t
}

onMounted(fetchData)
</script>