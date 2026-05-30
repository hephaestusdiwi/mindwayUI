<template>
  <div class="space-y-5 animate-fade-in">
    <!-- ── HEADER ─────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-display font-bold text-xl text-gray-900">Daftar Produk</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ pagination.total }} produk terdaftar</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 bg-[#117c6f] text-white text-sm font-semibold rounded-xl hover:bg-[#1B6CA8] transition-colors shadow-sm"
        @click="openModal()"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        Tambah Produk
      </button>
    </div>

    <!-- ── FILTER BAR ──────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
      <!-- Search -->
      <div class="relative flex-1 min-w-[200px]">
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" />
          <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari nama atau SKU produk..."
          class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] focus:ring-2 focus:ring-[#117c6f]/10 transition-all"
          @input="debouncedFetch"
        />
      </div>

      <!-- Kategori -->
      <select
        v-model="filters.category_id"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white text-gray-600"
        @change="fetchProducts"
      >
        <option value="">Semua Kategori</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>

      <!-- Status -->
      <select
        v-model="filters.is_active"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white text-gray-600"
        @change="fetchProducts"
      >
        <option value="">Semua Status</option>
        <option value="true">Aktif</option>
        <option value="false">Nonaktif</option>
      </select>

      <!-- Stok menipis -->
      <button
        class="flex items-center gap-2 px-3 py-2.5 text-sm border rounded-xl transition-all font-medium"
        :class="
          filters.low_stock
            ? 'bg-orange-50 border-orange-300 text-orange-600'
            : 'border-gray-200 text-gray-500 hover:border-gray-300'
        "
        @click="toggleLowStock"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 5v4M8 12h.01"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
          <path
            d="M2 14L8 2l6 12H2z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
        Stok Menipis
      </button>
    </div>

    <!-- ── PRODUCT GRID ─────────────────────────────────────────── -->
    <div
      v-if="isLoading"
      class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4"
    >
      <div
        v-for="i in 12"
        :key="i"
        class="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div class="aspect-square bg-gray-100 animate-pulse"></div>
        <div class="p-3 space-y-2">
          <div class="h-3 bg-gray-100 rounded animate-pulse"></div>
          <div class="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="products.length === 0"
      class="bg-white rounded-2xl border border-gray-100 py-16 text-center"
    >
      <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M4 7l10-4 10 4v11l-10 6-10-6V7z"
            stroke="#9CA3AF"
            stroke-width="1.8"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <p class="font-semibold text-gray-500">Tidak ada produk ditemukan</p>
      <p class="text-sm text-gray-400 mt-1">Coba ubah filter atau tambah produk baru</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md hover:border-gray-200 transition-all duration-200"
      >
        <!-- Gambar -->
        <div class="aspect-square bg-gray-50 relative overflow-hidden">
          <img
            v-if="product.image_url"
            :src="product.image_url"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 28 28" fill="none">
              <path
                d="M4 7l10-4 10 4v11l-10 6-10-6V7z"
                stroke="#D1D5DB"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <!-- Badge status -->
          <div class="absolute top-2 left-2">
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="
                product.is_active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
              "
            >
              {{ product.is_active ? 'Aktif' : 'Nonaktif' }}
            </span>
          </div>

          <!-- Badge stok menipis -->
          <div v-if="product.stock <= 10" class="absolute top-2 right-2">
            <span
              class="text-[10px] font-bold px-2 py-0.5 rounded-full"
              :class="
                product.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
              "
            >
              {{ product.stock === 0 ? 'Habis' : `Sisa ${product.stock}` }}
            </span>
          </div>

          <!-- Overlay aksi -->
          <div
            class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
          >
            <button
              class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              @click="openModal(product)"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M11 2l3 3-9 9H2v-3L11 2z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <button
              class="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
              @click="confirmDelete(product)"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8L13 4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="p-3">
          <p class="text-xs text-gray-400 mb-0.5">{{ product.category?.name ?? '-' }}</p>
          <p class="text-sm font-semibold text-gray-900 truncate">{{ product.name }}</p>
          <p class="text-[10px] text-gray-400 mt-0.5">SKU: {{ product.sku ?? '-' }}</p>
          <div class="mt-2 flex items-center gap-1.5">
            <span class="text-sm font-bold text-[#117c6f]">{{
              formatCurrency(product.effective_price)
            }}</span>
            <span v-if="product.discount_price" class="text-xs text-gray-400 line-through">{{
              formatCurrency(product.price)
            }}</span>
          </div>
          <div class="mt-1.5 flex items-center justify-between">
            <span class="text-xs text-gray-500"
              >Stok:
              <span
                class="font-semibold"
                :class="
                  product.stock <= 5
                    ? 'text-red-500'
                    : product.stock <= 10
                      ? 'text-orange-500'
                      : 'text-gray-700'
                "
                >{{ product.stock }}</span
              ></span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- ── PAGINATION ──────────────────────────────────────────── -->
    <div
      v-if="pagination.last_page > 1"
      class="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-3 shadow-sm"
    >
      <p class="text-sm text-gray-500">
        Menampilkan {{ pagination.from }}–{{ pagination.to }} dari {{ pagination.total }} produk
      </p>
      <div class="flex items-center gap-1">
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          :disabled="pagination.current_page === 1"
          @click="changePage(pagination.current_page - 1)"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 4L6 8l4 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
          :class="
            page === pagination.current_page
              ? 'bg-[#117c6f] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          "
          @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
          class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          :disabled="pagination.current_page === pagination.last_page"
          @click="changePage(pagination.current_page + 1)"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── MODAL TAMBAH/EDIT ───────────────────────────────────── -->
    <ProductFormModal
      :showModal="showModal"
      :editingProduct="editingProduct"
      :categories="categories"
      ref="modalRef"
      @close="closeModal"
      @saved="fetchProducts(pagination.current_page)"
    />

    <!-- ── MODAL KONFIRMASI HAPUS ──────────────────────────────── -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="deletingProduct"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="deletingProduct = null"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div
            class="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                stroke="#EF4444"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h3 class="font-display font-bold text-lg text-gray-900 mb-1">Hapus Produk?</h3>
          <p class="text-sm text-gray-500 mb-6">
            Produk <span class="font-semibold text-gray-700">{{ deletingProduct?.name }}</span> akan
            dihapus permanen.
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              @click="deletingProduct = null"
            >
              Batal
            </button>
            <button
              class="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              :disabled="isDeleting"
              @click="handleDelete"
            >
              <svg
                v-if="isDeleting"
                class="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              {{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import api from '@/lib/axios'
import ProductFormModal from '@/views/components/products/ProductFormModal.vue'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Category {
  id: number
  name: string
}
interface Product {
  id: number
  name: string
  sku: string | null
  description: string | null
  image: string | null
  image_url: string | null
  price: number
  discount_price: number | null
  effective_price: number
  stock: number
  is_active: boolean
  category: Category | null
  category_id: number
}

// ── State ─────────────────────────────────────────────────────────────────────
const isLoading = ref(true)
const isSaving = ref(false)
const isDeleting = ref(false)
const showModal = ref(false)
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const editingProduct = ref<Product | null>(null)
const deletingProduct = ref<Product | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(null)
const imageFile = ref<File | null>(null)
const modalRef = ref()
const formError = ref('')

const pagination = reactive({ total: 0, current_page: 1, last_page: 1, from: 0, to: 0 })
const filters = reactive({ search: '', category_id: '', is_active: '', low_stock: false })

const form = reactive({
  name: '',
  sku: '',
  category_id: '',
  description: '',
  price: '',
  discount_price: '',
  stock: '',
  is_active: true,
})

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchProducts(page = 1) {
  isLoading.value = true
  try {
    const params: any = { page, per_page: 24 }
    if (filters.search) params.search = filters.search
    if (filters.category_id) params.category_id = filters.category_id
    if (filters.is_active) params.is_active = filters.is_active
    if (filters.low_stock) params.low_stock = true

    const { data } = await api.get('/auth/products', { params })
    products.value = data.data
    Object.assign(pagination, {
      total: data.total,
      current_page: data.current_page,
      last_page: data.last_page,
      from: data.from,
      to: data.to,
    })
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

async function fetchCategories() {
  const { data } = await api.get('/auth/categories')
  categories.value = data.data ?? data
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})

// ── Debounce search ───────────────────────────────────────────────────────────
let searchTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => fetchProducts(), 400)
}

