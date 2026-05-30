// src/stores/stockAlert.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export const useStockAlertStore = defineStore('stockAlert', () => {
  const alertCount       = ref(0)
  const lowStockProducts = ref<any[]>([])
  const summary          = ref({ out_of_stock: 0, critical: 0, low: 0 })

  async function fetchAlertCount() {
    try {
      const { data } = await api.get('/auth/stock-alerts/count')
      alertCount.value = data.count ?? 0
    } catch {
      alertCount.value = 0
    }
  }

  async function fetchLowStock() {
    try {
      const { data } = await api.get('/auth/stock-alerts')
      lowStockProducts.value = data.products ?? []
      summary.value          = data.summary  ?? { out_of_stock: 0, critical: 0, low: 0 }
    } catch {
      lowStockProducts.value = []
    }
  }

  return {
    alertCount,
    lowStockProducts,
    summary,
    fetchAlertCount,
    fetchLowStock,
  }
})