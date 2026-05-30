<template>
  <div class="min-h-screen flex font-body">
    <!-- ── LEFT PANEL (branding) ─────────────────────────────── -->
    <div
      class="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#0F4C75] flex-col justify-between p-12"
    >
      <!-- Decorative circles -->
      <div class="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5"></div>
      <div class="absolute top-1/3 -right-32 w-72 h-72 rounded-full bg-[#1B6CA8]/60"></div>
      <div class="absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-white/[0.04]"></div>

      <!-- Dot grid pattern -->
      <div
        class="absolute inset-0 opacity-20"
        style="
          background-image: radial-gradient(circle, #ffffff 1px, transparent 1px);
          background-size: 28px 28px;
        "
      ></div>

      <!-- Top logo -->
      <div class="relative z-10 flex items-center gap-3">
        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="11" height="11" rx="2.5" fill="#0F4C75" />
            <rect x="15" y="2" width="11" height="11" rx="2.5" fill="#0F4C75" opacity="0.4" />
            <rect x="2" y="15" width="11" height="11" rx="2.5" fill="#0F4C75" opacity="0.4" />
            <rect x="15" y="15" width="11" height="11" rx="2.5" fill="#0F4C75" />
          </svg>
        </div>
        <span class="text-white font-display font-bold text-xl tracking-tight">POSsistem</span>
      </div>

      <!-- Center content -->
      <div class="relative z-10 space-y-8">
        <div class="space-y-4">
          <div
            class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5"
          >
            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span class="text-white/80 text-xs font-medium tracking-wide"
              >Sistem Kasir Terpadu</span
            >
          </div>
          <h2 class="text-white font-display font-bold text-4xl leading-tight">
            Kelola bisnis<br />lebih <span class="text-[#63B3ED]">cerdas</span><br />& efisien.
          </h2>
          <p class="text-white/55 text-base leading-relaxed max-w-xs">
            Platform POS modern untuk UMKM dan enterprise. Real-time, akurat, dan mudah digunakan.
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p class="text-white font-display font-bold text-2xl">12K+</p>
            <p class="text-white/50 text-xs mt-1">Merchant aktif</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p class="text-white font-display font-bold text-2xl">99.9%</p>
            <p class="text-white/50 text-xs mt-1">Uptime</p>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p class="text-white font-display font-bold text-2xl">4.9★</p>
            <p class="text-white/50 text-xs mt-1">Rating</p>
          </div>
        </div>
      </div>

      <!-- Bottom testimonial -->
      <div
        class="relative z-10 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5"
      >
        <p class="text-white/80 text-sm leading-relaxed italic">
          "POSsistem mengubah cara kami mengelola 8 cabang sekaligus. Laporan real-time-nya luar
          biasa."
        </p>
        <div class="flex items-center gap-3 mt-4">
          <div
            class="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold"
          >
            R
          </div>
          <div>
            <p class="text-white text-sm font-semibold">Rizky Pratama</p>
            <p class="text-white/45 text-xs">Owner, Warung Barokah Group</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── RIGHT PANEL (form) ─────────────────────────────────── -->
    <div class="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-gray-50">
      <!-- Mobile logo -->
      <div class="lg:hidden flex items-center gap-2 mb-10">
        <div class="w-9 h-9 bg-[#0F4C75] rounded-xl flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <rect x="2" y="2" width="11" height="11" rx="2.5" fill="white" />
            <rect x="15" y="2" width="11" height="11" rx="2.5" fill="white" opacity="0.4" />
            <rect x="2" y="15" width="11" height="11" rx="2.5" fill="white" opacity="0.4" />
            <rect x="15" y="15" width="11" height="11" rx="2.5" fill="white" />
          </svg>
        </div>
        <span class="font-display font-bold text-xl text-gray-900">POSsistem</span>
      </div>

      <div class="w-full max-w-[400px] animate-slide-up">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="font-display font-bold text-3xl text-gray-900 tracking-tight">
            Masuk ke akun
          </h1>
          <p class="mt-2 text-gray-500 text-sm">
            Selamat datang kembali! Masukkan kredensial Anda.
          </p>
        </div>

        <!-- Error alert -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1 scale-[0.98]"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0 scale-[0.98]"
        >
          <div
            v-if="errorMessage"
            class="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3.5 rounded-xl mb-6"
          >
            <svg
              class="flex-shrink-0 mt-0.5"
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
              <path
                d="M8 5v3.5M8 11h.01"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        </Transition>

        <!-- Form -->
        <form @submit.prevent="handleLogin" novalidate class="space-y-5">
          <!-- Email -->
          <div class="space-y-1.5">
            <label for="email" class="block text-sm font-semibold text-gray-700"
              >Alamat Email</label
            >
            <div class="relative" :class="emailWrapClass">
              <svg
                class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                :class="focusedField === 'email' ? 'text-[#0F4C75]' : 'text-gray-400'"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="1"
                  y="3"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="1.4"
                />
                <path
                  d="M1 5.5l7 4.5 7-4.5"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                />
              </svg>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="nama@perusahaan.com"
                autocomplete="email"
                class="w-full pl-10 pr-4 py-3 text-sm text-gray-900 bg-white border rounded-xl outline-none transition-all duration-200 placeholder-gray-400"
                :class="emailInputClass"
                @focus="onFocus('email')"
                @blur="onBlur('email')"
              />
            </div>
            <p v-if="fieldErrors.email" class="text-xs text-red-500 flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.4" />
                <path
                  d="M6 4v2.5M6 8.5h.01"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                />
              </svg>
              {{ fieldErrors.email }}
            </p>
          </div>

          <!-- Password -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-semibold text-gray-700"
                >Password</label
              >
              <a href="#" class="text-xs text-[#0F4C75] font-medium hover:underline"
                >Lupa password?</a
              >
            </div>
            <div class="relative">
              <svg
                class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                :class="focusedField === 'password' ? 'text-[#0F4C75]' : 'text-gray-400'"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <rect
                  x="3"
                  y="7"
                  width="10"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  stroke-width="1.4"
                />
                <path
                  d="M5 7V5a3 3 0 016 0v2"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                />
              </svg>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                autocomplete="current-password"
                class="w-full pl-10 pr-11 py-3 text-sm text-gray-900 bg-white border rounded-xl outline-none transition-all duration-200 placeholder-gray-400"
                :class="passwordInputClass"
                @focus="onFocus('password')"
                @blur="onBlur('password')"
              />
              <button
                type="button"
                tabindex="-1"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                @click="showPassword = !showPassword"
              >
                <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
                    stroke="currentColor"
                    stroke-width="1.4"
                  />
                  <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4" />
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 2l12 12M6.5 6.6A2 2 0 0010 10M4 4.4C2.5 5.5 1 8 1 8s2.5 5 7 5c1.3 0 2.5-.4 3.5-1M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.7 1.4-1.9 2.7"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            <p v-if="fieldErrors.password" class="text-xs text-red-500 flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" stroke-width="1.4" />
                <path
                  d="M6 4v2.5M6 8.5h.01"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                />
              </svg>
              {{ fieldErrors.password }}
            </p>
          </div>

          <!-- Remember me -->
          <div class="flex items-center">
            <label class="flex items-center gap-2.5 cursor-pointer select-none group">
              <input type="checkbox" v-model="form.remember" class="hidden" />
              <div
                class="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all duration-150 flex-shrink-0"
                :class="
                  form.remember
                    ? 'bg-[#0F4C75] border-[#0F4C75]'
                    : 'border-gray-300 bg-white group-hover:border-[#0F4C75]/50'
                "
              >
                <svg v-if="form.remember" width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5 9 1"
                    stroke="white"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span class="text-sm text-gray-600 group-hover:text-gray-800 transition-colors"
                >Ingat saya selama 30 hari</span
              >
            </label>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            :class="
              isLoading
                ? 'bg-[#0F4C75]'
                : 'bg-[#0F4C75] hover:bg-[#1B6CA8] active:scale-[0.99] shadow-[0_4px_14px_rgba(15,76,117,0.35)] hover:shadow-[0_6px_20px_rgba(15,76,117,0.45)]'
            "
          >
            <span v-if="!isLoading" class="flex items-center justify-center gap-2">
              Masuk ke Dashboard
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg
                class="animate-spin h-4 w-4"
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
              Memverifikasi...
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-xs text-gray-400 font-medium">AMAN & TERENKRIPSI</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>

        <!-- Trust badges -->
        <div class="flex items-center justify-center gap-5">
          <div class="flex items-center gap-1.5 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1l1.5 4.5H14l-3.7 2.7 1.4 4.3L8 10l-3.7 2.5 1.4-4.3L2 5.5h4.5L8 1z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-xs">SSL 256-bit</span>
          </div>
          <div class="w-px h-4 bg-gray-200"></div>
          <div class="flex items-center gap-1.5 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect
                x="3"
                y="7"
                width="10"
                height="8"
                rx="1.5"
                stroke="currentColor"
                stroke-width="1.3"
              />
              <path
                d="M5 7V5a3 3 0 016 0v2"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
              />
            </svg>
            <span class="text-xs">Data Terproteksi</span>
          </div>
          <div class="w-px h-4 bg-gray-200"></div>
          <div class="flex items-center gap-1.5 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.3" />
              <path
                d="M5.5 8l2 2 3-3"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="text-xs">Verified</span>
          </div>
        </div>

        <p class="text-center mt-8 text-xs text-gray-400">
          © {{ new Date().getFullYear() }} POSsistem. Hak cipta dilindungi. ·
          <a href="#" class="hover:text-gray-600">Kebijakan Privasi</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '', remember: false })
