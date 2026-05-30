<template>
  <span :class="badgeClass" class="inline-flex px-2 py-0.5 rounded text-xs font-medium">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: string; type?: string }>()

const CONFIG: Record<string, Record<string, { label: string; cls: string }>> = {
  po: {
    draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600' },
    approved:  { label: 'Approved',  cls: 'bg-blue-100 text-blue-700' },
    partial:   { label: 'Partial',   cls: 'bg-amber-100 text-amber-700' },
    received:  { label: 'Received',  cls: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600' },
  },
  grn: {
    draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600' },
    confirmed: { label: 'Confirmed', cls: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600' },
  },
  adj: {
    draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600' },
    confirmed: { label: 'Confirmed', cls: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600' },
  },
  invoice: {
    unpaid:    { label: 'Belum Bayar', cls: 'bg-amber-100 text-amber-700' },
    partial:   { label: 'Sebagian',    cls: 'bg-blue-100 text-blue-700' },
    paid:      { label: 'Lunas',       cls: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled',   cls: 'bg-red-100 text-red-600' },
  },
  opname: {
    draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600' },
    confirmed: { label: 'Confirmed', cls: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600' },
  },
  return: {
    draft:     { label: 'Draft',     cls: 'bg-gray-100 text-gray-600' },
    confirmed: { label: 'Confirmed', cls: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-600' },
  },
}

const badgeClass = computed(() =>
  CONFIG[props.type ?? '']?.[props.status]?.cls ?? 'bg-gray-100 text-gray-600'
)
const label = computed(() =>
  CONFIG[props.type ?? '']?.[props.status]?.label ?? props.status
)
</script>