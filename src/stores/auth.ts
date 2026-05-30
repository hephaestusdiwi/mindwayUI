// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/lib/axios'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar: string | null
  avatar_url: string | null // ← tambah ini
}

export const useAuthStore = defineStore('auth', () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const token = ref<string | null>(
    localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token')
  )
  const user = ref<User | null>(JSON.parse(localStorage.getItem('auth_user') ?? 'null'))

  // ─── Getters ──────────────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!token.value)

  // ─── Actions ──────────────────────────────────────────────────────────────

  /**
   * Login ke Laravel Sanctum API.
   * Backend harus return: { token: string, user: User }
   */
  async function login(email: string, password: string, remember = false) {
    const { data } = await api.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    })

    // Simpan token & user
    setToken(data.token, remember)
    setUser(data.user)
  }

  /** Logout: hapus token di backend lalu bersihkan state lokal */
  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      // Tetap lanjut logout meski request gagal (misal token sudah expired)
    } finally {
      clearSession()
    }
  }

  /** Fetch profil user yang sedang login (opsional, untuk re-hydrate) */
  async function fetchUser() {
    const { data } = await api.get<User>('/user')
    setUser(data)
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  function setToken(value: string, persist: boolean) {
    token.value = value
    if (persist) {
      localStorage.setItem('auth_token', value)
    } else {
      // Gunakan sessionStorage agar hilang saat tab ditutup
      sessionStorage.setItem('auth_token', value)
      localStorage.removeItem('auth_token')
    }
  }

  function setUser(value: User) {
    user.value = value
    localStorage.setItem('auth_user', JSON.stringify(value))
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    sessionStorage.removeItem('auth_token')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
    clearSession,
  }
})
