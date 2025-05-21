export function formatEuro(amount) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function parseEuro(value) {
  if (typeof value === 'number') return value
  if (!value) return 0

  // Remove euro sign, non-breaking spaces, and other symbols
  const cleaned = value
    .replace(/\s/g, '')                   // Remove regular spaces
    .replace(/\u00A0/g, '')              // Remove non-breaking spaces
    .replace(/[^\d,.-]/g, '')            // Keep digits, comma, dot, minus

  
  return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0
}