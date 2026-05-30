<template>
  <div class="p-6 max-w-4xl">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="$router.back()"
        class="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Penyesuaian Stok</h1>
        <p class="text-sm text-gray-400">Koreksi stok dengan alasan yang tercatat</p>
      </div>
    </div>

    <form @submit.prevent="submit" class="space-y-4">

      <!-- Informasi Dokumen -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 class="text-sm font-semibold text-gray-700 mb-4">Informasi Dokumen</h2>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Tanggal <span class="text-red-500">*</span></label>
            <input v-model="form.adj_date" type="date" required
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Tipe <span class="text-red-500">*</span></label>
            <select v-model="form.type" required
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
              <option value="recount">Hitung Ulang (Recount)</option>
              <option value="addition">Penambahan Stok</option>
              <option value="reduction">Pengurangan Stok</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Alasan <span class="text-red-500">*</span></label>
            <input v-model="form.reason" required placeholder="Rusak, hilang, koreksi input..."
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>
          <div class="col-span-3">
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Catatan Tambahan</label>
            <textarea v-model="form.notes" rows="2" placeholder="Opsional..."
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all resize-none" />
          </div>
        </div>
      </div>

      <!-- Produk yang Disesuaikan -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-700">Produk yang Disesuaikan</h2>
          <button type="button" @click="addItem"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#117c6f] border border-[#117c6f]/30 bg-[#117c6f]/5 hover:bg-[#117c6f]/10 rounded-lg transition-colors">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            Tambah Produk
          </button>
        </div>

        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/70">
              <th class="text-left text-xs font-semibold text-gray-500 px-3 py-2.5">Produk</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-28">Stok Sistem</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-28">Stok Aktual</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-28">Selisih</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-36">Harga Pokok</th>
              <th class="w-10"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="(item, idx) in form.items" :key="idx">
              <td class="px-3 py-2">
                <select v-model="item.product_id" @change="onProductChange(item)"
                  class="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
                  <option value="">— Pilih Produk —</option>
                  <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
                </select>
              </td>
              <td class="px-3 py-2">
                <input v-model.number="item.qty_system" type="number" min="0" step="0.001" readonly
                  class="w-full px-2.5 py-1.5 text-xs text-right border border-gray-100 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed" />
              </td>
              <td class="px-3 py-2">
                <input v-model.number="item.qty_actual" type="number" min="0" step="0.001" @input="calcDiff(item)"
                  class="w-full px-2.5 py-1.5 text-xs text-right border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
              </td>
              <td class="px-3 py-2 text-right">
                <span class="text-xs font-bold"
                  :class="item.qty_difference > 0 ? 'text-emerald-600' : item.qty_difference < 0 ? 'text-red-500' : 'text-gray-400'">
                  {{ item.qty_difference > 0 ? '+' : '' }}{{ item.qty_difference }}
                </span>
              </td>
              <td class="px-3 py-2">
                <input v-model.number="item.unit_cost" type="number" min="0"
                  class="w-full px-2.5 py-1.5 text-xs text-right border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
              </td>
              <td class="px-3 py-2 text-center">
                <button type="button" @click="removeItem(idx)"
                  class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </button>
              </td>
            </tr>
            <tr v-if="!form.items.length">
              <td colspan="6" class="text-center py-10 text-gray-400 text-xs">
                Tambahkan produk yang ingin disesuaikan
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Summary -->
        <div v-if="form.items.length" class="mt-4 flex gap-6 px-3">
          <div class="flex items-center gap-2 text-xs">
            <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span class="text-gray-500">Total tambah:</span>
            <span class="font-bold text-emerald-600">+{{ totalIn }}</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <div class="w-2 h-2 rounded-full bg-red-500"></div>
            <span class="text-gray-500">Total kurang:</span>
            <span class="font-bold text-red-500">-{{ Math.abs(totalOut) }}</span>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="flex-shrink-0">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/>
          <path d="M8 5v4M8 10.5v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
        </svg>
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-2">
        <button type="button" @click="$router.back()"
          class="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
          Batal
        </button>
        <button type="submit" :disabled="saving || !form.items.length"
          class="px-5 py-2.5 text-sm font-medium bg-[#117c6f] hover:bg-[#0e6b5f] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center gap-2">
          <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="12"/>
          </svg>
          {{ saving ? 'Menyimpan...' : 'Simpan Draft' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/lib/axios'
import { useToast } from '@/composables/useToast'

const router   = useRouter()
const toast    = useToast()
const saving   = ref(false)
const error    = ref('')
const products = ref<any[]>([])

const form = reactive({
  adj_date: new Date().toISOString().slice(0, 10),
  type: 'recount', reason: '', notes: '',
  items: [] as any[],
})

const totalIn  = computed(() => form.items.filter(i => i.qty_difference > 0).reduce((s, i) => s + i.qty_difference, 0))
const totalOut = computed(() => form.items.filter(i => i.qty_difference < 0).reduce((s, i) => s + i.qty_difference, 0))

function addItem() {
  form.items.push({ product_id: '', qty_system: 0, qty_actual: 0, qty_difference: 0, unit_cost: 0 })
}
function removeItem(idx: number) { form.items.splice(idx, 1) }
function calcDiff(item: any) {
  item.qty_difference = parseFloat((item.qty_actual - item.qty_system).toFixed(4))
}
function onProductChange(item: any) {
  const p = products.value.find((x: any) => x.id === item.product_id)
  if (p) {
    item.qty_system     = parseFloat(p.current_stock || 0)
    item.qty_actual     = item.qty_system
    item.qty_difference = 0
    item.unit_cost      = p.cost_price || 0
  }
}

async function submit() {
  if (!form.reason)       return (error.value = 'Isi alasan penyesuaian.')
  if (!form.items.length) return (error.value = 'Tambahkan minimal satu produk.')
  if (form.items.some(i => !i.product_id)) return (error.value = 'Semua baris harus memiliki produk.')
  saving.value = true; error.value = ''
  try {
    await api.post('/auth/stock-adjustments', form)
    toast.success('Penyesuaian stok disimpan sebagai draft')
    router.push('/inventory/adjustments')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Gagal menyimpan.'
  } finally { saving.value = false }
}

onMounted(async () => {
  const { data } = await api.get('/auth/products', { params: { is_active: 1, per_page: 500 } })
  products.value = data.data
})
</script>