const isLoading = ref(false)
const showPassword = ref(false)
const focusedField = ref('')
const errorMessage = ref('')
const fieldErrors = reactive({ email: '', password: '' })

// ── Focus / blur ──────────────────────────────────────────────────────────────
function onFocus(field: 'email' | 'password') {
  focusedField.value = field
}
function onBlur(field: 'email' | 'password') {
  focusedField.value = ''
  validateField(field)
}

// ── Computed classes ──────────────────────────────────────────────────────────
const emailInputClass = computed(() => {
  if (focusedField.value === 'email') return 'border-[#0F4C75] ring-2 ring-[#0F4C75]/15'
  if (fieldErrors.email) return 'border-red-400 ring-2 ring-red-100'
  return 'border-gray-200 hover:border-gray-300'
})

const emailWrapClass = computed(() => '')

const passwordInputClass = computed(() => {
  if (focusedField.value === 'password') return 'border-[#0F4C75] ring-2 ring-[#0F4C75]/15'
  if (fieldErrors.password) return 'border-red-400 ring-2 ring-red-100'
  return 'border-gray-200 hover:border-gray-300'
})

// ── Validation ────────────────────────────────────────────────────────────────
function validateField(field: 'email' | 'password') {
  if (field === 'email') {
    if (!form.email) fieldErrors.email = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      fieldErrors.email = 'Format email tidak valid'
    else fieldErrors.email = ''
  }
  if (field === 'password') {
    fieldErrors.password = !form.password ? 'Password wajib diisi' : ''
  }
}

function validateAll() {
  validateField('email')
  validateField('password')
  return !fieldErrors.email && !fieldErrors.password
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function handleLogin() {
  errorMessage.value = ''
  if (!validateAll()) return
  isLoading.value = true
  try {
    await authStore.login(form.email, form.password, form.remember)
    router.push({ name: 'pos' })
  } catch (err: any) {
    const status = err?.response?.status
    if (status === 401 || status === 422)
      errorMessage.value = 'Email atau password salah. Silakan coba lagi.'
    else if (status === 429)
      errorMessage.value = 'Terlalu banyak percobaan. Coba beberapa saat lagi.'
    else errorMessage.value = 'Gagal terhubung ke server. Periksa koneksi Anda.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-body {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.font-display {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slide-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
</style>
