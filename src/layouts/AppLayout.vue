<template>
  <div class="flex h-screen bg-gray-50 font-body overflow-hidden">

    <!-- ── SIDEBAR ─────────────────────────────────────────────── -->
    <aside
      class="flex flex-col bg-[#117c6f] transition-all duration-300 ease-in-out flex-shrink-0"
      :class="sidebarCollapsed ? 'w-[68px]' : 'w-[220px]'"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-white/10 min-h-[64px]">
        <div class="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center flex-shrink-0">
          <img
            src="https://jarvis.wetions.com/assets/img/lgo.png"
            style="width:18px; height:18px;"
            alt="logo"
          />
        </div>
        <Transition name="fade-text">
          <span
            v-if="!sidebarCollapsed"
            class="text-white font-display font-bold text-base tracking-tight whitespace-nowrap"
          >
            mindwayPOS
          </span>
        </Transition>
      </div>

      <!-- Nav menu -->
      <nav class="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
        <template v-for="item in filteredMenuItems" :key="item.name">

          <!-- ── Group item (accordion) ── -->
          <div v-if="item.children">

            <!-- Group trigger -->
            <button
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative"
              :class="
                isGroupActive(item)
                  ? 'bg-white/15 text-white'
                  : 'text-white/55 hover:text-white hover:bg-white/10'
              "
              @click="toggleGroup(item.name)"
            >
              <div
                v-if="isGroupActive(item)"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
              ></div>

              <component :is="item.icon" class="flex-shrink-0 w-5 h-5"/>

              <Transition name="fade-text">
                <span v-if="!sidebarCollapsed" class="text-sm font-medium whitespace-nowrap flex-1 text-left">
                  {{ item.label }}
                </span>
              </Transition>

              <!-- Badge alert (misal stok minimum) -->
              <Transition name="fade-text">
                <span
                  v-if="!sidebarCollapsed && item.badge && item.badge > 0"
                  class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white leading-none"
                >
                  {{ item.badge }}
                </span>
              </Transition>

              <!-- Chevron -->
              <Transition name="fade-text">
                <svg
                  v-if="!sidebarCollapsed"
                  class="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
                  :class="openGroups.includes(item.name) ? 'rotate-180' : ''"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </Transition>

              <!-- Tooltip saat collapsed -->
              <div
                v-if="sidebarCollapsed"
                class="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg"
              >
                {{ item.label }}
              </div>
            </button>

            <!-- Children (accordion) -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              leave-active-class="transition-all duration-150 ease-in"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div
                v-if="openGroups.includes(item.name) && !sidebarCollapsed"
                class="mt-0.5 ml-3 pl-3 border-l border-white/15 space-y-0.5"
              >
                <router-link
                  v-for="child in item.children"
                  :key="child.name"
                  :to="child.to"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-150 group/child relative"
                  :class="
                    isActive(child.to)
                      ? 'bg-white/15 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/10'
                  "
                >
                  <div
                    v-if="isActive(child.to)"
                    class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white/70 rounded-r-full"
                  ></div>
                  <component :is="child.icon" class="flex-shrink-0 w-4 h-4"/>
                  <span class="text-xs font-medium whitespace-nowrap flex-1">{{ child.label }}</span>
                  <!-- Badge per child item -->
                  <span
                    v-if="child.badge && child.badge > 0"
                    class="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white leading-none"
                  >
                    {{ child.badge }}
                  </span>
                </router-link>
              </div>
            </Transition>

            <!-- Collapsed: popup children on hover -->
            <div
              v-if="sidebarCollapsed"
              class="absolute left-full ml-2 top-0 bg-gray-900 rounded-xl py-2 min-w-[160px] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50 shadow-xl"
            >
              <p class="px-3 py-1 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{{ item.label }}</p>
              <router-link
                v-for="child in item.children"
                :key="child.name"
                :to="child.to"
                class="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <component :is="child.icon" class="w-3.5 h-3.5"/>
                {{ child.label }}
              </router-link>
            </div>

          </div>

          <!-- ── Single item ── -->
          <router-link
            v-else
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative"
            :class="
              isActive(item.to)
                ? 'bg-white/15 text-white'
                : 'text-white/55 hover:text-white hover:bg-white/10'
            "
          >
            <div
              v-if="isActive(item.to)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"
            ></div>

            <component :is="item.icon" class="flex-shrink-0 w-5 h-5"/>

            <Transition name="fade-text">
              <span v-if="!sidebarCollapsed" class="text-sm font-medium whitespace-nowrap">
                {{ item.label }}
              </span>
            </Transition>

            <!-- Tooltip saat collapsed -->
            <div
              v-if="sidebarCollapsed"
              class="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg"
            >
              {{ item.label }}
            </div>
          </router-link>

        </template>
      </nav>

      <!-- Bottom: user + collapse -->
      <div class="border-t border-white/10 p-2 space-y-1">
        <div class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors">
          <div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style="background:linear-gradient(135deg,#34d399,#0d9488);">
            <img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url" class="w-full h-full object-cover" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <Transition name="fade-text">
            <div v-if="!sidebarCollapsed" class="flex-1 min-w-0">
              <p class="text-white text-xs font-semibold truncate">{{ authStore.user?.name ?? 'User' }}</p>
              <p class="text-white/40 text-[11px] truncate">{{ authStore.user?.email ?? '' }}</p>
            </div>
          </Transition>
        </div>

        <button
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150"
          @click="sidebarCollapsed = !sidebarCollapsed"
        >
          <svg
            class="w-4 h-4 transition-transform duration-300"
            :class="sidebarCollapsed ? 'rotate-180' : ''"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M10 4L6 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <Transition name="fade-text">
            <span v-if="!sidebarCollapsed" class="text-xs whitespace-nowrap">Ciutkan</span>
          </Transition>
        </button>
      </div>
    </aside>

    <!-- ── MAIN AREA ───────────────────────────────────────────── -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top navbar -->
      <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <h1 class="font-display font-bold text-gray-900 text-lg leading-tight">{{ currentPageTitle }}</h1>
          <p class="text-gray-400 text-xs">{{ currentDate }}</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Bell dengan badge stok alert -->
          <button
            class="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors border border-gray-200"
            @click="$router.push('/inventory/stock-alert')"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5a4.5 4.5 0 00-4.5 4.5v2L2 10h12l-1.5-2V6A4.5 4.5 0 008 1.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
              <path d="M6.5 10.5a1.5 1.5 0 003 0" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
            <span
              v-if="stockAlertCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[9px] font-bold flex items-center justify-center leading-none"
            >
              {{ stockAlertCount > 9 ? '9+' : stockAlertCount }}
            </span>
          </button>

          <div class="w-px h-6 bg-gray-200"></div>

          <!-- User dropdown -->
          <div class="relative">
            <button
              class="flex items-center gap-2.5 py-1.5 px-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
              @click="showUserMenu = !showUserMenu"
            >
              <div class="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-white text-xs font-bold"
                style="background:linear-gradient(135deg,#34d399,#0d9488);">
                <img v-if="authStore.user?.avatar_url" :src="authStore.user.avatar_url" class="w-full h-full object-cover" />
                <span v-else>{{ userInitial }}</span>
              </div>
              <span class="text-sm font-semibold text-gray-700 hidden sm:block">{{ authStore.user?.name ?? 'User' }}</span>
              <svg
                class="w-3.5 h-3.5 text-gray-400 transition-transform"
                :class="showUserMenu ? 'rotate-180' : ''"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 scale-95 -translate-y-1"
              leave-active-class="transition duration-100 ease-in"
              leave-to-class="opacity-0 scale-95 -translate-y-1"
            >
              <div v-if="showUserMenu" class="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                <div class="px-4 py-2.5 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900">{{ authStore.user?.name }}</p>
                  <p class="text-xs text-gray-400 truncate">{{ authStore.user?.email }}</p>
                </div>
                <div class="py-1">
                  <button class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.4"/>
                      <path d="M2 13c0-2.8 2.7-5 6-5s6 2.2 6 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                    </svg>
                    Profil Saya
                  </button>
                  <button class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="2.5" stroke="currentColor" stroke-width="1.4"/>
                      <path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
                    </svg>
                    Pengaturan
                  </button>
                </div>
                <div class="border-t border-gray-100 py-1">
                  <button
                    class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    @click="handleLogout"
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l4-4-4-4M14 8H6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Keluar
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useStockAlertStore } from '@/stores/stockAlert'

