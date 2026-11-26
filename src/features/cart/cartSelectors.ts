import { createSelector } from '@reduxjs/toolkit'
import { computeCartSummary } from '../../lib/pricing'
import type { RootState } from '../../store'

export const selectCartItems = (state: RootState) => state.cart.items
export const selectDiscountCode = (state: RootState) => state.cart.discountCode
export const selectShippingMethod = (state: RootState) => state.cart.shippingMethod

export const selectCartSummary = createSelector(
  [selectCartItems, selectDiscountCode, selectShippingMethod],
  computeCartSummary,
)

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)
