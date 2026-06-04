export const discountCodes = [
  { code: 'VERANO10', percentage: 10 },
  { code: 'BOHO15', percentage: 15 },
  { code: 'ALMA20', percentage: 20 },
]

export const findDiscountByCode = (code) => {
  const normalized = code.trim().toUpperCase()
  return discountCodes.find((entry) => entry.code === normalized) ?? null
}
