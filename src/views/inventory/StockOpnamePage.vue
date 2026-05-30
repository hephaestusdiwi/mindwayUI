<template>
  <div class="space-y-5">

    <!-- ── VIEW: LIST DOKUMEN ──────────────────────────────────── -->
    <template v-if="view === 'list'">

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="font-bold text-xl text-gray-900">Stok Opname</h2>
          <p class="text-sm text-gray-400 mt-0.5">Dokumen penyesuaian stok fisik</p>
        </div>
        <button
          class="flex items-center gap-2 px-4 py-2.5 bg-[#117c6f] text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
          @click="openCreateModal"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Buat Dokumen Baru
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div v-if="isLoading">
          <div v-for="i in 5" :key="i" class="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-gray-100 rounded animate-pulse w-1/4"></div>
              <div class="h-2.5 bg-gray-50 rounded animate-pulse w-1/3"></div>
            </div>
            <div class="h-6 w-20 bg-gray-100 rounded-full animate-pulse"></div>
            <div class="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        <div v-else-if="documents.length === 0" class="py-20 text-center">
          <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 4h16v20H6zM10 4V2h8v2M10 12h8M10 16h5" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p class="font-semibold text-gray-500">Belum ada dokumen opname</p>
          <p class="text-sm text-gray-400 mt-1">Klik "Buat Dokumen Baru" untuk memulai</p>
        </div>

        <table v-else class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/60">
              <th class="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">No. Dokumen</th>
              <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Item</th>
              <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Dibuat Oleh</th>
              <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Catatan</th>
              <th class="text-right px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
              <th class="px-4 py-3.5"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="doc in documents"
              :key="doc.id"
              class="hover:bg-gray-50/50 transition-colors group cursor-pointer"
              @click="openDocument(doc)"
            >
              <td class="px-6 py-3.5">
                <p class="text-sm font-bold text-gray-800 font-mono">{{ doc.document_number }}</p>
              </td>
              <td class="px-4 py-3.5 text-center">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="doc.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="doc.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                  {{ doc.status === 'confirmed' ? 'Dikonfirmasi' : 'Draft' }}
                </span>
              </td>
              <td class="px-4 py-3.5 text-center hidden sm:table-cell">
                <span class="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">{{ doc.items_count }} item</span>
              </td>
              <td class="px-4 py-3.5 hidden md:table-cell">
                <p class="text-xs text-gray-500">{{ doc.created_by?.name ?? '—' }}</p>
              </td>
              <td class="px-4 py-3.5 hidden lg:table-cell">
                <p class="text-xs text-gray-400 truncate max-w-[160px]">{{ doc.notes || '—' }}</p>
              </td>
              <td class="px-6 py-3.5 text-right">
                <p class="text-xs font-semibold text-gray-700">{{ formatDate(doc.created_at) }}</p>
                <p class="text-[10px] text-gray-400">{{ formatTime(doc.created_at) }}</p>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    v-if="doc.status === 'draft'"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    @click.stop="confirmDelete(doc)"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M5 4V2h6v2M6 7v5M10 7v5M3 4l1 10h8L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="pagination.last_page > 1" class="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <p class="text-sm text-gray-500">{{ pagination.from }}–{{ pagination.to }} dari {{ pagination.total }}</p>
          <div class="flex items-center gap-1">
            <button class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors" :disabled="pagination.current_page === 1" @click="changePage(pagination.current_page - 1)">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button v-for="page in visiblePages" :key="page" class="w-8 h-8 rounded-lg text-sm font-medium transition-colors" :class="page === pagination.current_page ? 'bg-[#117c6f] text-white' : 'text-gray-600 hover:bg-gray-100'" @click="changePage(page)">{{ page }}</button>
            <button class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors" :disabled="pagination.current_page === pagination.last_page" @click="changePage(pagination.current_page + 1)">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- ── VIEW: DETAIL DOKUMEN ────────────────────────────────── -->
    <template v-else-if="view === 'detail' && currentDoc">

      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div class="flex items-start gap-3">
          <button
            class="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shrink-0 mt-0.5"
            @click="view = 'list'; fetchDocuments()"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div>
            <div class="flex items-center gap-2.5 flex-wrap">
              <h2 class="font-bold text-xl text-gray-900 font-mono">{{ currentDoc.document_number }}</h2>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="currentDoc.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="currentDoc.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                {{ currentDoc.status === 'confirmed' ? 'Dikonfirmasi' : 'Draft' }}
              </span>
            </div>
            <p class="text-sm text-gray-400 mt-0.5">
              Dibuat {{ formatDate(currentDoc.created_at) }} oleh {{ currentDoc.created_by?.name ?? '—' }}
              <span v-if="currentDoc.status === 'confirmed' && currentDoc.confirmed_at">
                · Dikonfirmasi {{ formatDate(currentDoc.confirmed_at) }} oleh {{ currentDoc.confirmed_by?.name ?? '—' }}
              </span>
            </p>
          </div>
        </div>

        <div v-if="currentDoc.status === 'draft'" class="flex items-center gap-3 shrink-0">
          <div class="text-right">
            <p class="text-xs text-gray-400">{{ filledCount }} / {{ currentDoc.items?.length ?? 0 }} diisi</p>
            <div class="w-32 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div class="h-full bg-[#117c6f] rounded-full transition-all duration-300" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-[#117c6f] text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="filledCount === 0 || isConfirming"
            @click="handleConfirm"
          >
            <svg v-if="isConfirming" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <svg v-else width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ isConfirming ? 'Mengkonfirmasi...' : 'Konfirmasi Opname' }}
          </button>
        </div>

        <div v-else class="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl shrink-0">
          <svg class="text-emerald-500" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm font-semibold text-emerald-700">Stok sudah diperbarui</span>
        </div>
      </div>

      <div v-if="currentDoc.notes" class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
        <svg class="text-blue-400 shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 7v5M8 5h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p class="text-xs text-blue-700">{{ currentDoc.notes }}</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div v-if="isLoadingDetail">
          <div v-for="i in 6" :key="i" class="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
            <div class="w-8 h-8 bg-gray-100 rounded-lg animate-pulse shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-gray-100 rounded animate-pulse w-1/3"></div>
              <div class="h-2.5 bg-gray-50 rounded animate-pulse w-1/4"></div>
            </div>
            <div class="h-3 w-12 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-8 w-20 bg-gray-100 rounded-lg animate-pulse"></div>
            <div class="h-5 w-12 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>

        <table v-else class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/60">
              <th class="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Produk</th>
              <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stok Sistem</th>
              <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Stok Aktual</th>
              <th class="text-center px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Selisih</th>
              <th class="text-left px-4 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Catatan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="item in currentDoc.items" :key="item.id" class="hover:bg-gray-50/30 transition-colors">
              <td class="px-6 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden border border-gray-100 shrink-0">
                    <img v-if="item.product?.image_url" :src="item.product.image_url" class="w-full h-full object-cover"/>
                    <div v-else class="w-full h-full flex items-center justify-center text-[9px] font-bold text-gray-300">{{ item.product?.name?.charAt(0) }}</div>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ item.product?.name }}</p>
                    <p class="text-xs text-gray-400 font-mono">{{ item.product?.sku || '—' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="text-sm font-bold text-gray-600">{{ item.quantity_system }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <input
                  v-if="currentDoc.status === 'draft'"
                  v-model.number="item.quantity_actual"
                  type="number"
                  min="0"
                  :placeholder="String(item.quantity_system)"
                  class="w-20 text-center text-sm font-bold border rounded-lg py-1.5 outline-none transition-all"
                  :class="
                    item.quantity_actual !== null && item.quantity_actual !== item.quantity_system
                      ? 'border-[#117c6f] bg-teal-50 text-[#117c6f] focus:ring-2 focus:ring-[#117c6f]/20'
                      : 'border-gray-200 bg-white text-gray-700 focus:border-[#117c6f] focus:ring-1 focus:ring-[#117c6f]/20'
                  "
                  @change="autoSaveItem(item)"
                />
                <span v-else class="text-sm font-bold text-gray-800">{{ item.quantity_actual ?? '—' }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <span
                  v-if="item.quantity_actual !== null"
                  class="text-sm font-bold px-2 py-1 rounded-lg"
                  :class="
                    (item.quantity_actual - item.quantity_system) > 0 ? 'bg-emerald-100 text-emerald-600' :
                    (item.quantity_actual - item.quantity_system) < 0 ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-500'
                  "
                >
                  {{ (item.quantity_actual - item.quantity_system) > 0 ? '+' : '' }}{{ item.quantity_actual - item.quantity_system }}
                </span>
                <span v-else class="text-xs text-gray-300">—</span>
              </td>
              <td class="px-4 py-3">
                <input
                  v-if="currentDoc.status === 'draft'"
                  v-model="item.notes"
                  type="text"
                  placeholder="Catatan..."
                  class="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-[#117c6f] transition-all"
                  @change="autoSaveItem(item)"
                />
                <span v-else class="text-xs text-gray-500">{{ item.notes || '—' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- ── MODAL BUAT DOKUMEN ──────────────────────────────────── -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-200 ease-out" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-150 ease-in" leave-to-class="opacity-0">
        <div v-if="showCreateModal" class="fixed inset-0 z-[999] flex items-center justify-center p-4" style="background: rgba(10,15,28,0.6); backdrop-filter: blur(6px);" @click.self="showCreateModal = false">
          <div class="bg-white w-full max-w-md rounded-2xl overflow-hidden" style="box-shadow: 0 24px 64px rgba(0,0,0,0.15);">
            <div class="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold text-[#117c6f] uppercase tracking-widest mb-0.5">Dokumen Baru</p>
                <h3 class="text-base font-bold text-gray-900">Buat Stok Opname</h3>
              </div>
              <button class="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-all" @click="showCreateModal = false">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              </button>
            </div>
            <div class="px-6 py-4 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Filter Kategori <span class="text-gray-400 font-normal">(opsional)</span></label>
                <div class="relative">
                  <select v-model="createForm.category_id" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all bg-white appearance-none pr-9">
                    <option value="">Semua Kategori</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                  <svg class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1.5">Catatan <span class="text-gray-400 font-normal">(opsional)</span></label>
                <textarea v-model="createForm.notes" rows="2" placeholder="Misal: Opname bulanan Maret 2026" class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#117c6f] transition-all resize-none"></textarea>
              </div>
              <div class="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <p class="text-xs text-blue-700">Sistem akan otomatis memuat semua produk aktif beserta stok sistem saat ini sebagai acuan.</p>
              </div>
            </div>
            <div class="px-6 py-4 border-t border-gray-100 flex gap-3 bg-gray-50/50">
              <button class="flex-1 py-2.5 border border-gray-200 text-xs font-semibold text-gray-600 rounded-xl hover:bg-white transition-colors" @click="showCreateModal = false">Batal</button>
              <button class="flex-1 py-2.5 bg-[#117c6f] text-white text-xs font-semibold rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60" :disabled="isCreating" @click="handleCreate">
                <svg v-if="isCreating" class="animate-spin w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                {{ isCreating ? 'Membuat...' : 'Buat Dokumen' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── MODAL HAPUS ─────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition enter-active-class="transition-opacity duration-150 ease-out" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-100 ease-in" leave-to-class="opacity-0">
        <div v-if="deletingDoc" class="fixed inset-0 z-[999] flex items-center justify-center p-4" style="background: rgba(10,15,28,0.6); backdrop-filter: blur(6px);" @click.self="deletingDoc = null">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div class="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#EF4444" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3 class="font-bold text-base text-gray-900 mb-1">Hapus Dokumen?</h3>
            <p class="text-sm text-gray-500 mb-5">Dokumen <span class="font-semibold font-mono text-gray-700">{{ deletingDoc?.document_number }}</span> akan dihapus permanen.</p>
            <div class="flex gap-3">
              <button class="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 transition-colors" @click="deletingDoc = null">Batal</button>
              <button class="flex-1 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center gap-2" :disabled="isDeleting" @click="handleDelete">
                <svg v-if="isDeleting" class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/></svg>
                {{ isDeleting ? 'Menghapus...' : 'Ya, Hapus' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ── TOAST ───────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 translate-y-2" leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 translate-y-1">
        <div v-if="showToast" class="fixed bottom-6 right-6 z-[999] flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl">
          <div class="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1 6l3.5 3.5L11 2" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <p class="text-sm font-semibold">{{ toastMessage }}</p>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/lib/axios'

interface Category { id: number; name: string }
interface OpnameItem {
  id: number
  product_id: number
  quantity_system: number
  quantity_actual: number | null
  notes: string | null
  product: { id: number; name: string; sku: string | null; image_url: string | null } | null
}
interface OpnameDocument {
  id: number
  document_number: string
  status: 'draft' | 'confirmed'
  notes: string | null
  created_at: string
  confirmed_at: string | null
  items_count?: number
  items?: OpnameItem[]
  created_by?: { id: number; name: string }
  confirmed_by?: { id: number; name: string }
}

const view            = ref<'list' | 'detail'>('list')
const isLoading       = ref(true)
const isLoadingDetail = ref(false)
const isCreating      = ref(false)
const isConfirming    = ref(false)
const isDeleting      = ref(false)
const showCreateModal = ref(false)
const showToast       = ref(false)
const toastMessage    = ref('')
const documents       = ref<OpnameDocument[]>([])
const currentDoc      = ref<OpnameDocument | null>(null)
const deletingDoc     = ref<OpnameDocument | null>(null)
const categories      = ref<Category[]>([])

const pagination = reactive({ total: 0, current_page: 1, last_page: 1, from: 0, to: 0 })
const createForm = reactive({ notes: '', category_id: '' })

const visiblePages = computed(() => {
  const pages = [], s = Math.max(1, pagination.current_page - 2), e = Math.min(pagination.last_page, pagination.current_page + 2)
  for (let i = s; i <= e; i++) pages.push(i)
  return pages
})

const filledCount = computed(() =>
  currentDoc.value?.items?.filter(i => i.quantity_actual !== null).length ?? 0
)

const progressPercent = computed(() => {
  const total = currentDoc.value?.items?.length ?? 0
  return total > 0 ? Math.round((filledCount.value / total) * 100) : 0
})

async function fetchDocuments(page = 1) {
  isLoading.value = true
  try {
    const { data } = await api.get('/auth/inventory/opname', { params: { page, per_page: 15 } })
    documents.value = data.data
    Object.assign(pagination, { total: data.total, current_page: data.current_page, last_page: data.last_page, from: data.from, to: data.to })
  } catch (e) { console.error(e) }
  finally { isLoading.value = false }
}

async function fetchCategories() {
  try {
    const { data } = await api.get('/auth/categories')
    categories.value = data.data ?? data
  } catch (e) { console.error(e) }
}

onMounted(() => { fetchDocuments(); fetchCategories() })
function changePage(p: number) { if (p >= 1 && p <= pagination.last_page) fetchDocuments(p) }

async function openDocument(doc: OpnameDocument) {
  view.value = 'detail'
  isLoadingDetail.value = true
  currentDoc.value = doc
  try {
    const { data } = await api.get(`/auth/inventory/opname/${doc.id}`)
    currentDoc.value = data
  } catch (e) { console.error(e) }
  finally { isLoadingDetail.value = false }
}

function openCreateModal() {
  Object.assign(createForm, { notes: '', category_id: '' })
  showCreateModal.value = true
}

async function handleCreate() {
  isCreating.value = true
  try {
    const { data } = await api.post('/auth/inventory/opname', {
      notes:       createForm.notes || null,
      category_id: createForm.category_id || null,
    })
    showCreateModal.value = false
    await openDocument(data)
  } catch (e: any) {
    alert(e?.response?.data?.message ?? 'Gagal membuat dokumen.')
  } finally {
    isCreating.value = false
  }
}

let saveTimer: ReturnType<typeof setTimeout>
function autoSaveItem(item: OpnameItem) {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    if (!currentDoc.value) return
    try {
      await api.put(`/auth/inventory/opname/${currentDoc.value.id}/items`, {
        items: [{ id: item.id, quantity_actual: item.quantity_actual, notes: item.notes }],
      })
    } catch (e) { console.error(e) }
  }, 600)
}

async function handleConfirm() {
  if (!currentDoc.value) return
  isConfirming.value = true
  try {
    const { data } = await api.post(`/auth/inventory/opname/${currentDoc.value.id}/confirm`)
    currentDoc.value = { ...currentDoc.value, ...data.data, items: currentDoc.value.items }
    toast('Stok opname berhasil dikonfirmasi! Stok produk telah diperbarui.')
  } catch (e: any) {
    alert(e?.response?.data?.message ?? 'Gagal mengkonfirmasi.')
  } finally {
    isConfirming.value = false
  }
}

function confirmDelete(doc: OpnameDocument) { deletingDoc.value = doc }
async function handleDelete() {
  if (!deletingDoc.value) return
  isDeleting.value = true
  try {
    await api.delete(`/auth/inventory/opname/${deletingDoc.value.id}`)
    deletingDoc.value = null
    fetchDocuments()
  } catch (e: any) {
    alert(e?.response?.data?.message ?? 'Gagal menghapus.')
    deletingDoc.value = null
  } finally {
    isDeleting.value = false
  }
}

function toast(msg: string) {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 3500)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
@reference "tailwindcss";
</style>