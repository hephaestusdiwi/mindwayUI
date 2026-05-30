// src/lib/utils.ts

/**
 * Format tanggal ke format Indonesia
 * Input: '2025-01-15' atau Date object
 * Output: '15 Jan 2025'
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format tanggal + waktu
 * Output: '15 Jan 2025, 14:30'
 */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  if (isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format angka ke format mata uang Rupiah
 * Input: 150000
 * Output: 'Rp 150.000'
 */
export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return 'Rp 0'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

/**
 * Format angka dengan pemisah ribuan
 * Input: 150000
 * Output: '150.000'
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '0'
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

/**
 * Truncate teks panjang
 * Input: 'Teks yang sangat panjang sekali', 20
 * Output: 'Teks yang sangat pan...'
 */
export function truncate(text: string, length = 30): string {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

/**
 * Ambil inisial dari nama
 * Input: 'John Doe'
 * Output: 'JD'
 */
export function getInitials(name: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n.charAt(0).toUpperCase())
    .join('')
}