const router         = useRouter()
const route          = useRoute()
const authStore      = useAuthStore()
const stockAlertStore = useStockAlertStore()

const sidebarCollapsed = ref(false)
const showUserMenu     = ref(false)
const openGroups       = ref<string[]>([])

// Fetch alert count saat mount, refresh tiap 5 menit
onMounted(() => {
  if (['admin', 'manager'].includes(userRole.value)) {
    stockAlertStore.fetchAlertCount()
    setInterval(() => stockAlertStore.fetchAlertCount(), 5 * 60 * 1000)
  }
})

const stockAlertCount = computed(() => stockAlertStore.alertCount)

// ── Icon components ───────────────────────────────────────────────────────────
const IconDashboard   = defineComponent({ render: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none' }, [h('rect', { x: 2, y: 2, width: 7, height: 7, rx: 1.5, stroke: 'currentColor', 'stroke-width': 1.5 }), h('rect', { x: 11, y: 2, width: 7, height: 7, rx: 1.5, stroke: 'currentColor', 'stroke-width': 1.5 }), h('rect', { x: 2, y: 11, width: 7, height: 7, rx: 1.5, stroke: 'currentColor', 'stroke-width': 1.5 }), h('rect', { x: 11, y: 11, width: 7, height: 7, rx: 1.5, stroke: 'currentColor', 'stroke-width': 1.5 })]) })
const IconPOS         = defineComponent({ render: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none' }, [h('rect', { x: 2, y: 4, width: 16, height: 12, rx: 2, stroke: 'currentColor', 'stroke-width': 1.5 }), h('path', { d: 'M6 9h2M10 9h2M6 12h2M10 12h2M14 9v3', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round' }), h('path', { d: 'M2 7h16', stroke: 'currentColor', 'stroke-width': 1.5 })]) })
const IconProduct     = defineComponent({ render: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none' }, [h('path', { d: 'M3 5l7-3 7 3v8l-7 4-7-4V5z', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }), h('path', { d: 'M10 2v14M3 5l7 4 7-4', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round' })]) })
const IconTransaction = defineComponent({ render: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none' }, [h('path', { d: 'M4 6h12M4 10h8M4 14h5', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round' }), h('path', { d: 'M14 12l3 3-3 3', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]) })
const IconReport      = defineComponent({ render: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none' }, [h('path', { d: 'M4 14l4-4 3 3 5-6', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), h('rect', { x: 2, y: 2, width: 16, height: 16, rx: 2, stroke: 'currentColor', 'stroke-width': 1.5 })]) })
const IconSettings    = defineComponent({ render: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none' }, [h('circle', { cx: 10, cy: 10, r: 2.5, stroke: 'currentColor', 'stroke-width': 1.5 }), h('path', { d: 'M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round' })]) })

// Group icons
const IconInventory  = defineComponent({ render: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none' }, [h('path', { d: 'M2 6l8-4 8 4v8l-8 4-8-4V6z', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }), h('path', { d: 'M2 6l8 4 8-4M10 10v8', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round' })]) })
const IconMasterData = defineComponent({ render: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none' }, [h('path', { d: 'M3 5h14M3 10h14M3 15h8', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round' })]) })
const IconPurchasing = defineComponent({ render: () => h('svg', { width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none' }, [h('path', { d: 'M3 3h2l2.5 9h9l1.5-6H7', stroke: 'currentColor', 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), h('circle', { cx: 9, cy: 16.5, r: 1.5, stroke: 'currentColor', 'stroke-width': 1.5 }), h('circle', { cx: 15, cy: 16.5, r: 1.5, stroke: 'currentColor', 'stroke-width': 1.5 })]) })

// Child icons
const IconStockOpname   = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('path', { d: 'M2 4h12M2 8h8M2 12h5', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round' }), h('path', { d: 'M11 10l2 2 3-3', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]) })
const IconMutasiStok    = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('path', { d: 'M2 8h12M10 4l4 4-4 4', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]) })
const IconAdjustment    = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('path', { d: 'M8 2v12M4 6l4-4 4 4M4 10l4 4 4-4', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]) })
const IconKartuStok     = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('rect', { x: 2, y: 2, width: 12, height: 12, rx: 1.5, stroke: 'currentColor', 'stroke-width': 1.4 }), h('path', { d: 'M5 5h6M5 8h6M5 11h3', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round' })]) })
const IconStockAlert    = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('path', { d: 'M8 2L1 13h14L8 2z', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }), h('path', { d: 'M8 6v4M8 11.5v.5', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round' })]) })
const IconCategory      = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('rect', { x: 1, y: 1, width: 6, height: 6, rx: 1, stroke: 'currentColor', 'stroke-width': 1.4 }), h('rect', { x: 9, y: 1, width: 6, height: 6, rx: 1, stroke: 'currentColor', 'stroke-width': 1.4 }), h('rect', { x: 1, y: 9, width: 6, height: 6, rx: 1, stroke: 'currentColor', 'stroke-width': 1.4 }), h('rect', { x: 9, y: 9, width: 6, height: 6, rx: 1, stroke: 'currentColor', 'stroke-width': 1.4 })]) })
const IconUsers         = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('circle', { cx: 6, cy: 5, r: 2.5, stroke: 'currentColor', 'stroke-width': 1.4 }), h('path', { d: 'M1 13c0-2.8 2.2-5 5-5s5 2.2 5 5', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round' }), h('path', { d: 'M12 7c1.4 0 2.5 1.1 2.5 2.5M14 13c0-1.8-.8-3.3-2-4.2', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round' })]) })
const IconSupplier      = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('path', { d: 'M1 4h10v7H1zM11 6l3 1.5V11h-3', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }), h('circle', { cx: 4, cy: 12, r: 1.5, stroke: 'currentColor', 'stroke-width': 1.4 }), h('circle', { cx: 11, cy: 12, r: 1.5, stroke: 'currentColor', 'stroke-width': 1.4 })]) })
const IconPO            = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('rect', { x: 2, y: 1, width: 10, height: 13, rx: 1.5, stroke: 'currentColor', 'stroke-width': 1.4 }), h('path', { d: 'M5 5h5M5 8h5M5 11h3', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round' }), h('path', { d: 'M12 5h2v9l-2-1-2 1V5h2', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linejoin': 'round' })]) })
const IconGRN           = defineComponent({ render: () => h('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' }, [h('path', { d: 'M2 5l6-3 6 3v6l-6 3-6-3V5z', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linejoin': 'round' }), h('path', { d: 'M8 2v10M2 5l6 3 6-3', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round' }), h('path', { d: 'M5 10l2 2 4-4', stroke: 'currentColor', 'stroke-width': 1.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })]) })

