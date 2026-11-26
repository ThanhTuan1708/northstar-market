import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { STORAGE_KEYS, isOrder, loadFromStorage } from '../../lib/storage'
import type { Order } from '../../types'

const stored = loadFromStorage<Order[]>(
  STORAGE_KEYS.orders,
  (value): value is Order[] => Array.isArray(value) && value.every(isOrder),
  [],
  'lịch sử đơn hàng',
)

interface OrdersState {
  items: Order[]
}

const initialState: OrdersState = { items: stored.value }

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<Order>) => {
      state.items.unshift(action.payload)
    },
  },
})

export const { placeOrder } = ordersSlice.actions
export default ordersSlice.reducer

export function createOrderId(date = new Date()) {
  const stamp = [
    date.getFullYear().toString().slice(2),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')
  const random = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `NS${stamp}-${random}`
}
