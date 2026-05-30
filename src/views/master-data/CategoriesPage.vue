<template>
  <div class="space-y-5 animate-fade-in">

    <!-- ── HEADER ─────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-bold text-xl text-gray-900">Kategori Produk</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ pagination.total }} kategori terdaftar</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 bg-[#117c6f] text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
        @click="openModal()"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Tambah Kategori
      </button>
    </div>

    <!-- ── FILTER BAR ─────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
      <!-- Search -->
      <div class="relative flex-1 min-w-[200px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="15" height="15" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari nama kategori..."
          class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] focus:ring-2 focus:ring-[#117c6f]/10 transition-all"
          @input="debouncedFetch"
        />
      </div>

      <!-- Status -->
      <select
        v-model="filters.is_active"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white text-gray-600"
        @change="fetchCategories"
      >
        <option value="">Semua Status</option>
        <option value="true">Aktif</option>
        <option value="false">Nonaktif</option>
      </select>
    </div>

    <!-- ── TABLE ──────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <!-- Loading skeleton -->
      <div v-if="isLoading">
        <div class="px-6 py-4 border-b border-gray-50 grid grid-cols-12 gap-4">
          <div v-for="i in 5" :key="i" class="h-3.5 bg-gray-100 rounded animate-pulse col-span-2"></div>
        </div>
        <div v-for="i in 8" :key="i" class="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
          <div class="w-8 h-8 rounded-lg bg-gray-100 animate-pulse shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-100 rounded animate-pulse w-1/3"></div>
            <div class="h-2.5 bg-gray-50 rounded animate-pulse w-1/2"></div>
          </div>
          <div class="h-3 bg-gray-100 rounded animate-pulse w-16"></div>
          <div class="h-6 bg-gray-100 rounded-full animate-pulse w-14"></div>
          <div class="h-3 bg-gray-100 rounded animate-pulse w-20"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="categories.length === 0" class="py-20 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 8h20M4 14h20M4 20h10" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="font-semibold text-gray-500">Belum ada kategori</p>
        <p class="text-sm text-gray-400 mt-1">Tambah kategori pertama untuk mulai mengorganisir produk</p>
        <button
          class="mt-4 px-4 py-2 bg-[#117c6f] text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          @click="openModal()"
        >
          + Tambah Kategori
        </button>
      </div>

      <!-- Table -->
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/60">
            <th class="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Kategori</th>
            <th class="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Deskripsi</th>
            <th class="text-center px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Produk</th>
            <th class="text-center px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th class="text-right px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="cat in categories"
            :key="cat.id"
            class="hover:bg-gray-50/50 transition-colors group"
          >
            <!-- Nama & Color -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                  :style="{ backgroundColor: cat.color + '20', border: `1.5px solid ${cat.color}40` }"
                >
                  <div class="w-3.5 h-3.5 rounded-full" :style="{ backgroundColor: cat.color }"></div>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ cat.name }}</p>
                  <p class="text-xs text-gray-400 font-mono mt-0.5">#{{ cat.id }}</p>
                </div>
              </div>
            </td>

            <!-- Deskripsi -->
            <td class="px-6 py-4 hidden md:table-cell">
              <p class="text-sm text-gray-500 truncate max-w-[220px]">{{ cat.description || '—' }}</p>
            </td>

            <!-- Jumlah Produk -->
            <td class="px-6 py-4 text-center hidden sm:table-cell">
              <span class="inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
                {{ cat.products_count ?? 0 }} produk
              </span>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 text-center">
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                :class="
                  cat.is_active
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                "
                @click="toggleStatus(cat)"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="cat.is_active ? 'bg-emerald-500' : 'bg-gray-400'"
                ></span>
                {{ cat.is_active ? 'Aktif' : 'Nonaktif' }}
              </button>
            </td>

            <!-- Aksi -->
            <td class="px-6 py-4">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  title="Edit"
                  @click="openModal(cat)"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M11 2l3 3-9 9H2v-3L11 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                  :class="{ 'opacity-40 cursor-not-allowed': (cat.products_count ?? 0) > 0 }"
                  :title="(cat.products_count ?? 0) > 0 ? 'Tidak bisa dihapus, masih ada produk' : 'Hapus'"
                  @click="(cat.products_count ?? 0) === 0 && confirmDelete(cat)"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="pagination.last_page > 1"
        class="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between"
      >
        <p class="text-sm text-gray-500">
          Menampilkan {{ pagination.from }}–{{ pagination.to }} dari {{ pagination.total }}
        </p>
        <div class="flex items-center gap-1">
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            :disabled="pagination.current_page === 1"
            @click="changePage(pagination.current_page - 1)"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
            :class="page === pagination.current_page ? 'bg-[#117c6f] text-white' : 'text-gray-600 hover:bg-gray-100'"
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
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ── MODAL TAMBAH / EDIT ─────────────────────────────────── -->
    <Transition
      enter-active-class="transition-opacity duration-250 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(15, 23, 42, 0.55); backdrop-filter: blur(4px);"
        @click.self="closeModal"
      >
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-[0.96] translate-y-3"
          leave-active-class="transition-all duration-200 ease-in"
          leave-to-class="opacity-0 scale-[0.97] translate-y-2"
        >
          <div
            v-if="showModal"
            class="bg-white w-full max-w-md rounded-2xl overflow-hidden"
            style="box-shadow: 0 24px 64px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08);"
          >
            <!-- Header -->
            <div class="px-6 pt-6 pb-5 border-b border-slate-100">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-xs font-semibold text-[#117c6f] uppercase tracking-widest mb-1">
                    {{ editingCategory ? 'Edit Kategori' : 'Kategori Baru' }}
                  </p>
                  <h3 class="text-lg font-bold text-slate-800">
                    {{ editingCategory ? 'Ubah data kategori' : 'Tambah kategori baru' }}
                  </h3>
                </div>
                <button
                  class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                  @click="closeModal"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-5 space-y-4">

              <!-- Nama -->
              <div>
                <label class="modal-label">Nama Kategori <span class="text-red-400">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Contoh: Makanan, Minuman..."
                  class="modal-input"
                  :class="{ 'modal-input-error': errors.name }"
                  @input="errors.name = ''"
                />
                <p v-if="errors.name" class="modal-error">{{ errors.name }}</p>
              </div>

              <!-- Deskripsi -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="modal-label mb-0!">Deskripsi</label>
                  <span class="text-xs text-slate-400">{{ form.description.length }}/300</span>
                </div>
                <textarea
                  v-model="form.description"
                  rows="2"
                  maxlength="300"
                  placeholder="Deskripsi singkat kategori ini..."
                  class="modal-input resize-none"
                ></textarea>
              </div>

              <!-- Warna -->
              <div>
                <label class="modal-label">Warna Tag</label>
                <div class="flex items-center gap-3">
                  <!-- Preset colors -->
                  <div class="flex items-center gap-2 flex-wrap">
                    <button
                      v-for="color in presetColors"
                      :key="color"
                      type="button"
                      class="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110"
                      :style="{ backgroundColor: color }"
                      :class="form.color === color ? 'border-slate-800 scale-110' : 'border-transparent'"
                      @click="form.color = color"
                    ></button>
                  </div>
                  <!-- Custom color picker -->
                  <div class="relative ml-auto">
                    <input
                      v-model="form.color"
                      type="color"
                      class="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
                      title="Pilih warna kustom"
                    />
                  </div>
                </div>
                <!-- Preview -->
                <div class="mt-2.5 flex items-center gap-2">
                  <div
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    :style="{ backgroundColor: form.color + '20', color: form.color, border: `1px solid ${form.color}40` }"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: form.color }"></span>
                    {{ form.name || 'Preview Kategori' }}
                  </div>
                  <span class="text-xs text-slate-400">preview tag</span>
                </div>
              </div>

              <!-- Status -->
              <div class="flex items-center justify-between py-1">
                <div>
                  <p class="text-sm font-semibold text-slate-700">Status Kategori</p>
                  <p class="text-xs text-slate-400 mt-0.5">Kategori nonaktif tidak muncul di daftar pilihan produk</p>
                </div>
                <div
                  class="relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer shrink-0"
                  :class="form.is_active ? 'bg-emerald-500' : 'bg-slate-300'"
                  @click="form.is_active = !form.is_active"
                >
                  <div
                    class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                    :class="form.is_active ? 'translate-x-5' : 'translate-x-0'"
                  ></div>
                </div>
              </div>

              <!-- Error -->
              <div
                v-if="formError"
                class="flex items-start gap-2.5 bg-red-50 border border-red-100 px-4 py-3 rounded-xl"
              >
                <svg class="text-red-400 shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 5v4M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <p class="text-sm text-red-600">{{ formError }}</p>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                class="flex-1 py-2.5 border border-slate-200 text-sm font-semibold text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                @click="closeModal"
              >
                Batal
              </button>
              <button
                type="button"
                :disabled="isSaving"
                class="flex-1 py-2.5 bg-[#117c6f] text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                @click="handleSubmit"
              >
                <svg
                  v-if="isSaving"
                  class="animate-spin w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                {{ isSaving ? 'Menyimpan...' : editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- ── MODAL KONFIRMASI HAPUS ──────────────────────────────── -->
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="deletingCategory"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(15, 23, 42, 0.55); backdrop-filter: blur(4px);"
        @click.self="deletingCategory = null"
      >
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
          <div class="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="font-bold text-lg text-gray-900 mb-1">Hapus Kategori?</h3>
          <p class="text-sm text-gray-500 mb-6">
            Kategori <span class="font-semibold text-gray-700">{{ deletingCategory?.name }}</span> akan dihapus permanen.
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              @click="deletingCategory = null"
            >
              Batal
            </button>
            <button
              class="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              :disabled="isDeleting"
              @click="handleDelete"
            >
              <svg v-if="isDeleting" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
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
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/lib/axios'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Category {
  id: number
  name: string
  description: string | null
  color: string
  is_active: boolean
  products_count?: number
}

