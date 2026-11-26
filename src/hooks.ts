import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from './features/products/productsSlice'
import type { AppDispatch, RootState } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

/** Tải danh sách sản phẩm một lần và trả về trạng thái hiện tại. */
export function useProducts() {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.products.items)
  const status = useAppSelector((state) => state.products.status)
  const error = useAppSelector((state) => state.products.error)

  useEffect(() => {
    if (status === 'idle') void dispatch(fetchProducts())
  }, [dispatch, status])

  const retry = () => void dispatch(fetchProducts())

  return { items, status, error, retry }
}
