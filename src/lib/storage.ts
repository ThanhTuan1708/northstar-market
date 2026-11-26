export const STORAGE_KEYS = {
  cart: 'northstar-market:cart',
  wishlist: 'northstar-market:wishlist',
  orders: 'northstar-market:orders',
} as const

export interface LoadResult<T> {
  value: T
  error: string | null
}

/** Đọc dữ liệu JSON từ localStorage và kiểm tra cấu trúc trước khi dùng. */
export function loadFromStorage<T>(
  key: string,
  isValid: (value: unknown) => value is T,
  fallback: T,
  label: string,
): LoadResult<T> {
  if (typeof window === 'undefined') return { value: fallback, error: null }

  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return { value: fallback, error: null }

    const parsed: unknown = JSON.parse(raw)
    if (!isValid(parsed)) {
      return {
        value: fallback,
        error: `Dữ liệu ${label} đã lưu không hợp lệ và không thể khôi phục.`,
      }
    }
    return { value: parsed, error: null }
  } catch (error) {
    console.error(`Không thể đọc ${label} từ localStorage.`, error)
    return {
      value: fallback,
      error: `Không thể đọc ${label} đã lưu trên thiết bị này.`,
    }
  }
}

export function saveToStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') {
    throw new Error('localStorage không khả dụng trong môi trường hiện tại.')
  }
  window.localStorage.setItem(key, JSON.stringify(value))
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export function isCartItem(value: unknown): boolean {
  if (!isRecord(value)) return false
  return (
    Number.isInteger(value.id) &&
    typeof value.name === 'string' &&
    typeof value.category === 'string' &&
    typeof value.image === 'string' &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    Number.isInteger(value.quantity) &&
    Number(value.quantity) > 0
  )
}

export function isOrder(value: unknown): boolean {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string' &&
    Array.isArray(value.items) &&
    value.items.every(isCartItem) &&
    isRecord(value.customer) &&
    isRecord(value.summary)
  )
}