// ── State ─────────────────────────────────────────────────────────────────────
const isLoading       = ref(true)
const isSaving        = ref(false)
const isDeleting      = ref(false)
const showModal       = ref(false)
const categories      = ref<Category[]>([])
const editingCategory = ref<Category | null>(null)
const deletingCategory= ref<Category | null>(null)
const formError       = ref('')

const pagination = reactive({ total: 0, current_page: 1, last_page: 1, from: 0, to: 0 })
const filters    = reactive({ search: '', is_active: '' })
const errors     = reactive({ name: '' })

const form = reactive({
  name:        '',
  description: '',
  color:       '#117c6f',
  is_active:   true,
})

const presetColors = [
  '#117c6f', '#3B82F6', '#8B5CF6', '#EC4899',
  '#F97316', '#EAB308', '#10B981', '#EF4444',
]

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchCategories(page = 1) {
  isLoading.value = true
  try {
    const params: any = { page, per_page: 20 }
    if (filters.search)    params.search    = filters.search
    if (filters.is_active) params.is_active = filters.is_active

    const { data } = await api.get('/auth/categories', { params })

    // Support both paginated & plain array response
    if (data.data) {
      categories.value = data.data
      Object.assign(pagination, {
        total:        data.total,
        current_page: data.current_page,
        last_page:    data.last_page,
        from:         data.from,
        to:           data.to,
      })
    } else {
      categories.value = data
      Object.assign(pagination, { total: data.length, current_page: 1, last_page: 1, from: 1, to: data.length })
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchCategories())

// ── Debounce ──────────────────────────────────────────────────────────────────
let searchTimer: ReturnType<typeof setTimeout>
function debouncedFetch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => fetchCategories(), 400)
}

