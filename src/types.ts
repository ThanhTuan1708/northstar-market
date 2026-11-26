export interface ProductRating {
  rate: number
  count: number
}

export interface Product {
  id: number
  name: string
  description: string
  category: string
  image: string
  /** Giá bán lẻ tính bằng VNĐ (đã gồm VAT). */
  price: number
  rating: ProductRating
}

export interface CartItem {
  id: number
  name: string
  category: string
  image: string
  price: number
  quantity: number
}

export type ShippingMethod = 'standard' | 'express'
export type PaymentMethod = 'cod' | 'bank'

export interface Customer {
  fullName: string
  phone: string
  email: string
  address: string
  city: string
  note: string
}

export interface CartSummary {
  itemCount: number
  subtotal: number
  discount: number
  shipping: number
  total: number
  freeShippingRemaining: number
}

export interface Order {
  id: string
  createdAt: string
  items: CartItem[]
  customer: Customer
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
  discountCode: string | null
  summary: CartSummary
}
