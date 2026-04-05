export function formatUZS(amount: number | null | undefined): string {
  if (amount == null) return '0 UZS'
  // toLocaleString o'rniga qo'lda formatlash (Hydration xatosini oldini olish uchun)
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' UZS'
}