// ── Pagination ────────────────────────────────────────────────────────────────
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, pagination.current_page - 2)
  const end   = Math.min(pagination.last_page, pagination.current_page + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function changePage(page: number) {
  if (page < 1 || page > pagination.last_page) return
  fetchCategories(page)
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(category?: Category) {
  formError.value = ''
  errors.name     = ''

  if (category) {
    editingCategory.value = category
    Object.assign(form, {
      name:        category.name,
      description: category.description ?? '',
      color:       category.color ?? '#117c6f',
      is_active:   category.is_active,
    })
  } else {
    editingCategory.value = null
    Object.assign(form, { name: '', description: '', color: '#117c6f', is_active: true })
  }
  showModal.value = true
}

function closeModal() {
  showModal.value       = false
  editingCategory.value = null
  formError.value       = ''
}

// ── Toggle status langsung dari table ─────────────────────────────────────────
async function toggleStatus(category: Category) {
  try {
    await api.put(`/auth/categories/${category.id}`, {
      ...category,
      is_active: !category.is_active ? 1 : 0,
    })
    category.is_active = !category.is_active
  } catch {
    alert('Gagal mengubah status.')
  }
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  errors.name = form.name.trim() ? '' : 'Nama kategori wajib diisi'
  if (errors.name) return

  formError.value = ''
  isSaving.value  = true

  try {
    const payload = {
      name:        form.name,
      description: form.description,
      color:       form.color,
      is_active:   form.is_active ? 1 : 0,
    }

    if (editingCategory.value) {
      await api.put(`/auth/categories/${editingCategory.value.id}`, payload)
    } else {
      await api.post('/auth/categories', payload)
    }

    closeModal()
    fetchCategories(pagination.current_page)
  } catch (err: any) {
    const e = err?.response?.data?.errors
    formError.value = e
      ? Object.values(e).flat().join(', ')
      : 'Gagal menyimpan kategori. Coba lagi.'
  } finally {
    isSaving.value = false
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────
function confirmDelete(category: Category) {
  deletingCategory.value = category
}

async function handleDelete() {
  if (!deletingCategory.value) return
  isDeleting.value = true
  try {
    await api.delete(`/auth/categories/${deletingCategory.value.id}`)
    deletingCategory.value = null
    fetchCategories(pagination.current_page)
  } catch (err: any) {
    const msg = err?.response?.data?.message
    alert(msg || 'Gagal menghapus kategori.')
    deletingCategory.value = null
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
@reference "tailwindcss";

.modal-label {
  @apply block text-sm font-semibold text-slate-700 mb-1.5;
}

.modal-input {
  @apply w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl outline-none
         focus:border-[#117c6f] focus:ring-2 focus:ring-[#117c6f]/10
         bg-white text-slate-800 placeholder-slate-300
         transition-all duration-150;
}

.modal-input-error {
  @apply border-red-300 focus:border-red-400 focus:ring-red-100;
}

.modal-error {
  @apply text-xs text-red-500 mt-1.5;
}
</style>