import type { CartItem, CartSummary, ShippingMethod } from '../types'

/** Tỷ giá cố định dùng để quy đổi giá USD từ Fake Store API sang VNĐ. */
export const USD_TO_VND = 25_000

export const FREE_SHIPPING_THRESHOLD = 1_000_000

export const DISCOUNT_CODES: Record<string, { rate: number; label: string }> = {
  NORTHSTAR10: { rate: 0.1, label: 'Giảm 10% cho mọi đơn hàng' },
  SPECIAL20: { rate: 0.2, label: 'Giảm 20% ưu đãi đặc biệt' },
}

export const SHIPPING_OPTIONS: Record<
  ShippingMethod,
  { label: string; eta: string; fee: number }
> = {
  standard: { label: 'Giao hàng tiêu chuẩn', eta: '3–5 ngày làm việc', fee: 30_000 },
  express: { label: 'Giao hàng nhanh', eta: '1–2 ngày làm việc', fee: 60_000 },
}

export function usdToVnd(usd: number) {
  return Math.round((usd * USD_TO_VND) / 1000) * 1000
}

export function computeCartSummary(
  items: CartItem[],
  discountCode: string | null,
  shippingMethod: ShippingMethod,
): CartSummary {
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const rate = discountCode ? (DISCOUNT_CODES[discountCode]?.rate ?? 0) : 0
  const discount = Math.round(subtotal * rate)
  const afterDiscount = subtotal - discount

  const qualifiesForFreeShipping = afterDiscount >= FREE_SHIPPING_THRESHOLD
  let shipping = 0
  if (items.length > 0) {
    shipping =
      shippingMethod === 'standard' && qualifiesForFreeShipping
        ? 0
        : SHIPPING_OPTIONS[shippingMethod].fee
  }

  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
    freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount),
  }
}
