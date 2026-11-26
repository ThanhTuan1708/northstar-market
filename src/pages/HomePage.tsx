import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChatIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons'
import { ProductCard, ProductGridSkeleton } from '../components/ProductCard'
import { ErrorPanel } from '../components/StatePanel'
import { useProducts } from '../hooks'
import { categoryLabel, formatPrice } from '../lib/format'
import { FREE_SHIPPING_THRESHOLD } from '../lib/pricing'

const BENEFITS = [
  {
    icon: TruckIcon,
    title: 'Giao hàng toàn quốc',
    text: `Miễn phí cho đơn từ ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
  },
  { icon: ReturnIcon, title: 'Đổi trả 30 ngày', text: 'Hoàn tiền nếu sản phẩm lỗi' },
  { icon: ShieldIcon, title: 'Thanh toán an toàn', text: 'COD hoặc chuyển khoản' },
  { icon: ChatIcon, title: 'Hỗ trợ tận tâm', text: 'Tư vấn 8:00 – 22:00 mỗi ngày' },
]

export function HomePage() {
  const { items, status, error, retry } = useProducts()

  const featured = useMemo(
    () => [...items].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 8),
    [items],
  )

  const categories = useMemo(() => {
    const map = new Map<string, { image: string; count: number }>()
    for (const product of items) {
      const entry = map.get(product.category)
      if (entry) entry.count += 1
      else map.set(product.category, { image: product.image, count: 1 })
    }
    return [...map.entries()]
  }, [items])

  const heroProducts = featured.slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">BỘ SƯU TẬP MÙA MỚI 2026</p>
          <h1>
            Mua sắm theo <em>ngôi sao</em> dẫn lối của riêng bạn.
          </h1>
          <p>
            NorthStar Market mang đến thời trang, trang sức và đồ công nghệ được
            tuyển chọn kỹ lưỡng — giao tận nơi, đổi trả dễ dàng.
          </p>
          <div className="hero-actions">
            <Link className="button button-dark" to="/shop">
              Mua sắm ngay <ArrowRight />
            </Link>
            <Link className="button button-ghost" to="/shop?sort=rating">
              Sản phẩm bán chạy
            </Link>
          </div>
          <dl className="hero-stats">
            <div>
              <dt>Sản phẩm</dt>
              <dd>{status === 'succeeded' ? items.length : '—'}+</dd>
            </div>
            <div>
              <dt>Khách hàng hài lòng</dt>
              <dd>4.8★</dd>
            </div>
            <div>
              <dt>Giao hàng</dt>
              <dd>63 tỉnh</dd>
            </div>
          </dl>
        </div>

        <div className="hero-visual" aria-hidden="true">
          {heroProducts.length > 0
            ? heroProducts.map((product, index) => (
                <div className={`hero-tile hero-tile-${index + 1}`} key={product.id}>
                  <img src={product.image} alt="" />
                </div>
              ))
            : [1, 2, 3].map((index) => (
                <div className={`hero-tile hero-tile-${index} skeleton`} key={index} />
              ))}
          <div className="hero-badge">
            <strong>-10%</strong>
            <span>mã NORTHSTAR10</span>
          </div>
        </div>
      </section>

      <section className="benefits" aria-label="Cam kết của NorthStar Market">
        {BENEFITS.map(({ icon: Icon, title, text }) => (
          <div className="benefit" key={title}>
            <Icon />
            <div>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DANH MỤC</p>
            <h2>Mua sắm theo danh mục</h2>
          </div>
          <Link className="text-link" to="/shop">
            Xem tất cả <ArrowRight />
          </Link>
        </div>
        {status === 'failed' ? (
          <ErrorPanel message={error} onRetry={retry} />
        ) : (
          <div className="category-grid">
            {categories.length === 0
              ? [1, 2, 3, 4].map((index) => (
                  <div className="category-card skeleton" key={index} />
                ))
              : categories.map(([category, info]) => (
                  <Link
                    className="category-card"
                    key={category}
                    to={`/shop?category=${encodeURIComponent(category)}`}
                  >
                    <img src={info.image} alt="" loading="lazy" />
                    <div>
                      <strong>{categoryLabel(category)}</strong>
                      <span>{info.count} sản phẩm</span>
                    </div>
                  </Link>
                ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ĐƯỢC YÊU THÍCH NHẤT</p>
            <h2>Sản phẩm nổi bật</h2>
          </div>
          <Link className="text-link" to="/shop?sort=rating">
            Xem thêm <ArrowRight />
          </Link>
        </div>
        {status === 'succeeded' ? (
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : status === 'failed' ? null : (
          <ProductGridSkeleton />
        )}
      </section>

      <section className="promo">
        <div>
          <p className="eyebrow">ƯU ĐÃI THÀNH VIÊN</p>
          <h2>Giảm 20% cho đơn hàng đặc biệt</h2>
          <p>
            Nhập mã <strong>SPECIAL20</strong> tại giỏ hàng. Áp dụng cho mọi sản
            phẩm, không giới hạn giá trị đơn.
          </p>
        </div>
        <Link className="button button-light" to="/shop">
          Khám phá ngay <ArrowRight />
        </Link>
      </section>
    </>
  )
}
