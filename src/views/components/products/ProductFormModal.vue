<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showModal"
        class="fixed inset-0 z-[999] flex items-center justify-center"
        style="background: rgba(10, 15, 28, 0.6); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);"
        @click.self="closeModal"
      >
        <Transition
          enter-active-class="transition-all duration-250 ease-out"
          enter-from-class="opacity-0 scale-[0.97] translate-y-2"
          leave-active-class="transition-all duration-150 ease-in"
          leave-to-class="opacity-0 scale-[0.98]"
        >
          <div
            v-if="showModal"
            class="relative bg-white w-full flex flex-col"
            style="
              max-width: 560px;
              max-height: 88vh;
              border-radius: 16px;
              box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 8px 16px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.12);
            "
          >

            <!-- ── HEADER ──────────────────────────────────────────────── -->
            <div class="shrink-0 px-5 pt-4 pb-3 border-b border-gray-100">
              <!-- Title row -->
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-6 h-6 rounded-md bg-[#117c6f]/10 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 4l5-2 5 2v7l-5 3-5-3V4z" stroke="#117c6f" stroke-width="1.6" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <h2 class="text-sm font-bold text-gray-900">
                    {{ editingProduct ? 'Edit Produk' : 'Tambah Produk' }}
                  </h2>
                </div>
                <button
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  @click="closeModal"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>

              <!-- Step bar -->
              <div class="flex items-center gap-1">
                <template v-for="(step, i) in steps" :key="step.key">
                  <button
                    class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all duration-150"
                    :class="
                      currentStep === i + 1
                        ? 'bg-[#117c6f] text-white'
                        : currentStep > i + 1
                          ? 'text-emerald-700 hover:bg-emerald-50 cursor-pointer'
                          : 'text-gray-400 cursor-default'
                    "
                    :disabled="currentStep <= i + 1"
                    @click="currentStep > i + 1 ? goToStep(i + 1) : null"
                  >
                    <span
                      class="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                      :class="
                        currentStep > i + 1
                          ? 'bg-emerald-500 text-white'
                          : currentStep === i + 1
                            ? 'bg-white/25 text-white'
                            : 'bg-gray-200 text-gray-400'
                      "
                    >
                      <svg v-if="currentStep > i + 1" width="7" height="7" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span v-else>{{ i + 1 }}</span>
                    </span>
                    {{ step.label }}
                  </button>
                  <div
                    v-if="i < steps.length - 1"
                    class="flex-1 h-px transition-colors duration-300"
                    :class="currentStep > i + 1 ? 'bg-emerald-200' : 'bg-gray-150'"
                    style="background-color: currentStep > i + 1 ? '' : '#e5e7eb'"
                  />
                </template>
              </div>
            </div>

            <!-- ── BODY ────────────────────────────────────────────────── -->
            <div class="overflow-y-auto flex-1 px-5 py-4">

              <!-- ▸ STEP 1 — Info Produk -->
              <div v-if="currentStep === 1" class="space-y-3.5">

                <!-- Foto + Nama side by side -->
                <div class="flex gap-3">
                  <!-- Upload foto (compact square) -->
                  <div
                    class="relative w-[88px] h-[88px] rounded-xl border-2 border-dashed flex items-center justify-center shrink-0 cursor-pointer transition-all duration-150 group overflow-hidden"
                    :class="
                      isDragging
                        ? 'border-[#117c6f] bg-teal-50'
                        : imagePreview
                          ? 'border-gray-200 cursor-default'
                          : 'border-gray-200 hover:border-[#117c6f]/60 hover:bg-gray-50'
                    "
                    @dragover.prevent="isDragging = true"
                    @dragleave="isDragging = false"
                    @drop.prevent="handleDrop"
                    @click="!imagePreview && triggerFileInput()"
                  >
                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageChange"/>

                    <img
                      v-if="imagePreview"
                      :src="imagePreview"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="flex flex-col items-center gap-1">
                      <svg class="text-gray-300 group-hover:text-[#117c6f]/60 transition-colors" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M16 8l-4-4-4 4M12 4v12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span class="text-[10px] text-gray-400 text-center leading-tight">Foto<br/>produk</span>
                    </div>

                    <!-- Overlay saat ada gambar -->
                    <div
                      v-if="imagePreview"
                      class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5"
                    >
                      <button
                        type="button"
                        class="w-6 h-6 bg-white rounded-md flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                        @click.stop="removeImage"
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="w-6 h-6 bg-white rounded-md flex items-center justify-center text-gray-700 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                        @click.stop="triggerFileInput"
                      >
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M8 1.5l2.5 2.5L4 10.5H1.5V8L8 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Nama + Kategori -->
                  <div class="flex-1 space-y-2.5">
                    <div>
                      <label class="fl">Nama Produk <span class="text-red-400">*</span></label>
                      <input
                        v-model="form.name"
                        type="text"
                        placeholder="Nasi Goreng Spesial"
                        class="fi"
                        :class="{ 'fi-err': errors.name }"
                        @input="errors.name = ''"
                      />
                      <p v-if="errors.name" class="fe">{{ errors.name }}</p>
                    </div>
                    <div>
                      <label class="fl">Kategori <span class="text-red-400">*</span></label>
                      <div class="relative">
                        <select
                          v-model="form.category_id"
                          class="fi appearance-none pr-8"
                          :class="{ 'fi-err': errors.category_id }"
                          @change="errors.category_id = ''"
                        >
                          <option value="">Pilih kategori</option>
                          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                        </select>
                        <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="12" height="12" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </div>
                      <p v-if="errors.category_id" class="fe">{{ errors.category_id }}</p>
                    </div>
                  </div>
                </div>

                <!-- Deskripsi -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="fl mb-0!">Deskripsi</label>
                    <span class="text-[11px] text-gray-400">{{ form.description.length }}/300</span>
                  </div>
                  <textarea
                    v-model="form.description"
                    rows="2"
                    maxlength="300"
                    placeholder="Deskripsi singkat produk..."
                    class="fi resize-none"
                  ></textarea>
                </div>

              </div>

              <!-- ▸ STEP 2 — Harga & Stok -->
              <div v-else-if="currentStep === 2" class="space-y-3.5">

                <!-- Harga berdampingan -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="fl">Harga Normal <span class="text-red-400">*</span></label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none select-none">Rp</span>
                      <input
                        :value="formatRupiah(form.price)"
                        type="text"
                        inputmode="numeric"
                        placeholder="0"
                        class="fi pl-8 font-semibold"
                        :class="{ 'fi-err': errors.price }"
                        @input="handlePriceInput('price', $event)"
                      />
                    </div>
                    <p v-if="errors.price" class="fe">{{ errors.price }}</p>
                  </div>
                  <div>
                    <label class="fl">Harga Diskon <span class="text-gray-400 font-normal">(opsional)</span></label>
                    <div class="relative">
                      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none select-none">Rp</span>
                      <input
                        :value="formatRupiah(form.discount_price)"
                        type="text"
                        inputmode="numeric"
                        placeholder="0"
                        class="fi pl-8 font-semibold"
                        @input="handlePriceInput('discount_price', $event)"
                      />
                    </div>
                    <p v-if="form.discount_price && Number(form.discount_price) >= Number(form.price)" class="fe">
                      Harus lebih kecil dari harga normal
                    </p>
                  </div>
                </div>

                <!-- Price preview -->
                <div
                  v-if="form.price"
                  class="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-[#117c6f]"></div>
                    <span class="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Harga Jual</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      v-if="discountPercent > 0"
                      class="text-[11px] font-bold text-gray-400 line-through"
                    >{{ formatDisplay(Number(form.price)) }}</span>
                    <span class="text-sm font-bold text-[#117c6f]">{{ formatDisplay(effectivePrice) }}</span>
                    <span
                      v-if="discountPercent > 0"
                      class="text-[11px] font-bold bg-red-100 text-red-500 px-1.5 py-0.5 rounded"
                    >-{{ discountPercent }}%</span>
                  </div>
                </div>

                <!-- SKU + Stok -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="fl mb-0!">SKU</label>
                      <button
                        type="button"
                        class="text-[11px] font-semibold text-[#117c6f] hover:text-teal-700 transition-colors"
                        @click="generateSku"
                      >↺ Generate</button>
                    </div>
                    <input
                      v-model="form.sku"
                      type="text"
                      placeholder="PRD-0001"
                      class="fi font-mono"
                    />
                  </div>
                  <div>
                    <label class="fl">Stok <span class="text-red-400">*</span></label>
                    <div class="flex">
                      <button
                        type="button"
                        class="w-9 h-9 shrink-0 border border-r-0 border-gray-200 rounded-l-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors select-none text-base"
                        @click="adjustStock(-1)"
                      >−</button>
                      <input
                        v-model="form.stock"
                        type="number"
                        min="0"
                        placeholder="0"
                        class="flex-1 h-9 border border-gray-200 text-center text-sm font-bold text-gray-800 outline-none focus:border-[#117c6f] focus:ring-1 focus:ring-[#117c6f]/20 transition-all bg-white"
                        :class="errors.stock ? 'border-red-300' : ''"
                      />
                      <button
                        type="button"
                        class="w-9 h-9 shrink-0 border border-l-0 border-gray-200 rounded-r-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 active:bg-gray-100 transition-colors select-none text-base"
                        @click="adjustStock(1)"
                      >+</button>
                    </div>
                    <p v-if="errors.stock" class="fe">{{ errors.stock }}</p>
                  </div>
                </div>

              </div>

              <!-- ▸ STEP 3 — Review -->
              <div v-else-if="currentStep === 3" class="space-y-3">

                <!-- Product card preview -->
                <div class="border border-gray-100 rounded-xl overflow-hidden">
                  <!-- Top: foto + info utama -->
                  <div class="flex items-center gap-3 px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                    <div class="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0 flex items-center justify-center">
                      <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover"/>
                      <svg v-else width="18" height="18" viewBox="0 0 28 28" fill="none">
                        <path d="M4 7l10-4 10 4v11l-10 6-10-6V7z" stroke="#D1D5DB" stroke-width="1.5" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-bold text-gray-800 truncate">{{ form.name || '—' }}</p>
                      <p class="text-xs text-gray-400">{{ categoryName || '—' }}</p>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <span class="text-sm font-bold text-[#117c6f]">{{ formatDisplay(effectivePrice) }}</span>
                      <span v-if="discountPercent > 0" class="text-[11px] font-bold bg-red-100 text-red-500 px-1.5 py-0.5 rounded">-{{ discountPercent }}%</span>
                      <!-- Status toggle -->
                      <div
                        class="relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ml-1"
                        :class="form.is_active ? 'bg-emerald-500' : 'bg-gray-300'"
                        @click="form.is_active = !form.is_active"
                      >
                        <div
                          class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                          :class="form.is_active ? 'translate-x-4' : 'translate-x-0'"
                        ></div>
                      </div>
                    </div>
                  </div>

                  <!-- Data grid -->
                  <div class="grid grid-cols-2 divide-x divide-gray-50">
                    <div class="px-4 py-2.5 border-b border-gray-50">
                      <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">SKU</p>
                      <p class="text-xs font-semibold text-gray-700 font-mono">{{ form.sku || '—' }}</p>
                    </div>
                    <div class="px-4 py-2.5 border-b border-gray-50">
                      <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Stok</p>
                      <p
                        class="text-xs font-semibold"
                        :class="Number(form.stock) <= 5 ? 'text-red-500' : Number(form.stock) <= 10 ? 'text-orange-500' : 'text-gray-700'"
                      >{{ form.stock || '0' }} unit</p>
                    </div>
                    <div class="px-4 py-2.5">
                      <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Harga Normal</p>
                      <p class="text-xs font-semibold text-gray-700">{{ form.price ? formatDisplay(Number(form.price)) : '—' }}</p>
                    </div>
                    <div class="px-4 py-2.5">
                      <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Harga Diskon</p>
                      <p class="text-xs font-semibold text-gray-700">{{ form.discount_price ? formatDisplay(Number(form.discount_price)) : '—' }}</p>
                    </div>
                  </div>

                  <div v-if="form.description" class="px-4 py-2.5 border-t border-gray-50">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Deskripsi</p>
                    <p class="text-xs text-gray-600 leading-relaxed">{{ form.description }}</p>
                  </div>
                </div>

                <!-- Status label -->
                <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="form.is_active ? 'bg-emerald-500' : 'bg-gray-400'"
                  ></span>
                  <span class="text-xs text-gray-500">
                    Produk akan disimpan sebagai
                    <span class="font-semibold" :class="form.is_active ? 'text-emerald-600' : 'text-gray-600'">
                      {{ form.is_active ? 'Aktif' : 'Nonaktif' }}
                    </span>
                    — ubah toggle di atas jika perlu
                  </span>
                </div>

                <!-- Error -->
                <div
                  v-if="formError"
                  class="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg"
                >
                  <svg class="text-red-400 shrink-0" width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <p class="text-xs text-red-600">{{ formError }}</p>
                </div>

              </div>
            </div>

            <!-- ── FOOTER ──────────────────────────────────────────────── -->
            <div class="shrink-0 px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-b-2xl">
              <p class="text-[11px] text-gray-400">
                Langkah <span class="font-semibold text-gray-600">{{ currentStep }}</span> / <span class="font-semibold text-gray-600">{{ steps.length }}</span>
              </p>
              <div class="flex items-center gap-2">
                <button
                  v-if="currentStep > 1"
                  type="button"
                  class="px-3.5 py-2 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-white transition-colors"
                  @click="prevStep"
                >← Kembali</button>
                <button
                  v-else
                  type="button"
                  class="px-3.5 py-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-white transition-colors"
                  @click="closeModal"
                >Batal</button>

                <button
                  v-if="currentStep < steps.length"
                  type="button"
                  class="px-4 py-2 bg-[#117c6f] text-white text-xs font-semibold rounded-lg hover:bg-teal-700 active:scale-[0.98] transition-all"
                  @click="nextStep"
                >Lanjut →</button>
                <button
                  v-else
                  type="button"
                  :disabled="isSaving"
                  class="px-4 py-2 bg-[#117c6f] text-white text-xs font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-60 active:scale-[0.98] transition-all flex items-center gap-1.5"
                  @click="handleSubmit"
                >
                  <svg v-if="isSaving" class="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  {{ isSaving ? 'Menyimpan...' : editingProduct ? 'Simpan Perubahan' : 'Simpan Produk' }}
                </button>
              </div>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import api from '@/lib/axios'

interface Category { id: number; name: string }
interface Product {
  id: number; name: string; sku: string | null; description: string | null
  image: string | null; image_url: string | null; price: number
  discount_price: number | null; effective_price: number
  stock: number; is_active: boolean; category: Category | null; category_id: number
}

const props = defineProps<{
  showModal: boolean
  editingProduct: Product | null
  categories: Category[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const isSaving      = ref(false)
const formError     = ref('')
const currentStep   = ref(1)
const isDragging    = ref(false)
const fileInput     = ref<HTMLInputElement | null>(null)
const imagePreview  = ref<string | null>(null)
const imageFile     = ref<File | null>(null)
const imageFileName = ref('')
const imageFileSize = ref('')

const errors = reactive<Record<string, string>>({ name: '', category_id: '', price: '', stock: '' })

const steps = [
  { key: 'info',   label: 'Info Produk'  },
  { key: 'price',  label: 'Harga & Stok' },
  { key: 'review', label: 'Review'       },
]

const form = reactive({
  name: '', sku: '', category_id: '' as string | number,
  description: '', price: '', discount_price: '', stock: '', is_active: true,
})

const effectivePrice = computed(() => {
  const d = Number(form.discount_price), p = Number(form.price)
  return d > 0 && d < p ? d : p
})
const discountPercent = computed(() => {
  const d = Number(form.discount_price), p = Number(form.price)
  if (!d || !p || d >= p) return 0
  return Math.round((1 - d / p) * 100)
})
const categoryName = computed(() =>
  props.categories.find(c => c.id === Number(form.category_id))?.name ?? ''
)

function validateStep(step: number): boolean {
  if (step === 1) {
    errors.name        = form.name.trim()  ? '' : 'Nama produk wajib diisi'
    errors.category_id = form.category_id  ? '' : 'Kategori wajib dipilih'
    return !errors.name && !errors.category_id
  }
  if (step === 2) {
    errors.price = form.price  ? '' : 'Harga wajib diisi'
    errors.stock = form.stock !== '' ? '' : 'Stok wajib diisi'
    return !errors.price && !errors.stock
  }
  return true
}

function nextStep() { if (validateStep(currentStep.value) && currentStep.value < steps.length) currentStep.value++ }
function prevStep()  { if (currentStep.value > 1) currentStep.value-- }
function goToStep(n: number) { currentStep.value = n }

function closeModal() { emit('close'); setTimeout(resetForm, 200) }
function resetForm() {
  currentStep.value = 1; formError.value = ''
  imagePreview.value = null; imageFile.value = null
  imageFileName.value = ''; imageFileSize.value = ''
  Object.assign(errors, { name: '', category_id: '', price: '', stock: '' })
  Object.assign(form, { name: '', sku: '', category_id: '', description: '', price: '', discount_price: '', stock: '', is_active: true })
}

function openModal(product?: Product) {
  resetForm()
  if (product) {
    Object.assign(form, {
      name: product.name, sku: product.sku ?? '',
      category_id: String(product.category_id), description: product.description ?? '',
      price: String(product.price), discount_price: product.discount_price ? String(product.discount_price) : '',
      stock: String(product.stock), is_active: product.is_active,
    })
    if (product.image_url) imagePreview.value = product.image_url
  }
}
defineExpose({ openModal })

function triggerFileInput() { fileInput.value?.click() }
function processFile(file: File) {
  if (file.size > 2 * 1024 * 1024) { alert('Maksimal 2MB'); return }
  imageFile.value = file; imageFileName.value = file.name
  imageFileSize.value = (file.size / 1024).toFixed(0) + ' KB'
  imagePreview.value = URL.createObjectURL(file)
}
function handleImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) processFile(file)
}
function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file?.type.startsWith('image/')) processFile(file)
}
function removeImage() {
  imagePreview.value = null; imageFile.value = null
  imageFileName.value = ''; imageFileSize.value = ''
  if (fileInput.value) fileInput.value.value = ''
}

