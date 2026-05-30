import { defineStore } from 'pinia'

export const useOutletStore = defineStore('outlet', {
  state: () => ({
    activeOutlet: null,
    outlets: []
  }),
})