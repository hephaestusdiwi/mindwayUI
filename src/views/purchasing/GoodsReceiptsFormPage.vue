<template>
  <div class="p-6 max-w-5xl">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <button @click="$router.back()"
        class="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Penerimaan Barang</h1>
        <p class="text-sm text-gray-400">Catat barang yang diterima dari supplier</p>
      </div>
    </div>

    <form @submit.prevent="submit" class="space-y-4">

      <!-- Informasi Penerimaan -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 class="text-sm font-semibold text-gray-700 mb-4">Informasi Penerimaan</h2>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Supplier <span class="text-red-500">*</span></label>
            <select v-model="form.supplier_id" @change="loadOpenPOs" required
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
              <option value="">— Pilih Supplier —</option>
              <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Referensi PO</label>
            <select v-model="form.purchase_order_id" @change="loadPOItems" :disabled="!form.supplier_id"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] disabled:bg-gray-50 disabled:text-gray-400 transition-all">
              <option value="">— Tanpa PO —</option>
              <option v-for="po in openPOs" :key="po.id" :value="po.id">
                {{ po.po_number }} ({{ formatDate(po.po_date) }})
              </option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Tanggal Terima <span class="text-red-500">*</span></label>
            <input v-model="form.received_date" type="date" required
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">No. Surat Jalan</label>
            <input v-model="form.supplier_delivery_note" placeholder="Opsional"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>
          <div class="col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Catatan</label>
            <input v-model="form.notes"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>
        </div>
      </div>

      <!-- Item dari PO -->
      <div v-if="poItems.length" class="bg-white border border-[#117c6f]/20 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-[#117c6f]"></div>
            <h2 class="text-sm font-semibold text-gray-700">Item dari PO</h2>
          </div>
          <button type="button" @click="importAllPOItems"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#117c6f] border border-[#117c6f]/30 bg-[#117c6f]/5 hover:bg-[#117c6f]/10 rounded-lg transition-colors">
            Import Semua
          </button>
        </div>
        <table class="w-full text-xs">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left text-xs font-semibold text-gray-500 px-3 py-2">Produk</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2 w-24">Dipesan</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2 w-24">Diterima</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2 w-24">Sisa</th>
              <th class="w-20"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="poi in poItems" :key="poi.id" class="hover:bg-gray-50/60 transition-colors">
              <td class="px-3 py-2 font-medium text-gray-800">{{ poi.product?.name }}</td>
              <td class="px-3 py-2 text-right text-gray-500">{{ poi.qty_ordered }}</td>
              <td class="px-3 py-2 text-right text-gray-500">{{ poi.qty_received }}</td>
              <td class="px-3 py-2 text-right font-semibold"
                :class="poi.remaining_qty <= 0 ? 'text-gray-300' : 'text-[#117c6f]'">
                {{ poi.remaining_qty }}
              </td>
              <td class="px-3 py-2 text-right">
                <button type="button" @click="importPOItem(poi)" :disabled="poi.remaining_qty <= 0"
                  class="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  Import
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Barang Diterima -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-700">Barang Diterima</h2>
          <button type="button" @click="addItem"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#117c6f] border border-[#117c6f]/30 bg-[#117c6f]/5 hover:bg-[#117c6f]/10 rounded-lg transition-colors">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            Tambah Baris
          </button>
        </div>

        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/70">
              <th class="text-left text-xs font-semibold text-gray-500 px-3 py-2.5">Produk</th>
              <th class="text-left text-xs font-semibold text-gray-500 px-3 py-2.5 w-28">Satuan</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-28">Qty Terima</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-36">Harga Beli</th>
              <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-36">Total</th>
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
                <select v-model="item.uom_id"
                  class="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
                  <option :value="null">— Satuan —</option>
                  <option v-for="u in uoms" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </td>
              <td class="px-3 py-2">
                <input v-model.number="item.qty_received" type="number" min="0.001" step="0.001" @input="calcItem(item)"
                  class="w-full px-2.5 py-1.5 text-xs text-right border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
              </td>
              <td class="px-3 py-2">
                <input v-model.number="item.unit_cost" type="number" min="0" @input="calcItem(item)"
                  class="w-full px-2.5 py-1.5 text-xs text-right border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
              </td>
              <td class="px-3 py-2 text-right text-xs font-semibold text-gray-800">
                {{ formatCurrency(item.total_cost) }}
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
                Import dari PO atau tambah baris manual
              </td>
            </tr>
          </tbody>
          <tfoot v-if="form.items.length">
            <tr class="border-t border-gray-100">
              <td colspan="4" class="px-3 py-3 text-right text-sm font-semibold text-gray-700">Total</td>
              <td class="px-3 py-3 text-right text-sm font-bold text-[#117c6f]">{{ formatCurrency(totalCost) }}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
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
          {{ saving ? 'Menyimpan...' : 'Simpan GRN' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePurchasingStore } from '@/stores/purchasing'
import { formatDate, formatCurrency } from '@/lib/utils'
import api from '@/lib/axios'
import { useToast } from '@/composables/useToast'

const router  = useRouter()
const store   = usePurchasingStore()
const toast   = useToast()
const saving  = ref(false)
const error   = ref('')
const suppliers = ref<any[]>([])
const products  = ref<any[]>([])
const uoms      = ref<any[]>([])
const openPOs   = ref<any[]>([])
const poItems   = ref<any[]>([])

const form = reactive({
  supplier_id: '', purchase_order_id: '',
  received_date: new Date().toISOString().slice(0, 10),
  supplier_delivery_note: '', notes: '', items: [] as any[],
})

const totalCost = computed(() => form.items.reduce((s, i) => s + (i.total_cost || 0), 0))

function addItem() {
  form.items.push({ product_id: '', uom_id: null, purchase_order_item_id: null, qty_received: 1, unit_cost: 0, total_cost: 0 })
}
function removeItem(idx: number) { form.items.splice(idx, 1) }
function calcItem(item: any) { item.total_cost = item.qty_received * item.unit_cost }
function onProductChange(item: any) {
  const p = products.value.find((x: any) => x.id === item.product_id)
  if (p) { item.unit_cost = p.cost_price || 0; item.uom_id = p.uom_id || null; calcItem(item) }
}

async function loadOpenPOs() {
  form.purchase_order_id = ''; poItems.value = []
  if (!form.supplier_id) return
  const { data } = await api.get('/auth/purchase-orders', {
    params: { supplier_id: form.supplier_id, status: 'approved,partial', per_page: 100 }
  })
  openPOs.value = data.data
}

async function loadPOItems() {
  poItems.value = []
  if (!form.purchase_order_id) return
  const { data } = await api.get(`/auth/purchase-orders/${form.purchase_order_id}`)
  poItems.value = (data.items || []).map((i: any) => ({
    ...i, remaining_qty: Math.max(0, i.qty_ordered - i.qty_received)
  }))
}

function importPOItem(poi: any) {
  if (form.items.find(i => i.purchase_order_item_id === poi.id)) return
  form.items.push({
    product_id: poi.product_id, uom_id: poi.uom_id,
    purchase_order_item_id: poi.id, qty_received: poi.remaining_qty,
    unit_cost: poi.unit_price, total_cost: poi.remaining_qty * poi.unit_price,
  })
}
function importAllPOItems() {
  poItems.value.filter(p => p.remaining_qty > 0).forEach(importPOItem)
}

async function submit() {
  if (!form.supplier_id)  return (error.value = 'Pilih supplier.')
  if (!form.items.length) return (error.value = 'Tambahkan minimal satu item.')
  if (form.items.some(i => !i.product_id)) return (error.value = 'Semua baris harus memiliki produk.')
  saving.value = true; error.value = ''
  try {
    await store.createGoodsReceipt(form)
    toast.success('GRN berhasil disimpan')
    router.push('/purchasing/goods-receipts')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Gagal menyimpan GRN.'
  } finally { saving.value = false }
}

onMounted(async () => {
  const [s, p, u] = await Promise.all([
    api.get('/auth/suppliers', { params: { status: 'active', per_page: 200 } }),
    api.get('/auth/products',  { params: { is_active: 1, per_page: 500 } }),
    api.get('/auth/uom',       { params: { status: 'active' } }),
  ])
  suppliers.value = s.data.data
  products.value  = p.data.data
  uoms.value      = u.data.data ?? u.data
})
</script>