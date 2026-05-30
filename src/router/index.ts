import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
    roles?: string[]
  }
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // ── Existing routes ────────────────────────────────────────────────
      { path: '',             name: 'pos',          component: () => import('../views/PosPage.vue') },
      { path: 'dashboard',   name: 'Dashboard',    component: () => import('../views/DashboardPage.vue') },
      { path: 'products',    name: 'Products',     component: () => import('../views/ProductsPage.vue') },
      { path: 'transactions',name: 'transactions', component: () => import('../views/TransactionsPage.vue') },
      { path: 'settings',    name: 'Settings',     component: () => import('../views/SettingsPage.vue') },
      { path: 'reports',     name: 'reports',      component: () => import('../views/ReportsPage.vue') },
      {
        path: 'master-data/categories',
        name: 'Categories',
        component: () => import('../views/master-data/CategoriesPage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },
      {
        path: 'master-data/users',
        name: 'Users',
        component: () => import('../views/master-data/UserPage.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
      {
        path: 'inventory/stock-opname',
        name: 'StockOpname',
        component: () => import('../views/inventory/StockOpnamePage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },
      {
        path: 'inventory/mutations',
        name: 'StockMutations',
        component: () => import('../views/inventory/MutationsPage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },

      // ── Phase 2: Inventory tambahan ────────────────────────────────────
      {
        path: 'inventory/adjustments',
        name: 'StockAdjustments',
        component: () => import('../views/inventory/StockAdjustmentPage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },
      {
        path: 'inventory/adjustments/create',
        name: 'StockAdjustmentCreate',
        component: () => import('../views/inventory/StockAdjustmentFormPage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },
      {
        path: 'inventory/stock-ledger',
        name: 'StockLedger',
        component: () => import('../views/inventory/StockLedgerPage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },
      {
        path: 'inventory/stock-alert',
        name: 'StockAlert',
        component: () => import('../views/inventory/StockAlertPage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },

      // ── Phase 2: Pembelian ─────────────────────────────────────────────
      {
        path: 'purchasing/suppliers',
        name: 'Suppliers',
        component: () => import('../views/purchasing/SuppliersPage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },
      {
        path: 'purchasing/purchase-orders',
        name: 'PurchaseOrders',
        component: () => import('../views/purchasing/PurchaseOrdersPage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },
      {
        path: 'purchasing/purchase-orders/create',
        name: 'PurchaseOrderCreate',
        component: () => import('../views/purchasing/PurchaseOrderFormPage.vue'),
      },
      {
        path: 'purchasing/goods-receipts',
        name: 'GoodsReceipts',
        component: () => import('../views/purchasing/GoodsReceiptsPage.vue'),
        meta: { requiresAuth: true, roles: ['admin', 'manager'] },
      },
      {
        path: 'purchasing/goods-receipts/create',
        name: 'GoodsReceiptCreate',
        component: () => import('../views/purchasing/GoodsReceiptsFormPage.vue'),
      },
      {
        path: 'settings/outlets',
        name: 'Outlets',
        component: () => import('../views/outlet/OutletPage.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token')
  const isAuthenticated = !!token

  if (to.meta.requiresAuth && !isAuthenticated) return '/login'
  if (to.meta.requiresGuest && isAuthenticated) return { name: 'pos' }

  if (to.meta.roles && to.meta.roles.length > 0 && isAuthenticated) {
    const user = JSON.parse(
      localStorage.getItem('auth_user') ?? sessionStorage.getItem('auth_user') ?? '{}'
    )
    const userRole: string = user?.role ?? ''
    if (!to.meta.roles.includes(userRole)) {
      return { name: 'Dashboard' }
    }
  }
})

export default router