// ── Menu structure ────────────────────────────────────────────────────────────
const menuItems = computed(() => [
  { name: 'dashboard',    label: 'Dashboard',  to: '/dashboard',    icon: IconDashboard   },
  { name: 'pos',          label: 'Kasir',       to: '/',             icon: IconPOS         },
  { name: 'products',     label: 'Produk',      to: '/products',     icon: IconProduct     },
  { name: 'transactions', label: 'Transaksi',   to: '/transactions', icon: IconTransaction },
  {
    name: 'inventory', label: 'Inventori', icon: IconInventory,
    allowedRoles: ['admin', 'manager'],
    children: [
      { name: 'stock-opname',  label: 'Stok Opname',      to: '/inventory/stock-opname',  icon: IconStockOpname },
      { name: 'mutations',     label: 'Mutasi Stok',       to: '/inventory/mutations',     icon: IconMutasiStok  },
      { name: 'adjustments',   label: 'Penyesuaian Stok',  to: '/inventory/adjustments',   icon: IconAdjustment  },
      { name: 'stock-ledger',  label: 'Kartu Stok',        to: '/inventory/stock-ledger',  icon: IconKartuStok   },
      {
        name: 'stock-alert', label: 'Peringatan Stok',
        to: '/inventory/stock-alert', icon: IconStockAlert,
        badge: stockAlertCount.value,
      },
    ],
  },
  {
    name: 'purchasing', label: 'Pembelian', icon: IconPurchasing,
    allowedRoles: ['admin', 'manager'],
    children: [
      { name: 'suppliers',       label: 'Supplier',            to: '/purchasing/suppliers',       icon: IconSupplier },
      { name: 'purchase-orders', label: 'Purchase Order',      to: '/purchasing/purchase-orders', icon: IconPO       },
      { name: 'goods-receipts',  label: 'Penerimaan Barang',   to: '/purchasing/goods-receipts',  icon: IconGRN      },
    ],
  },
  {
    name: 'master-data', label: 'Master Data', icon: IconMasterData,
    allowedRoles: ['admin', 'manager'],
    children: [
      { name: 'categories', label: 'Kategori', to: '/master-data/categories', icon: IconCategory },
      { name: 'users',      label: 'Karyawan', to: '/master-data/users',      icon: IconUsers    },
    ],
  },
  { name: 'reports',  label: 'Laporan',    to: '/reports',  icon: IconReport,  allowedRoles: ['admin', 'manager'] },
  {
    name: 'settings',
    label: 'Pengaturan',
    icon: IconSettings,
    children: [
      {
        name: 'outlets',
        label: 'Outlet',
        to: '/settings/outlets',
        icon: IconSettings
      }
    ]
  }
])