function generateSku() {
  const prefix = (form.name.slice(0, 3) || 'PRD').toUpperCase().replace(/\s/g, '')
  form.sku = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`
}
function adjustStock(delta: number) {
  form.stock = String(Math.max(0, (Number(form.stock) || 0) + delta))
}
function handlePriceInput(field: 'price' | 'discount_price', e: Event) {
  form[field] = (e.target as HTMLInputElement).value.replace(/\D/g, '')
}
function formatRupiah(val: string) {
  return val ? Number(val).toLocaleString('id-ID') : ''
}
function formatDisplay(val: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

async function handleSubmit() {
  if (!validateStep(1) || !validateStep(2)) { formError.value = 'Masih ada data yang belum lengkap.'; return }
  formError.value = ''; isSaving.value = true
  try {
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== '' && v !== null && v !== undefined)
        fd.append(k, k === 'is_active' ? (v ? '1' : '0') : String(v))
    })
    if (imageFile.value) fd.append('image', imageFile.value)
    if (props.editingProduct) {
      fd.append('_method', 'PUT')
      await api.post(`/auth/products/${props.editingProduct.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    } else {
      await api.post('/auth/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    }
    emit('saved'); closeModal()
  } catch (err: any) {
    const e = err?.response?.data?.errors
    formError.value = e ? Object.values(e).flat().join(', ') : 'Gagal menyimpan produk.'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
@reference "tailwindcss";

/* Form label */
.fl {
  @apply block text-xs font-semibold text-gray-600 mb-1;
}

/* Form input */
.fi {
  @apply w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none
         focus:border-[#117c6f] focus:ring-2 focus:ring-[#117c6f]/10
         bg-white text-gray-800 placeholder-gray-300
         transition-all duration-150;
}

/* Form input error */
.fi-err {
  @apply border-red-300 focus:border-red-400 focus:ring-red-100;
}

/* Form error text */
.fe {
  @apply text-[11px] text-red-500 mt-1;
}
</style>