// ── Pagination ────────────────────────────────────────────────────────────────
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, pagination.current_page - 2)
  const end = Math.min(pagination.last_page, pagination.current_page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function changePage(page: number) {
  if (page < 1 || page > pagination.last_page) return
  fetchProducts(page)
}

// ── Filter ────────────────────────────────────────────────────────────────────
function toggleLowStock() {
  filters.low_stock = !filters.low_stock
  fetchProducts()
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal (product?: Product) {
  editingProduct.value = product ?? null
  showModal.value = true
  nextTick(() => modalRef.value?.openModal(product))
}

function closeModal() {
  showModal.value = false
  editingProduct.value = null
}

// ── Image ─────────────────────────────────────────────────────────────────────
function triggerFileInput() {
  fileInput.value?.click()
}

function handleImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  imageFile.value = file
  imagePreview.value = URL.createObjectURL(file)
}

function removeImage() {
  imagePreview.value = null
  imageFile.value = null
  if (fileInput.value) fileInput.value.value = ''
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  formError.value = ''
  isSaving.value = true
  try {
    const formData = new FormData()
    Object.entries(form).forEach(([key, val]) => {
      if (val !== '' && val !== null && val !== undefined) {
        if (key === 'is_active') {
          formData.append(key, val ? '1' : '0') // ← kirim 1/0 bukan true/false
        } else {
          formData.append(key, String(val))
        }
      }
    })
    if (imageFile.value) formData.append('image', imageFile.value)

    if (editingProduct.value) {
      formData.append('_method', 'PUT')
      await api.post(`/auth/products/${editingProduct.value.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } else {
      await api.post('/auth/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }

    closeModal()
    fetchProducts(pagination.current_page)
  } catch (err: any) {
    const errors = err?.response?.data?.errors
    if (errors) {
      formError.value = Object.values(errors).flat().join(', ')
    } else {
      formError.value = 'Gagal menyimpan produk. Coba lagi.'
    }
  } finally {
    isSaving.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────
function confirmDelete(product: Product) {
  deletingProduct.value = product
}

async function handleDelete() {
  if (!deletingProduct.value) return
  isDeleting.value = true
  try {
    await api.delete(`/auth/products/${deletingProduct.value.id}`)
    deletingProduct.value = null
    fetchProducts(pagination.current_page)
  } catch {
    alert('Gagal menghapus produk.')
  } finally {
    isDeleting.value = false
  }
}

// ── Format ────────────────────────────────────────────────────────────────────
function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>
