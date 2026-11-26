import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCard, ProductGridSkeleton } from '../components/ProductCard'
import { EmptyPanel, ErrorPanel } from '../components/StatePanel'
import { useProducts } from '../hooks'
import { categoryLabel, formatPrice } from '../lib/format'

const SORT_OPTIONS = {
  featured: 'Nổi bật',
  rating: 'Đánh giá cao nhất',
  'price-asc': 'Giá: thấp đến cao',
  'price-desc': 'Giá: cao đến thấp',
  name: 'Tên A–Z',
} as const

type SortKey = keyof typeof SORT_OPTIONS

const PRICE_RANGES = [
  { value: 'all', label: 'Mọi mức giá', min: 0, max: Infinity },
  { value: 'under-500k', label: 'Dưới 500.000 ₫', min: 0, max: 500_000 },
  { value: '500k-2m', label: '500.000 ₫ – 2.000.000 ₫', min: 500_000, max: 2_000_000 },
  { value: 'over-2m', label: 'Trên 2.000.000 ₫', min: 2_000_000, max: Infinity },
]

export function ShopPage() {
  const { items, status, error, retry } = useProducts()
  const [params, setParams] = useSearchParams()

  const query = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const sortParam = params.get('sort') ?? 'featured'
  const sort: SortKey = sortParam in SORT_OPTIONS ? (sortParam as SortKey) : 'featured'
  const priceParam = params.get('price') ?? 'all'
  const priceRange = PRICE_RANGES.find((range) => range.value === priceParam) ?? PRICE_RANGES[0]

  const updateParam = (key: string, value: string, defaultValue = 'all') => {
    const next = new URLSearchParams(params)
    if (!value || value === defaultValue) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of items) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1)
    }
    return [...counts.entries()]
  }, [items])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = items.filter((product) => {
      const matchesCategory = category === 'all' || product.category === category
      const matchesQuery =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        categoryLabel(product.category).toLowerCase().includes(q)
      const matchesPrice =
        product.price >= priceRange.min && product.price < priceRange.max
      return matchesCategory && matchesQuery && matchesPrice
    })

    const sorted = [...filtered]
    switch (sort) {
      case 'rating':
        sorted.sort((a, b) => b.rating.rate - a.rating.rate)
        break
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        sorted.sort((a, b) => b.rating.count - a.rating.count)
    }
    return sorted
  }, [category, items, priceRange, query, sort])

  const hasFilters = query || category !== 'all' || priceRange.value !== 'all'
  const title = category !== 'all' ? categoryLabel(category) : 'Tất cả sản phẩm'

  return (
    <div className="page shop-page">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link to="/">Trang chủ</Link>
        <span aria-hidden="true">/</span>
        <span>{title}</span>
      </nav>

      <div className="page-heading">
        <h1>{title}</h1>
        {query && (
          <p>
            Kết quả tìm kiếm cho “<strong>{query}</strong>”
          </p>
        )}
      </div>

      <div className="shop-layout">
        <aside className="filters" aria-label="Bộ lọc">
          <div className="filter-group">
            <h2>Danh mục</h2>
            <button
              className={category === 'all' ? 'is-active' : ''}
              onClick={() => updateParam('category', 'all')}
            >
              Tất cả <span>{items.length}</span>
            </button>
            {categories.map(([value, count]) => (
              <button
                key={value}
                className={category === value ? 'is-active' : ''}
                onClick={() => updateParam('category', value)}
              >
                {categoryLabel(value)} <span>{count}</span>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <h2>Khoảng giá</h2>
            {PRICE_RANGES.map((range) => (
              <label className="radio-row" key={range.value}>
                <input
                  type="radio"
                  name="price"
                  checked={priceRange.value === range.value}
                  onChange={() => updateParam('price', range.value)}
                />
                {range.label}
              </label>
            ))}
          </div>

          {hasFilters && (
            <button className="clear-filters" onClick={() => setParams({}, { replace: true })}>
              Xóa tất cả bộ lọc
            </button>
          )}
        </aside>

        <section className="catalog" aria-label="Danh sách sản phẩm">
          <div className="catalog-toolbar">
            <span className="product-count">
              {status === 'succeeded' ? `${visible.length} sản phẩm` : 'Đang cập nhật...'}
            </span>
            <label className="sort-select">
              <span>Sắp xếp:</span>
              <select value={sort} onChange={(event) => updateParam('sort', event.target.value, 'featured')}>
                {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {status === 'failed' && <ErrorPanel message={error} onRetry={retry} />}
          {(status === 'loading' || status === 'idle') && <ProductGridSkeleton count={6} />}
          {status === 'succeeded' &&
            (visible.length === 0 ? (
              <EmptyPanel
                title="Không tìm thấy sản phẩm phù hợp"
                action={
                  <button className="button button-dark" onClick={() => setParams({})}>
                    Xóa bộ lọc
                  </button>
                }
              >
                Hãy thử từ khóa khác hoặc bỏ bớt bộ lọc.
              </EmptyPanel>
            ) : (
              <div className="product-grid">
                {visible.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ))}

          {status === 'succeeded' && visible.length > 0 && (
            <p className="catalog-note">
              Giá đã bao gồm VAT. Giá thấp nhất: {formatPrice(Math.min(...visible.map((p) => p.price)))}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
