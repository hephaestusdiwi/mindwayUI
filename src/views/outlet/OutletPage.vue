<template>
  <div class="outlet-page">

    <!-- ── Header ─────────────────────────────────────────────── -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Manajemen Outlet</h1>
        <p class="page-sub">Kelola outlet dan tim per lokasi</p>
      </div>
      <button class="btn-primary" @click="openCreateOutlet">
        <span class="btn-icon">+</span> Tambah Outlet
      </button>
    </div>

    <!-- ── Active Outlet Banner ───────────────────────────────── -->
    <div class="active-banner">
      <div class="active-banner-left">
        <div class="active-dot"></div>
        <div>
          <p class="active-label">Outlet Aktif Sekarang</p>
          <p class="active-name">{{ activeOutlet?.name ?? 'Belum dipilih' }}</p>
        </div>
      </div>
      <select class="outlet-switcher" v-model="selectedOutletId" @change="switchOutlet">
        <option v-for="o in outlets" :key="o.id" :value="o.id">{{ o.name }}</option>
      </select>
    </div>

    <!-- ── Outlet Cards ───────────────────────────────────────── -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat outlet...</p>
    </div>

    <div v-else-if="outlets.length === 0" class="empty-state">
      <div class="empty-icon">🏪</div>
      <p class="empty-title">Belum ada outlet</p>
      <p class="empty-sub">Tambahkan outlet pertama kamu</p>
      <button class="btn-primary" @click="openCreateOutlet">+ Tambah Outlet</button>
    </div>

    <div v-else class="outlet-grid">
      <div
        v-for="outlet in outlets"
        :key="outlet.id"
        class="outlet-card"
        :class="{ 'is-active': outlet.id === selectedOutletId }"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="outlet-avatar">{{ outlet.name?.charAt(0)?.toUpperCase() }}</div>
          <div class="outlet-info">
            <h3 class="outlet-name">{{ outlet.name }}</h3>
            <p class="outlet-address">{{ outlet.address || 'Alamat belum diisi' }}</p>
          </div>
          <span class="status-badge" :class="outlet.is_active ? 'active' : 'inactive'">
            {{ outlet.is_active ? 'Aktif' : 'Nonaktif' }}
          </span>
        </div>

        <!-- Staff List -->
        <div class="staff-section">
          <div class="staff-header">
            <p class="staff-label">Tim ({{ outlet.users?.length ?? 0 }} orang)</p>
            <button class="btn-assign" @click="openAssignUser(outlet)">+ Assign</button>
          </div>

          <div v-if="outlet.users?.length" class="staff-list">
            <div v-for="u in outlet.users" :key="u.id" class="staff-item">
              <div class="staff-avatar">{{ u.name?.charAt(0)?.toUpperCase() }}</div>
              <div class="staff-info">
                <p class="staff-name">{{ u.name }}</p>
                <span class="role-badge" :class="u.pivot?.role">{{ roleLabel(u.pivot?.role) }}</span>
              </div>
              <button class="btn-remove" @click="removeUser(outlet, u)" title="Hapus dari outlet">✕</button>
            </div>
          </div>

          <p v-else class="no-staff">Belum ada tim di outlet ini</p>
        </div>

        <!-- Card Actions -->
        <div class="card-actions">
          <button class="btn-outline" @click="editOutlet(outlet)">Edit</button>
          <button class="btn-danger-outline" @click="deleteOutlet(outlet)">Hapus</button>
        </div>
      </div>
    </div>

    <!-- ── Modal: Create/Edit Outlet ─────────────────────────── -->
    <Transition name="modal">
      <div v-if="showOutletModal" class="modal-overlay" @click.self="showOutletModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h2>{{ outletForm.id ? 'Edit Outlet' : 'Tambah Outlet Baru' }}</h2>
            <button class="modal-close" @click="showOutletModal = false">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Nama Outlet <span class="required">*</span></label>
              <input v-model="outletForm.name" placeholder="cth: Outlet Pusat" class="form-input" />
            </div>
            <div class="form-group">
              <label>Alamat</label>
              <textarea v-model="outletForm.address" placeholder="Alamat lengkap outlet" class="form-input" rows="3" />
            </div>
            <div class="form-group" v-if="outletForm.id">
              <label>Status</label>
              <select v-model="outletForm.is_active" class="form-input">
                <option :value="true">Aktif</option>
                <option :value="false">Nonaktif</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-ghost" @click="showOutletModal = false">Batal</button>
            <button class="btn-primary" :disabled="savingOutlet" @click="saveOutlet">
              {{ savingOutlet ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Modal: Assign User ─────────────────────────────────── -->
    <Transition name="modal">
      <div v-if="showAssignModal" class="modal-overlay" @click.self="showAssignModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <h2>Assign User ke <span class="highlight">{{ assignTarget?.name }}</span></h2>
            <button class="modal-close" @click="showAssignModal = false">✕</button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label>Pilih User <span class="required">*</span></label>
              <select v-model="assignForm.user_id" class="form-input">
                <option value="" disabled>-- Pilih user --</option>
                <option
                  v-for="u in availableUsers"
                  :key="u.id"
                  :value="u.id"
                >{{ u.name }} ({{ u.email }})</option>
              </select>
            </div>
            <div class="form-group">
              <label>Role</label>
              <select v-model="assignForm.role" class="form-input">
                <option value="cashier">Kasir</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-ghost" @click="showAssignModal = false">Batal</button>
            <button class="btn-primary" :disabled="savingAssign" @click="saveAssignUser">
              {{ savingAssign ? 'Menyimpan...' : 'Assign' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Toast ─────────────────────────────────────────────── -->
    <Transition name="toast">
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/lib/axios'

// ── State ──────────────────────────────────────────────────────────────────
const outlets        = ref([])
const allUsers       = ref([])
const loading        = ref(false)
const selectedOutletId = ref(Number(localStorage.getItem('active_outlet')) || null)
const activeOutlet   = computed(() => outlets.value.find(o => o.id === selectedOutletId.value))

// Outlet modal
const showOutletModal = ref(false)
const savingOutlet    = ref(false)
const outletForm      = ref({ id: null, name: '', address: '', is_active: true })

// Assign modal
const showAssignModal = ref(false)
const savingAssign    = ref(false)
const assignTarget    = ref(null)
const assignForm      = ref({ user_id: '', role: 'cashier' })

// Toast
const toast = ref({ show: false, message: '', type: 'success' })

// ── Computed ───────────────────────────────────────────────────────────────
const availableUsers = computed(() => {
  if (!assignTarget.value) return allUsers.value
  const assignedIds = assignTarget.value.users?.map(u => u.id) ?? []
  return allUsers.value.filter(u => !assignedIds.includes(u.id))
})

// ── Fetch ──────────────────────────────────────────────────────────────────
const fetchOutlets = async () => {
  loading.value = true
  try {
    const res = await api.get('/auth/outlets')
    outlets.value = Array.isArray(res.data) ? res.data : res.data.data ?? []

    // Set active outlet jika belum ada
    if (!selectedOutletId.value && outlets.value.length) {
      selectedOutletId.value = outlets.value[0].id
      localStorage.setItem('active_outlet', outlets.value[0].id)
    }
  } catch (err) {
    showToast('Gagal memuat outlet', 'error')
    if (err.response?.status === 401) window.location.href = '/login'
  } finally {
    loading.value = false
  }
}

const fetchUsers = async () => {
  try {
    const res = await api.get('/auth/users')
    allUsers.value = Array.isArray(res.data) ? res.data : res.data.data ?? []
  } catch {
    // Gagal fetch users tidak perlu block UI
  }
}

// ── Outlet CRUD ────────────────────────────────────────────────────────────
const openCreateOutlet = () => {
  outletForm.value = { id: null, name: '', address: '', is_active: true }
  showOutletModal.value = true
}

const editOutlet = (outlet) => {
  outletForm.value = { id: outlet.id, name: outlet.name, address: outlet.address, is_active: outlet.is_active }
  showOutletModal.value = true
}

const saveOutlet = async () => {
  if (!outletForm.value.name.trim()) return showToast('Nama outlet wajib diisi', 'error')

  savingOutlet.value = true
  try {
    if (outletForm.value.id) {
      await api.post(`/auth/outlets/${outletForm.value.id}`, outletForm.value)
      showToast('Outlet berhasil diperbarui')
    } else {
      await api.post('/auth/outlets', outletForm.value)
      showToast('Outlet berhasil ditambahkan')
    }
    showOutletModal.value = false
    fetchOutlets()
  } catch (err) {
    showToast(err.response?.data?.message ?? 'Gagal menyimpan outlet', 'error')
  } finally {
    savingOutlet.value = false
  }
}

const deleteOutlet = async (outlet) => {
  if (!confirm(`Hapus outlet "${outlet.name}"? Tindakan ini tidak bisa dibatalkan.`)) return
  try {
    await api.delete(`/auth/outlets/${outlet.id}`)
    showToast('Outlet berhasil dihapus')
    fetchOutlets()
  } catch (err) {
    showToast(err.response?.data?.message ?? 'Gagal menghapus outlet', 'error')
  }
}

// ── Switch Outlet ──────────────────────────────────────────────────────────
const switchOutlet = async () => {
  try {
    await api.post('/auth/outlets/switch', { outlet_id: selectedOutletId.value })
    localStorage.setItem('active_outlet', selectedOutletId.value)
    api.defaults.headers.common['X-Outlet-ID'] = selectedOutletId.value
    showToast('Outlet aktif berhasil diganti')
    setTimeout(() => location.reload(), 800)
  } catch (err) {
    showToast(err.response?.data?.message ?? 'Gagal mengganti outlet', 'error')
  }
}

// ── Assign User ────────────────────────────────────────────────────────────
const openAssignUser = (outlet) => {
  assignTarget.value = outlet
  assignForm.value   = { user_id: '', role: 'cashier' }
  showAssignModal.value = true
  fetchUsers()
}

const saveAssignUser = async () => {
  if (!assignForm.value.user_id) return showToast('Pilih user terlebih dahulu', 'error')

  savingAssign.value = true
  try {
    await api.post(`/auth/outlets/${assignTarget.value.id}/assign-user`, assignForm.value)
    showToast('User berhasil di-assign ke outlet')
    showAssignModal.value = false
    fetchOutlets()
  } catch (err) {
    showToast(err.response?.data?.message ?? 'Gagal assign user', 'error')
  } finally {
    savingAssign.value = false
  }
}

const removeUser = async (outlet, user) => {
  if (!confirm(`Hapus ${user.name} dari outlet "${outlet.name}"?`)) return
  try {
    await api.delete(`/auth/outlets/${outlet.id}/remove-user/${user.id}`)
    showToast(`${user.name} berhasil dihapus dari outlet`)
    fetchOutlets()
  } catch (err) {
    showToast(err.response?.data?.message ?? 'Gagal menghapus user', 'error')
  }
}

// ── Helper ─────────────────────────────────────────────────────────────────
const roleLabel = (role) => {
  return { admin: 'Admin', manager: 'Manager', cashier: 'Kasir', owner: 'Owner' }[role] ?? role
}

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

onMounted(fetchOutlets)
</script>

<style scoped>
.outlet-page {
  padding: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}
.page-title { font-size: 1.5rem; font-weight: 700; color: #1a1a2e; margin: 0; }
.page-sub   { font-size: 0.8rem; color: #94a3b8; margin: 0.2rem 0 0; }

/* Active Banner */
.active-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #117c6f, #0e6459);
  color: white;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}
.active-banner-left { display: flex; align-items: center; gap: 0.75rem; }
.active-dot {
  width: 10px; height: 10px;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(74,222,128,0.3);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(74,222,128,0.3); }
  50%       { box-shadow: 0 0 0 6px rgba(74,222,128,0.1); }
}
.active-label { font-size: 0.72rem; opacity: 0.7; margin: 0; }
.active-name  { font-size: 1rem; font-weight: 600; margin: 0; }
.outlet-switcher {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
}
.outlet-switcher option { color: #1a1a2e; background: white; }

/* Grid */
.outlet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

/* Card */
.outlet-card {
  background: white;
  border-radius: 1rem;
  border: 1.5px solid #e2e8f0;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.outlet-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
.outlet-card.is-active { border-color: #117c6f; }

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1rem 0.75rem;
}
.outlet-avatar {
  width: 42px; height: 42px;
  background: linear-gradient(135deg, #117c6f, #0e6459);
  color: white;
  border-radius: 0.6rem;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1.1rem;
  flex-shrink: 0;
}
.outlet-info { flex: 1; min-width: 0; }
.outlet-name    { font-weight: 600; font-size: 0.95rem; color: #1e293b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.outlet-address { font-size: 0.75rem; color: #94a3b8; margin: 0.2rem 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.status-badge {
  font-size: 0.68rem; font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  flex-shrink: 0;
}
.status-badge.active   { background: #dcfce7; color: #16a34a; }
.status-badge.inactive { background: #f1f5f9; color: #94a3b8; }

/* Staff */
.staff-section { padding: 0 1rem 0.75rem; border-top: 1px solid #f1f5f9; margin-top: 0.75rem; }
.staff-header  { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 0 0.5rem; }
.staff-label   { font-size: 0.75rem; font-weight: 600; color: #64748b; margin: 0; }

.staff-list { display: flex; flex-direction: column; gap: 0.4rem; }
.staff-item {
  display: flex; align-items: center; gap: 0.6rem;
  background: #f8fafc; border-radius: 0.5rem; padding: 0.45rem 0.6rem;
}
.staff-avatar {
  width: 28px; height: 28px;
  background: #e2e8f0; color: #475569;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 600; flex-shrink: 0;
}
.staff-info { flex: 1; min-width: 0; }
.staff-name { font-size: 0.8rem; font-weight: 500; color: #1e293b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.role-badge {
  font-size: 0.65rem; font-weight: 600;
  padding: 0.1rem 0.4rem; border-radius: 999px;
}
.role-badge.admin   { background: #dbeafe; color: #1d4ed8; }
.role-badge.manager { background: #fef3c7; color: #d97706; }
.role-badge.cashier { background: #f0fdf4; color: #15803d; }
.role-badge.owner   { background: #fae8ff; color: #9333ea; }

.no-staff { font-size: 0.75rem; color: #cbd5e1; text-align: center; padding: 0.75rem 0; }

/* Card Actions */
.card-actions {
  display: flex; gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #f1f5f9;
}

/* Buttons */
.btn-primary {
  background: #117c6f; color: white;
  border: none; border-radius: 0.6rem;
  padding: 0.55rem 1.1rem; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 0.4rem;
  transition: opacity 0.15s;
}
.btn-primary:hover    { opacity: 0.88; }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-icon { font-size: 1.1rem; line-height: 1; }

.btn-outline {
  flex: 1; background: transparent;
  border: 1.5px solid #e2e8f0; color: #475569;
  border-radius: 0.5rem; padding: 0.4rem;
  font-size: 0.8rem; font-weight: 500; cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-outline:hover { border-color: #117c6f; color: #117c6f; }

.btn-danger-outline {
  flex: 1; background: transparent;
  border: 1.5px solid #e2e8f0; color: #94a3b8;
  border-radius: 0.5rem; padding: 0.4rem;
  font-size: 0.8rem; font-weight: 500; cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.btn-danger-outline:hover { border-color: #ef4444; color: #ef4444; }

.btn-assign {
  background: #f0fdf4; color: #16a34a;
  border: 1px solid #bbf7d0; border-radius: 0.4rem;
  padding: 0.2rem 0.55rem; font-size: 0.72rem; font-weight: 600;
  cursor: pointer; transition: background 0.15s;
}
.btn-assign:hover { background: #dcfce7; }

.btn-remove {
  background: none; border: none;
  color: #cbd5e1; font-size: 0.7rem;
  cursor: pointer; padding: 0.2rem;
  transition: color 0.15s; flex-shrink: 0;
}
.btn-remove:hover { color: #ef4444; }

.btn-ghost {
  background: none; border: 1.5px solid #e2e8f0; color: #64748b;
  border-radius: 0.6rem; padding: 0.55rem 1.1rem;
  font-size: 0.85rem; font-weight: 500; cursor: pointer;
}

/* States */
.loading-state, .empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 4rem 1rem; gap: 0.75rem;
  color: #94a3b8;
}
.spinner {
  width: 32px; height: 32px;
  border: 3px solid #e2e8f0; border-top-color: #117c6f;
  border-radius: 50%; animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.empty-icon  { font-size: 2.5rem; }
.empty-title { font-weight: 600; color: #475569; margin: 0; }
.empty-sub   { font-size: 0.85rem; margin: 0; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 50; padding: 1rem;
}
.modal-box {
  background: white; border-radius: 1.25rem;
  width: 100%; max-width: 460px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  overflow: hidden;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9;
}
.modal-header h2 { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0; }
.highlight { color: #117c6f; }
.modal-close {
  background: none; border: none; color: #94a3b8;
  font-size: 1rem; cursor: pointer; padding: 0.25rem;
  transition: color 0.15s;
}
.modal-close:hover { color: #1e293b; }
.modal-body   { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 0.75rem; }

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-group label { font-size: 0.8rem; font-weight: 600; color: #374151; }
.required { color: #ef4444; }
.form-input {
  border: 1.5px solid #e2e8f0; border-radius: 0.6rem;
  padding: 0.6rem 0.75rem; font-size: 0.875rem; color: #1e293b;
  outline: none; transition: border-color 0.15s; width: 100%;
  font-family: inherit; resize: vertical;
}
.form-input:focus { border-color: #117c6f; }

/* Toast */
.toast {
  position: fixed; bottom: 1.5rem; right: 1.5rem;
  padding: 0.75rem 1.25rem; border-radius: 0.75rem;
  font-size: 0.85rem; font-weight: 500; color: white;
  z-index: 100; box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.toast.success { background: #117c6f; }
.toast.error   { background: #ef4444; }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s, transform 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box { transform: scale(0.95) translateY(10px); }

.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(10px); }
</style>