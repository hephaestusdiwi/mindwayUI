// src/lib/axios.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false, // Diperlukan jika pakai cookie-based Sanctum
})

// ── Request interceptor: sisipkan Bearer token otomatis ──────────────────────
api.interceptors.request.use((config) => {
  // Cek localStorage dulu, fallback ke sessionStorage
  const token: string | null    = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token')
  const outletId: string | null = localStorage.getItem('active_outlet')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  if (outletId) {
    config.headers['X-Outlet-ID'] = outletId
  }
  return config
})

// ── Response interceptor: handle 401 global ──────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token tidak valid / expired → bersihkan sesi & redirect ke login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      sessionStorage.removeItem('auth_token')

      // Hindari redirect loop jika sudah di halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
