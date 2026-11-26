const priceFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

export const formatPrice = (price: number) => priceFormatter.format(price)

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso))

const CATEGORY_LABELS: Record<string, string> = {
  electronics: 'Điện tử',
  jewelery: 'Trang sức',
  "men's clothing": 'Thời trang nam',
  "women's clothing": 'Thời trang nữ',
}

export const categoryLabel = (category: string) =>
  CATEGORY_LABELS[category] ?? category

export const categorySlug = (category: string) =>
  encodeURIComponent(category)
