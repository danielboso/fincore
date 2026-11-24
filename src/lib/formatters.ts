/**
 * Currency and financial value formatting utilities operating with integer cents
 * to prevent floating-point rounding errors.
 */

export function parseToCents(val: string): number {
  const normalized = val.trim().replace(",", ".")
  const clean = normalized.replace(/[^\d.-]/g, "")
  const parsed = Number(clean)
  if (isNaN(parsed) || !isFinite(parsed)) return 0
  return Math.round(parsed * 100)
}

export function formatCentsToCurrency(
  cents: number,
  currency = "BRL",
  locale = "pt-BR"
): string {
  const value = cents / 100
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCurrency(
  val: string,
  currency = "BRL",
  locale = "pt-BR"
): string {
  const cents = parseToCents(val)
  return formatCentsToCurrency(cents, currency, locale)
}