// ── Computed ──────────────────────────────────────────────────────────────────
const userRole    = computed(() => (authStore.user as any)?.role ?? 'cashier')
const userInitial = computed(() => (authStore.user?.name ?? 'U').charAt(0).toUpperCase())

const currentDate = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
)

const currentPageTitle = computed(() => {
  for (const item of menuItems.value) {
    if (item.children) {
      const child = item.children.find((c: any) => route.path.startsWith(c.to))
      if (child) return child.label
    } else {
      if (item.to === '/' ? route.path === '/' : route.path.startsWith(item.to!))
        return item.label
    }
  }
  return 'mindwayPOS'
})

const filteredMenuItems = computed(() =>
  menuItems.value.filter((item: any) => {
    if (!item.allowedRoles) return true
    return item.allowedRoles.includes(userRole.value)
  })
)

// ── Helpers ───────────────────────────────────────────────────────────────────
function isActive(to: string) {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

function isGroupActive(item: any) {
  if (!item.children) return false
  return item.children.some((c: any) => route.path.startsWith(c.to))
}

function toggleGroup(name: string) {
  if (sidebarCollapsed.value) return
  const idx = openGroups.value.indexOf(name)
  if (idx >= 0) openGroups.value.splice(idx, 1)
  else openGroups.value.push(name)
}

function autoOpenActiveGroup() {
  for (const item of menuItems.value) {
    if (item.children) {
      const isChildActive = item.children.some((c: any) => route.path.startsWith(c.to))
      if (isChildActive && !openGroups.value.includes(item.name)) {
        openGroups.value.push(item.name)
      }
    }
  }
}
autoOpenActiveGroup()

// ── Logout ────────────────────────────────────────────────────────────────────
async function handleLogout() {
  showUserMenu.value = false
  await authStore.logout()
  router.push({ name: 'Login' })
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-body, .font-display {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.fade-text-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.fade-text-leave-active { transition: opacity 0.1s ease; }
.fade-text-enter-from   { opacity: 0; transform: translateX(-4px); }
.fade-text-leave-to     { opacity: 0; }
</style>