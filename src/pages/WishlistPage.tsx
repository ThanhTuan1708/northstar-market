import { Link } from 'react-router-dom'
import { ProductCard, ProductGridSkeleton } from '../components/ProductCard'
import { EmptyPanel, ErrorPanel } from '../components/StatePanel'
import { clearWishlist } from '../features/wishlist/wishlistSlice'
import { useAppDispatch, useAppSelector, useProducts } from '../hooks'

export function WishlistPage() {
  const dispatch = useAppDispatch()
  const ids = useAppSelector((state) => state.wishlist.ids)
  const { items, status, error, retry } = useProducts()
  const products = items.filter((product) => ids.includes(product.id))

  return (
    <div className="page">
      <div className="page-heading with-action">
        <div>
          <h1>Danh sách yêu thích</h1>
          <p>{ids.length} sản phẩm đã lưu</p>
        </div>
        {ids.length > 0 && (
          <button className="link-button" onClick={() => dispatch(clearWishlist())}>
            Xóa tất cả
          </button>
        )}
      </div>

      {ids.length === 0 ? (
        <EmptyPanel
          title="Chưa có sản phẩm yêu thích"
          action={
            <Link className="button button-dark" to="/shop">
              Khám phá sản phẩm
            </Link>
          }
        >
          Nhấn vào biểu tượng trái tim trên sản phẩm để lưu lại.
        </EmptyPanel>
      ) : status === 'failed' ? (
        <ErrorPanel message={error} onRetry={retry} />
      ) : status !== 'succeeded' ? (
        <ProductGridSkeleton count={Math.min(ids.length, 4)} />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
