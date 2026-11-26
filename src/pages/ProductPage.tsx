import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CheckIcon, HeartIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons'
import { ProductCard } from '../components/ProductCard'
import { QuantityControl } from '../components/QuantityControl'
import { Rating } from '../components/Rating'
import { EmptyPanel, ErrorPanel } from '../components/StatePanel'
import { MAX_QUANTITY, addToCart } from '../features/cart/cartSlice'
import { toggleWishlist } from '../features/wishlist/wishlistSlice'
import { useAppDispatch, useAppSelector, useProducts } from '../hooks'
import { categoryLabel, formatPrice } from '../lib/format'
import { FREE_SHIPPING_THRESHOLD } from '../lib/pricing'

export function ProductPage() {
  const { id } = useParams()
  const productId = Number(id)
  const { items, status, error, retry } = useProducts()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isWished = useAppSelector((state) => state.wishlist.ids.includes(productId))
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (status === 'failed') {
    return (
      <div className="page">
        <ErrorPanel message={error} onRetry={retry} />
      </div>
    )
  }

  if (status !== 'succeeded') {
    return (
      <div className="page">
        <div className="product-detail skeleton-detail" role="status" aria-label="Đang tải sản phẩm">
          <div className="detail-gallery skeleton" />
          <div className="detail-info">
            <span className="skeleton-line short" />
            <span className="skeleton-line" />
            <span className="skeleton-line medium" />
          </div>
        </div>
      </div>
    )
  }

  const product = items.find((item) => item.id === productId)

  if (!product) {
    return (
      <div className="page">
        <EmptyPanel
          title="Không tìm thấy sản phẩm"
          action={
            <Link className="button button-dark" to="/shop">
              Quay lại cửa hàng
            </Link>
          }
        >
          Sản phẩm có thể đã ngừng kinh doanh hoặc đường dẫn không đúng.
        </EmptyPanel>
      </div>
    )
  }

  const related = items
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4)

  const handleAdd = (goToCart = false) => {
    dispatch(addToCart({ product, quantity }))
    if (goToCart) {
      navigate('/cart')
      return
    }
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="page">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link to="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
          {categoryLabel(product.category)}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{product.name}</span>
      </nav>

      <article className="product-detail">
        <div className="detail-gallery">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-info">
          <span className="product-category">{categoryLabel(product.category)}</span>
          <h1>{product.name}</h1>
          <Rating rating={product.rating} />
          <p className="detail-price">{formatPrice(product.price)}</p>
          <p className="detail-stock">
            <CheckIcon /> Còn hàng · Giao từ kho Hà Nội & TP.HCM
          </p>
          <p className="detail-description">{product.description}</p>

          <div className="detail-buy">
            <QuantityControl
              value={quantity}
              label={product.name}
              max={MAX_QUANTITY}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrease={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
            />
            <button className={`button button-dark grow ${added ? 'is-added' : ''}`} onClick={() => handleAdd()}>
              {added ? 'Đã thêm vào giỏ ✓' : 'Thêm vào giỏ hàng'}
            </button>
            <button
              className={`icon-button wish-large ${isWished ? 'is-active' : ''}`}
              aria-pressed={isWished}
              aria-label={isWished ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
              onClick={() => dispatch(toggleWishlist(product.id))}
            >
              <HeartIcon filled={isWished} />
            </button>
          </div>
          <button className="button button-gold full" onClick={() => handleAdd(true)}>
            Mua ngay · {formatPrice(product.price * quantity)}
          </button>

          <ul className="detail-perks">
            <li>
              <TruckIcon /> Miễn phí giao tiêu chuẩn cho đơn từ {formatPrice(FREE_SHIPPING_THRESHOLD)}
            </li>
            <li>
              <ReturnIcon /> Đổi trả miễn phí trong 30 ngày
            </li>
            <li>
              <ShieldIcon /> Thanh toán khi nhận hàng (COD) hoặc chuyển khoản
            </li>
          </ul>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CÓ THỂ BẠN CŨNG THÍCH</p>
              <h2>Sản phẩm liên quan</h2>
            </div>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
