import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { DISCOUNT_CODES } from '../../lib/pricing'
import { STORAGE_KEYS, isCartItem, loadFromStorage } from '../../lib/storage'
import type { CartItem, Product, ShippingMethod } from '../../types'

const storedCart = loadFromStorage<CartItem[]>(
  STORAGE_KEYS.cart,
  (value): value is CartItem[] => Array.isArray(value) && value.every(isCartItem),
  [],
  'giỏ hàng',
)

export const MAX_QUANTITY = 99

export interface CartState {
  items: CartItem[]
  discountCode: string | null
  shippingMethod: ShippingMethod
  storageError: string | null
}

const initialState: CartState = {
  items: storedCart.value,
  discountCode: null,
  shippingMethod: 'standard',
  storageError: storedCart.error,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity?: number }>,
    ) => {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.id === product.id)

      if (existing) {
        existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + quantity)
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          category: product.category,
          image: product.image,
          price: product.price,
          quantity: Math.min(MAX_QUANTITY, quantity),
        })
      }
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload)
      if (item && item.quantity < MAX_QUANTITY) item.quantity += 1
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload)
      if (item && item.quantity > 1) item.quantity -= 1
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
      state.discountCode = null
    },
    applyDiscount: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase()
      if (DISCOUNT_CODES[code]) state.discountCode = code
    },
    clearDiscount: (state) => {
      state.discountCode = null
    },
    setShippingMethod: (state, action: PayloadAction<ShippingMethod>) => {
      state.shippingMethod = action.payload
    },
    setCartStorageError: (state, action: PayloadAction<string | null>) => {
      state.storageError = action.payload
    },
  },
})

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
  applyDiscount,
  clearDiscount,
  setShippingMethod,
  setCartStorageError,
} = cartSlice.actions

export default cartSlice.reducer
