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
        <h1 class="text-xl font-semibold text-gray-900">Buat Purchase Order</h1>
        <p class="text-sm text-gray-400">Nomor akan digenerate otomatis setelah disimpan</p>
      </div>
    </div>

    <form @submit.prevent="submit" class="space-y-4">

      <!-- Section: Informasi PO -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 class="text-sm font-semibold text-gray-700 mb-4">Informasi PO</h2>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Supplier <span class="text-red-500">*</span></label>
            <select v-model="form.supplier_id" @change="onSupplierChange" required
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
              <option value="">— Pilih Supplier —</option>
              <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Tanggal PO <span class="text-red-500">*</span></label>
            <input v-model="form.po_date" type="date" required
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Estimasi Tiba</label>
            <input v-model="form.expected_date" type="date"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>
          <div class="col-span-3">
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Catatan</label>
            <textarea v-model="form.notes" rows="2" placeholder="Catatan opsional..."
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all resize-none" />
          </div>
        </div>
      </div>

      <!-- Section: Line Items -->
      <div class="bg-white border border-gray-200 rounded-2xl p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-700">Item Barang</h2>
          <button type="button" @click="addItem"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#117c6f] border border-[#117c6f]/30 bg-[#117c6f]/5 hover:bg-[#117c6f]/10 rounded-lg transition-colors">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            Tambah Baris
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/70">
                <th class="text-left text-xs font-semibold text-gray-500 px-3 py-2.5">Produk</th>
                <th class="text-left text-xs font-semibold text-gray-500 px-3 py-2.5 w-28">Satuan</th>
                <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-28">Qty Order</th>
                <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-36">Harga Beli</th>
                <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-20">Diskon %</th>
                <th class="text-right text-xs font-semibold text-gray-500 px-3 py-2.5 w-36">Subtotal</th>
                <th class="w-10"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(item, idx) in form.items" :key="idx">
                <td class="px-3 py-2">
                  <select v-model="item.product_id" @change="onProductChange(item)"
                    class="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
                    <option value="">— Pilih Produk —</option>
                    <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}{{ p.sku ? ` (${p.sku})` : '' }}</option>
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
                  <input v-model.number="item.qty_ordered" type="number" min="0.001" step="0.001" @input="calcItem(item)"
                    class="w-full px-2.5 py-1.5 text-xs text-right border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
                </td>
                <td class="px-3 py-2">
                  <input v-model.number="item.unit_price" type="number" min="0" @input="calcItem(item)"
                    class="w-full px-2.5 py-1.5 text-xs text-right border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
                </td>
                <td class="px-3 py-2">
                  <input v-model.number="item.discount_percent" type="number" min="0" max="100" @input="calcItem(item)"
                    class="w-full px-2.5 py-1.5 text-xs text-right border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
                </td>
                <td class="px-3 py-2 text-right text-xs font-semibold text-gray-800">
                  {{ formatCurrency(item.total_price) }}
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
                <td colspan="7" class="text-center py-10 text-gray-400 text-xs">
                  Klik "Tambah Baris" untuk menambahkan produk
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="mt-4 flex justify-end">
          <div class="w-64 space-y-2 text-sm">
            <div class="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{{ formatCurrency(totals.subtotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-500">
              <span>Diskon</span>
              <span class="text-red-500">-{{ formatCurrency(totals.discount) }}</span>
            </div>
            <div class="flex justify-between font-semibold text-gray-900 border-t border-gray-100 pt-2">
              <span>Total</span>
              <span class="text-[#117c6f] text-base">{{ formatCurrency(totals.total) }}</span>
            </div>
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
          {{ saving ? 'Menyimpan...' : 'Simpan PO' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePurchasingStore } from '@/stores/purchasing'
import { formatCurrency } from '@/lib/utils'
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

const form = reactive({
  supplier_id: '', po_date: new Date().toISOString().slice(0, 10),
  expected_date: '', notes: '', items: [] as any[],
})

const totals = computed(() => {
  const subtotal = form.items.reduce((s, i) => s + (i.qty_ordered * i.unit_price), 0)
  const discount = form.items.reduce((s, i) => s + (i.qty_ordered * i.unit_price * (i.discount_percent / 100)), 0)
  return { subtotal, discount, total: subtotal - discount }
})

function addItem() {
  form.items.push({ product_id: '', uom_id: null, qty_ordered: 1, unit_price: 0, discount_percent: 0, total_price: 0 })
}
function removeItem(idx: number) { form.items.splice(idx, 1) }
function calcItem(item: any) {
  item.total_price = item.qty_ordered * item.unit_price * (1 - item.discount_percent / 100)
}
function onProductChange(item: any) {
  const p = products.value.find((x: any) => x.id === item.product_id)
  if (p) { item.unit_price = p.cost_price || 0; item.uom_id = p.uom_id || null; calcItem(item) }
}
function onSupplierChange() {}

async function submit() {
  if (!form.supplier_id)  return (error.value = 'Pilih supplier terlebih dahulu.')
  if (!form.items.length) return (error.value = 'Tambahkan minimal satu produk.')
  if (form.items.some(i => !i.product_id)) return (error.value = 'Semua baris harus memiliki produk.')
  saving.value = true; error.value = ''
  try {
    await store.createPurchaseOrder(form)
    toast.success('Purchase Order berhasil dibuat')
    router.push('/purchasing/purchase-orders')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Gagal menyimpan PO.'
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