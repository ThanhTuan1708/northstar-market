import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addToCart } from '../features/cart/cartSlice'
import { toggleWishlist } from '../features/wishlist/wishlistSlice'
import { useAppDispatch, useAppSelector } from '../hooks'
import { categoryLabel, formatPrice } from '../lib/format'
import type { Product } from '../types'
import { CheckIcon, HeartIcon } from './Icons'
import { Rating } from './Rating'

export function ProductCard({ product }: { product: Product }) {
  const dispatch = useAppDispatch()
  const isWished = useAppSelector((state) => state.wishlist.ids.includes(product.id))
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const timer = window.setTimeout(() => setAdded(false), 1600)
    return () => window.clearTimeout(timer)
  }, [added])

  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true">
          <img src={product.image} alt="" loading="lazy" />
        </Link>
        <button
          className={`wish-button ${isWished ? 'is-active' : ''}`}
          aria-pressed={isWished}
          aria-label={isWished ? `Bỏ ${product.name} khỏi yêu thích` : `Thêm ${product.name} vào yêu thích`}
          onClick={() => dispatch(toggleWishlist(product.id))}
        >
          <HeartIcon filled={isWished} />
        </button>
        {product.rating.rate >= 4.5 && <span className="product-tag">Bán chạy</span>}
      </div>

      <div className="product-body">
        <span className="product-category">{categoryLabel(product.category)}</span>
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <Rating rating={product.rating} />
        <div className="product-footer">
          <strong className="price">{formatPrice(product.price)}</strong>
          <button
            className={`add-button ${added ? 'is-added' : ''}`}
            onClick={() => {
              dispatch(addToCart({ product }))
              setAdded(true)
            }}
          >
            {added ? (
              <>
                <CheckIcon /> Đã thêm
              </>
            ) : (
              'Thêm vào giỏ'
            )}
          </button>
        </div>
      </div>
    </article>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="product-grid" role="status" aria-label="Đang tải sản phẩm">
      {Array.from({ length: count }, (_, index) => (
        <div className="product-card skeleton" key={index}>
          <div className="product-image" />
          <div className="product-body">
            <span className="skeleton-line short" />
            <span className="skeleton-line" />
            <span className="skeleton-line medium" />
          </div>
        </div>
      ))}
    </div>
  )
}
