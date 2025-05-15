export function formatEuro(amount) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export function parseEuro(value) {
  return parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
}