import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { STORAGE_KEYS, loadFromStorage } from '../../lib/storage'

const stored = loadFromStorage<number[]>(
  STORAGE_KEYS.wishlist,
  (value): value is number[] =>
    Array.isArray(value) && value.every((id) => Number.isInteger(id)),
  [],
  'danh sách yêu thích',
)

interface WishlistState {
  ids: number[]
}

const initialState: WishlistState = { ids: stored.value }

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<number>) => {
      const id = action.payload
      state.ids = state.ids.includes(id)
        ? state.ids.filter((item) => item !== id)
        : [...state.ids, id]
    },
    clearWishlist: (state) => {
      state.ids = []
    },
  },
})

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
