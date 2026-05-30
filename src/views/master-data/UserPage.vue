<template>
  <div class="space-y-5">

    <!-- ── HEADER ─────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="font-bold text-xl text-gray-900">Manajemen User</h2>
        <p class="text-sm text-gray-400 mt-0.5">{{ pagination.total }} user terdaftar</p>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2.5 bg-[#117c6f] text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
        @click="openModal()"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        Tambah User
      </button>
    </div>

    <!-- ── FILTER ─────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
      <div class="relative flex-1 min-w-[200px]">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 11l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Cari nama atau email..."
          class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] focus:ring-2 focus:ring-[#117c6f]/10 transition-all"
          @input="debouncedFetch"
        />
      </div>
      <select
        v-model="filters.role"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white text-gray-600"
        @change="fetchUsers"
      >
        <option value="">Semua Role</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="cashier">Kasir</option>
      </select>
      <select
        v-model="filters.is_active"
        class="px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white text-gray-600"
        @change="fetchUsers"
      >
        <option value="">Semua Status</option>
        <option value="true">Aktif</option>
        <option value="false">Nonaktif</option>
      </select>
    </div>

    <!-- ── TABLE ──────────────────────────────────────────────── -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <!-- Skeleton -->
      <div v-if="isLoading">
        <div v-for="i in 6" :key="i" class="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
          <div class="w-9 h-9 rounded-full bg-gray-100 animate-pulse shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3 bg-gray-100 rounded animate-pulse w-1/4"></div>
            <div class="h-2.5 bg-gray-50 rounded animate-pulse w-1/3"></div>
          </div>
          <div class="h-5 w-16 bg-gray-100 rounded-full animate-pulse"></div>
          <div class="h-5 w-14 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="users.length === 0" class="py-20 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="9" r="5" stroke="#9CA3AF" stroke-width="1.8"/>
            <path d="M4 23c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="font-semibold text-gray-500">Belum ada user</p>
        <p class="text-sm text-gray-400 mt-1">Tambah user pertama untuk mulai</p>
      </div>

      <!-- Table -->
      <table v-else class="w-full">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/60">
            <th class="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
            <th class="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Kontak</th>
            <th class="text-center px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
            <th class="text-center px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
            <th class="text-right px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-gray-50/50 transition-colors group"
          >
            <!-- Avatar + Nama -->
            <td class="px-6 py-3.5">
              <div class="flex items-center gap-3">
                <div class="relative shrink-0">
                  <img
                    v-if="user.avatar_url"
                    :src="user.avatar_url"
                    class="w-9 h-9 rounded-full object-cover border border-gray-200"
                  />
                  <div
                    v-else
                    class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    :style="{ background: avatarColor(user.name) }"
                  >
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <!-- Online dot kalau aktif -->
                  <span
                    v-if="user.is_active"
                    class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"
                  ></span>
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-800">{{ user.name }}</p>
                  <p class="text-xs text-gray-400">{{ user.email }}</p>
                </div>
              </div>
            </td>

            <!-- Kontak -->
            <td class="px-6 py-3.5 hidden sm:table-cell">
              <p class="text-sm text-gray-500">{{ user.phone || '—' }}</p>
            </td>

            <!-- Role badge -->
            <td class="px-6 py-3.5 text-center">
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="roleBadgeClass(user.role)"
              >
                {{ roleLabel(user.role) }}
              </span>
            </td>

            <!-- Status toggle -->
            <td class="px-6 py-3.5 text-center">
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                :class="user.is_active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'"
                :disabled="user.id === currentUserId"
                @click="toggleStatus(user)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="user.is_active ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                {{ user.is_active ? 'Aktif' : 'Nonaktif' }}
              </button>
            </td>

            <!-- Aksi -->
            <td class="px-6 py-3.5">
              <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  title="Edit"
                  @click="openModal(user)"
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M11 2l3 3-9 9H2v-3L11 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                  </svg>
                </button>
                <button
                  class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  :disabled="user.id === currentUserId"
                  :title="user.id === currentUserId ? 'Tidak bisa hapus akun sendiri' : 'Hapus'"
                  @click="user.id !== currentUserId && confirmDelete(user)"
                >
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between">
        <p class="text-sm text-gray-500">
          Menampilkan {{ pagination.from }}–{{ pagination.to }} dari {{ pagination.total }}
        </p>
        <div class="flex items-center gap-1">
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            :disabled="pagination.current_page === 1"
            @click="changePage(pagination.current_page - 1)"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
            :class="page === pagination.current_page ? 'bg-[#117c6f] text-white' : 'text-gray-600 hover:bg-gray-100'"
            @click="changePage(page)"
          >{{ page }}</button>
          <button
            class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            :disabled="pagination.current_page === pagination.last_page"
            @click="changePage(pagination.current_page + 1)"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ── MODAL TAMBAH / EDIT ─────────────────────────────────── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showModal"
          class="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style="background: rgba(10,15,28,0.6); backdrop-filter: blur(6px);"
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
              class="bg-white w-full flex flex-col"
              style="max-width:480px; max-height:88vh; border-radius:16px; box-shadow:0 0 0 1px rgba(0,0,0,0.06),0 8px 16px rgba(0,0,0,0.08),0 24px 48px rgba(0,0,0,0.12);"
            >
              <!-- Header -->
              <div class="px-5 pt-4 pb-3.5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-2.5">
                  <div class="w-6 h-6 rounded-md bg-[#117c6f]/10 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5" r="3" stroke="#117c6f" stroke-width="1.6"/>
                      <path d="M2 13c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#117c6f" stroke-width="1.6" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <h3 class="text-sm font-bold text-gray-900">
                    {{ editingUser ? 'Edit User' : 'Tambah User Baru' }}
                  </h3>
                </div>
                <button
                  class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                  @click="closeModal"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>

              <!-- Body -->
              <div class="overflow-y-auto flex-1 px-5 py-4 space-y-3.5">

                <!-- Avatar upload -->
                <div class="flex items-center gap-4">
                  <div
                    class="relative w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#117c6f]/60 transition-colors group shrink-0"
                    @click="triggerAvatarInput"
                  >
                    <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange"/>
                    <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover"/>
                    <div v-else class="flex flex-col items-center gap-0.5">
                      <svg class="text-gray-300 group-hover:text-[#117c6f]/50 transition-colors" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
                        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                      </svg>
                    </div>
                    <!-- Hover overlay -->
                    <div v-if="avatarPreview" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <svg class="text-white" width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M11 2l3 3-9 9H2v-3L11 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-700">Foto Profil</p>
                    <p class="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WEBP — maks. 2MB</p>
                    <button
                      v-if="avatarPreview"
                      type="button"
                      class="text-[11px] font-semibold text-red-500 hover:text-red-600 mt-1 transition-colors"
                      @click="removeAvatar"
                    >Hapus foto</button>
                  </div>
                </div>

                <!-- Nama + Phone -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="fl">Nama Lengkap <span class="text-red-400">*</span></label>
                    <input v-model="form.name" type="text" placeholder="Budi Santoso" class="fi" :class="{'fi-err': errors.name}" @input="errors.name=''"/>
                    <p v-if="errors.name" class="fe">{{ errors.name }}</p>
                  </div>
                  <div>
                    <label class="fl">Nomor HP</label>
                    <input v-model="form.phone" type="tel" placeholder="08123456789" class="fi"/>
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="fl">Email <span class="text-red-400">*</span></label>
                  <input v-model="form.email" type="email" placeholder="budi@email.com" class="fi" :class="{'fi-err': errors.email}" @input="errors.email=''"/>
                  <p v-if="errors.email" class="fe">{{ errors.email }}</p>
                </div>

                <!-- Password -->
                <div>
                  <label class="fl">
                    Password
                    <span v-if="editingUser" class="text-gray-400 font-normal">(kosongkan jika tidak ingin ganti)</span>
                    <span v-else class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="Min. 8 karakter"
                      class="fi pr-9"
                      :class="{'fi-err': errors.password}"
                      @input="errors.password=''"
                    />
                    <button
                      type="button"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      @click="showPassword = !showPassword"
                    >
                      <svg v-if="!showPassword" width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" stroke-width="1.4"/>
                        <circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.4"/>
                      </svg>
                      <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M2 2l12 12M6.5 6.6A2 2 0 0010.4 10M4.2 4.3C2.8 5.3 1.7 6.7 1 8c1.3 2.7 4.2 5 7 5 1.3 0 2.5-.4 3.6-1M7 3.1C7.3 3 7.7 3 8 3c2.8 0 5.7 2.3 7 5-.4.9-1 1.7-1.7 2.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <p v-if="errors.password" class="fe">{{ errors.password }}</p>
                </div>

                <!-- Role + Status -->
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="fl">Role <span class="text-red-400">*</span></label>
                    <div class="relative">
                      <select v-model="form.role" class="fi appearance-none pr-8" :class="{'fi-err': errors.role}" @change="errors.role=''">
                        <option value="">Pilih role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="cashier">Kasir</option>
                      </select>
                      <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="11" height="11" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <p v-if="errors.role" class="fe">{{ errors.role }}</p>
                  </div>
                  <div>
                    <label class="fl">Status</label>
                    <div class="flex items-center gap-2.5 mt-2">
                      <div
                        class="relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer"
                        :class="form.is_active ? 'bg-emerald-500' : 'bg-gray-300'"
                        @click="form.is_active = !form.is_active"
                      >
                        <div
                          class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                          :class="form.is_active ? 'translate-x-4' : 'translate-x-0'"
                        ></div>
                      </div>
                      <span class="text-xs font-semibold" :class="form.is_active ? 'text-emerald-600' : 'text-gray-400'">
                        {{ form.is_active ? 'Aktif' : 'Nonaktif' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Role info box -->
                <div v-if="form.role" class="px-3 py-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
                  <p class="text-[11px] font-semibold text-blue-700 mb-0.5">{{ roleLabel(form.role) }} — Akses:</p>
                  <p class="text-[11px] text-blue-600">{{ roleDescription(form.role) }}</p>
                </div>

                <!-- Error global -->
                <div v-if="formError" class="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-2.5 rounded-lg">
                  <svg class="text-red-400 shrink-0" width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M8 5v3.5M8 11h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  <p class="text-xs text-red-600">{{ formError }}</p>
                </div>

              </div>

              <!-- Footer -->
              <div class="px-5 py-3 border-t border-gray-100 flex gap-2.5 bg-gray-50/50 rounded-b-2xl shrink-0">
                <button
                  type="button"
                  class="flex-1 py-2 border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg hover:bg-white transition-colors"
                  @click="closeModal"
                >Batal</button>
                <button
                  type="button"
                  :disabled="isSaving"
                  class="flex-1 py-2 bg-[#117c6f] text-white text-xs font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-60 transition-all flex items-center justify-center gap-1.5"
                  @click="handleSubmit"
                >
                  <svg v-if="isSaving" class="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  {{ isSaving ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Tambah User' }}
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- ── MODAL HAPUS ─────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-100 ease-in"
        leave-to-class="opacity-0"
      >
        <div
          v-if="deletingUser"
          class="fixed inset-0 z-[999] flex items-center justify-center p-4"
          style="background: rgba(10,15,28,0.6); backdrop-filter: blur(6px);"
          @click.self="deletingUser = null"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div class="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="font-bold text-base text-gray-900 mb-1">Hapus User?</h3>
            <p class="text-sm text-gray-500 mb-5">
              <span class="font-semibold text-gray-700">{{ deletingUser?.name }}</span> akan dihapus permanen.
            </p>
            <div class="flex gap-3">
              <button class="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors" @click="deletingUser = null">Batal</button>
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
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/lib/axios'
import { useAuthStore } from '@/stores/auth'

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  role: 'admin' | 'manager' | 'cashier'
  is_active: boolean
  avatar_url: string | null
}

const authStore  = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)

const isLoading   = ref(true)
const isSaving    = ref(false)
const isDeleting  = ref(false)
const showModal   = ref(false)
const users       = ref<User[]>([])
const editingUser = ref<User | null>(null)
const deletingUser= ref<User | null>(null)
const formError   = ref('')
const showPassword= ref(false)
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref<string | null>(null)
const avatarFile  = ref<File | null>(null)

const pagination = reactive({ total: 0, current_page: 1, last_page: 1, from: 0, to: 0 })
const filters    = reactive({ search: '', role: '', is_active: '' })
const errors     = reactive({ name: '', email: '', password: '', role: '' })

const form = reactive({
  name: '', email: '', password: '', phone: '',
  role: '' as string, is_active: true,
})

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function fetchUsers(page = 1) {
  isLoading.value = true
  try {
    const params: any = { page, per_page: 15 }
    if (filters.search)    params.search    = filters.search
    if (filters.role)      params.role      = filters.role
    if (filters.is_active) params.is_active = filters.is_active
    const { data } = await api.get('/auth/users', { params })
    users.value = data.data
    Object.assign(pagination, { total: data.total, current_page: data.current_page, last_page: data.last_page, from: data.from, to: data.to })
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

onMounted(fetchUsers)

let searchTimer: ReturnType<typeof setTimeout>
function debouncedFetch() { clearTimeout(searchTimer); searchTimer = setTimeout(fetchUsers, 400) }

const visiblePages = computed(() => {
  const pages = [], s = Math.max(1, pagination.current_page - 2), e = Math.min(pagination.last_page, pagination.current_page + 2)
  for (let i = s; i <= e; i++) pages.push(i)
  return pages
})
function changePage(p: number) { if (p >= 1 && p <= pagination.last_page) fetchUsers(p) }

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal(user?: User) {
  formError.value = ''; showPassword.value = false
  Object.assign(errors, { name: '', email: '', password: '', role: '' })
  avatarPreview.value = null; avatarFile.value = null

  if (user) {
    editingUser.value = user
    Object.assign(form, { name: user.name, email: user.email, password: '', phone: user.phone ?? '', role: user.role, is_active: user.is_active })
    if (user.avatar_url) avatarPreview.value = user.avatar_url
  } else {
    editingUser.value = null
    Object.assign(form, { name: '', email: '', password: '', phone: '', role: '', is_active: true })
  }
  showModal.value = true
}
function closeModal() { showModal.value = false; editingUser.value = null }

// ── Avatar ────────────────────────────────────────────────────────────────────
function triggerAvatarInput() { avatarInput.value?.click() }
function handleAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) { alert('Maksimal 2MB'); return }
  avatarFile.value = file; avatarPreview.value = URL.createObjectURL(file)
}
function removeAvatar() { avatarPreview.value = null; avatarFile.value = null; if (avatarInput.value) avatarInput.value.value = '' }

// ── Toggle status ─────────────────────────────────────────────────────────────
async function toggleStatus(user: User) {
  try {
    const fd = new FormData()
    fd.append('name', user.name); fd.append('email', user.email)
    fd.append('role', user.role); fd.append('is_active', user.is_active ? '0' : '1')
    fd.append('_method', 'PUT')
    await api.post(`/auth/users/${user.id}`, fd)
    user.is_active = !user.is_active
  } catch { alert('Gagal mengubah status.') }
}

// ── Validate ──────────────────────────────────────────────────────────────────
function validate(): boolean {
  errors.name     = form.name.trim()  ? '' : 'Nama wajib diisi'
  errors.email    = form.email.trim() ? '' : 'Email wajib diisi'
  errors.role     = form.role         ? '' : 'Role wajib dipilih'
  errors.password = (!editingUser.value && !form.password) ? 'Password wajib diisi' : ''
  return !errors.name && !errors.email && !errors.role && !errors.password
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  if (!validate()) return
  formError.value = ''; isSaving.value = true
  try {
    if (editingUser.value) {
      if (avatarFile.value) {
        const fd = new FormData()
        fd.append('name', form.name); fd.append('email', form.email)
        fd.append('role', form.role); fd.append('is_active', form.is_active ? '1' : '0')
        if (form.phone) fd.append('phone', form.phone)
        if (form.password) fd.append('password', form.password)
        fd.append('avatar', avatarFile.value)
        fd.append('_method', 'PUT')
        await api.post(`/auth/users/${editingUser.value.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await api.put(`/auth/users/${editingUser.value.id}`, {
          name: form.name,
          email: form.email,
          role: form.role,
          phone: form.phone,
          is_active: form.is_active ? 1 : 0,
          ...(form.password ? { password: form.password } : {}),
        })
      }
    } else {
      const fd = new FormData()
      fd.append('name', form.name); fd.append('email', form.email)
      fd.append('role', form.role); fd.append('is_active', form.is_active ? '1' : '0')
      if (form.phone) fd.append('phone', form.phone)
      if (form.password) fd.append('password', form.password)
      if (avatarFile.value) fd.append('avatar', avatarFile.value)
      await api.post('/auth/users', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
    closeModal(); fetchUsers(pagination.current_page)
  } catch (err: any) {
    const e = err?.response?.data?.errors
    formError.value = e ? Object.values(e).flat().join(', ') : 'Gagal menyimpan user.'
  } finally { isSaving.value = false }
}

// ── Delete ────────────────────────────────────────────────────────────────────
function confirmDelete(user: User) { deletingUser.value = user }
async function handleDelete() {
  if (!deletingUser.value) return
  isDeleting.value = true
  try {
    await api.delete(`/auth/users/${deletingUser.value.id}`)
    deletingUser.value = null; fetchUsers(pagination.current_page)
  } catch (err: any) {
    alert(err?.response?.data?.message || 'Gagal menghapus user.')
    deletingUser.value = null
  } finally { isDeleting.value = false }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function roleLabel(role: string) {
  return { admin: 'Admin', manager: 'Manager', cashier: 'Kasir' }[role] ?? role
}
function roleBadgeClass(role: string) {
  return {
    admin:   'bg-purple-50 text-purple-700',
    manager: 'bg-blue-50 text-blue-700',
    cashier: 'bg-amber-50 text-amber-700',
  }[role] ?? 'bg-gray-100 text-gray-600'
}
function roleDescription(role: string) {
  return {
    admin:   'Akses penuh ke semua fitur termasuk manajemen user dan pengaturan.',
    manager: 'Akses ke produk, transaksi, dan laporan. Tidak bisa kelola user.',
    cashier: 'Hanya bisa akses halaman kasir dan riwayat transaksi sendiri.',
  }[role] ?? ''
}

// Generate warna avatar dari nama (konsisten per nama)
function avatarColor(name: string): string {
  const colors = ['#6366f1','#8b5cf6','#ec4899','#f97316','#eab308','#10b981','#3b82f6','#14b8a6']
  let hash = 0
  for (const c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
</script>

<style scoped>
@reference "tailwindcss";

.fl { @apply block text-xs font-semibold text-gray-600 mb-1; }
.fi {
  @apply w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none
         focus:border-[#117c6f] focus:ring-2 focus:ring-[#117c6f]/10
         bg-white text-gray-800 placeholder-gray-300 transition-all duration-150;
}
.fi-err { @apply border-red-300 focus:border-red-400 focus:ring-red-100; }
.fe     { @apply text-[11px] text-red-500 mt-1; }
</style>