import {
  combineReducers,
  configureStore,
  type Middleware,
} from '@reduxjs/toolkit'
import cartReducer, { setCartStorageError } from './features/cart/cartSlice'
import ordersReducer from './features/orders/ordersSlice'
import productsReducer from './features/products/productsSlice'
import wishlistReducer from './features/wishlist/wishlistSlice'
import { STORAGE_KEYS, saveToStorage } from './lib/storage'

const rootReducer = combineReducers({
  cart: cartReducer,
  products: productsReducer,
  wishlist: wishlistReducer,
  orders: ordersReducer,
})

export type RootState = ReturnType<typeof rootReducer>

/** Lưu giỏ hàng, danh sách yêu thích và đơn hàng mỗi khi chúng thay đổi. */
const persistenceMiddleware: Middleware<{}, RootState> =
  (api) => (next) => (action) => {
    const before = api.getState()
    const result = next(action)
    const after = api.getState()

    if (before.cart.items !== after.cart.items) {
      try {
        saveToStorage(STORAGE_KEYS.cart, after.cart.items)
        if (after.cart.storageError) api.dispatch(setCartStorageError(null))
      } catch (error) {
        console.error('Không thể lưu giỏ hàng vào localStorage.', error)
        api.dispatch(
          setCartStorageError('Không thể lưu giỏ hàng trên thiết bị này.'),
        )
      }
    }

    try {
      if (before.wishlist.ids !== after.wishlist.ids) {
        saveToStorage(STORAGE_KEYS.wishlist, after.wishlist.ids)
      }
      if (before.orders.items !== after.orders.items) {
        saveToStorage(STORAGE_KEYS.orders, after.orders.items)
      }
    } catch (error) {
      console.error('Không thể lưu dữ liệu vào localStorage.', error)
    }

    return result
  }

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
})

export type AppDispatch = typeof store.dispatch
