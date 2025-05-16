export function formatEuro(amount) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function parseEuro(value) {
  if (typeof value === 'number') return value
  if (!value) return 0
  return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0
}