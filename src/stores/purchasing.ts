// src/stores/purchasing.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export const usePurchasingStore = defineStore('purchasing', () => {
  const suppliers        = ref<any[]>([])
  const purchaseOrders   = ref<any[]>([])
  const goodsReceipts    = ref<any[]>([])
  const purchaseInvoices = ref<any[]>([])
  const loading          = ref(false)

  // ── Suppliers ─────────────────────────────────────────────────────────────
  async function fetchSuppliers(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/auth/suppliers', { params })
      suppliers.value = data.data
      return data
    } finally {
      loading.value = false
    }
  }

  async function createSupplier(payload: any) {
    const { data } = await api.post('/auth/suppliers', payload)
    suppliers.value.unshift(data)
    return data
  }

  async function updateSupplier(id: number, payload: any) {
    const { data } = await api.put(`/auth/suppliers/${id}`, payload)
    const idx = suppliers.value.findIndex((s: any) => s.id === id)
    if (idx !== -1) suppliers.value[idx] = data
    return data
  }

  async function deleteSupplier(id: number) {
    await api.delete(`/auth/suppliers/${id}`)
    suppliers.value = suppliers.value.filter((s: any) => s.id !== id)
  }

  // ── Purchase Orders ────────────────────────────────────────────────────────
  async function fetchPurchaseOrders(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/auth/purchase-orders', { params })
      purchaseOrders.value = data.data
      return data
    } finally {
      loading.value = false
    }
  }

  async function createPurchaseOrder(payload: any) {
    const { data } = await api.post('/auth/purchase-orders', payload)
    return data
  }

  async function approvePO(id: number) {
    const { data } = await api.patch(`/auth/purchase-orders/${id}/approve`)
    return data
  }

  async function cancelPO(id: number, reason: string) {
    const { data } = await api.patch(`/auth/purchase-orders/${id}/cancel`, { reason })
    return data
  }

  // ── Goods Receipts ─────────────────────────────────────────────────────────
  async function fetchGoodsReceipts(params = {}) {
    loading.value = true
    try {
      const { data } = await api.get('/auth/goods-receipts', { params })
      goodsReceipts.value = data.data
      return data
    } finally {
      loading.value = false
    }
  }

  async function createGoodsReceipt(payload: any) {
    const { data } = await api.post('/auth/goods-receipts', payload)
    return data
  }

  async function confirmGRN(id: number) {
    const { data } = await api.patch(`/auth/goods-receipts/${id}/confirm`)
    return data
  }

  async function cancelGRN(id: number, reason: string) {
    const { data } = await api.patch(`/auth/goods-receipts/${id}/cancel`, { reason })
    return data
  }

  return {
    suppliers,
    purchaseOrders,
    goodsReceipts,
    purchaseInvoices,
    loading,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    fetchPurchaseOrders,
    createPurchaseOrder,
    approvePO,
    cancelPO,
    fetchGoodsReceipts,
    createGoodsReceipt,
    confirmGRN,
    cancelGRN,
  }
})