<template>
  <!-- Overlay -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-xl w-[600px] max-h-[90vh] flex flex-col">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 class="text-base font-semibold text-gray-900">
          {{ isEdit ? 'Edit Supplier' : 'Tambah Supplier' }}
        </h2>
        <button @click="$emit('close')"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="overflow-y-auto flex-1 px-6 py-5">
        <div class="grid grid-cols-2 gap-4">

          <!-- Nama -->
          <div class="col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              Nama Supplier <span class="text-red-500">*</span>
            </label>
            <input v-model="form.name" required placeholder="Masukkan nama supplier"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>

          <!-- Kontak -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Nama Kontak</label>
            <input v-model="form.contact_person" placeholder="PIC supplier"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>

          <!-- Telepon -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Telepon</label>
            <input v-model="form.phone" type="tel" placeholder="08xxxxxxxxxx"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
            <input v-model="form.email" type="email" placeholder="email@supplier.com"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>

          <!-- Kota -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Kota</label>
            <input v-model="form.city" placeholder="Jakarta"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>

          <!-- Alamat -->
          <div class="col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Alamat</label>
            <textarea v-model="form.address" rows="2" placeholder="Jl. ..."
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all resize-none" />
          </div>

          <!-- NPWP -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">NPWP</label>
            <input v-model="form.npwp" placeholder="xx.xxx.xxx.x-xxx.xxx"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>

          <!-- Termin -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">
              Termin Pembayaran <span class="text-red-500">*</span>
            </label>
            <select v-model="form.payment_terms" required
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
              <option value="cash">Tunai (Cash)</option>
              <option value="net7">Net 7 hari</option>
              <option value="net14">Net 14 hari</option>
              <option value="net30">Net 30 hari</option>
              <option value="net60">Net 60 hari</option>
            </select>
          </div>

          <!-- Divider bank -->
          <div class="col-span-2">
            <div class="flex items-center gap-3 my-1">
              <div class="flex-1 h-px bg-gray-100"></div>
              <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Info Bank</span>
              <div class="flex-1 h-px bg-gray-100"></div>
            </div>
          </div>

          <!-- Bank -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Nama Bank</label>
            <input v-model="form.bank_name" placeholder="BCA, BRI, Mandiri..."
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">No. Rekening</label>
            <input v-model="form.bank_account" placeholder="1234567890"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Nama Pemilik Rekening</label>
            <input v-model="form.bank_account_name" placeholder="Nama sesuai rekening"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all" />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
            <select v-model="form.status"
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all">
              <option value="active">Aktif</option>
              <option value="inactive">Non-aktif</option>
            </select>
          </div>

          <!-- Catatan -->
          <div class="col-span-2">
            <label class="block text-xs font-medium text-gray-500 mb-1.5">Catatan</label>
            <textarea v-model="form.notes" rows="2" placeholder="Catatan opsional..."
              class="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#117c6f]/20 focus:border-[#117c6f] transition-all resize-none" />
          </div>

        </div>

        <!-- Error -->
        <div v-if="error" class="flex items-center gap-2 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="flex-shrink-0">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M8 5v4M8 10.5v.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          {{ error }}
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
        <button type="button" @click="$emit('close')"
          class="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors">
          Batal
        </button>
        <button @click="submit" :disabled="saving"
          class="px-5 py-2.5 text-sm font-medium bg-[#117c6f] hover:bg-[#0e6b5f] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center gap-2">
          <svg v-if="saving" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-dasharray="32" stroke-dashoffset="12"/>
          </svg>
          {{ saving ? 'Menyimpan...' : 'Simpan' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { usePurchasingStore } from '@/stores/purchasing'

const props = defineProps<{ supplier?: any }>()
const emit  = defineEmits(['close', 'saved'])

const store  = usePurchasingStore()
const saving = ref(false)
const error  = ref('')
const isEdit = ref(false)

const form = reactive({
  name: '', contact_person: '', phone: '', email: '',
  address: '', city: '', npwp: '', payment_terms: 'cash',
  bank_name: '', bank_account: '', bank_account_name: '',
  notes: '', status: 'active',
})

watch(() => props.supplier, (s) => {
  isEdit.value = !!s
  if (s) Object.assign(form, s)
}, { immediate: true })

async function submit() {
  saving.value = true; error.value = ''
  try {
    if (isEdit.value) {
      await store.updateSupplier(props.supplier.id, form)
    } else {
      await store.createSupplier(form)
    }
    emit('saved')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Terjadi kesalahan.'
  } finally {
    saving.value = false
  }
}
</script>