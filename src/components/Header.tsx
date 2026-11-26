import { useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { selectCartCount } from '../features/cart/cartSelectors'
import { useAppSelector } from '../hooks'
import { categoryLabel, formatPrice } from '../lib/format'
import { FREE_SHIPPING_THRESHOLD } from '../lib/pricing'
import { Brand } from './Brand'
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from './Icons'

const NAV_CATEGORIES = ["women's clothing", "men's clothing", 'jewelery', 'electronics']

export function Header() {
  const cartCount = useAppSelector(selectCartCount)
  const wishlistCount = useAppSelector((state) => state.wishlist.ids.length)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [menuOpen, setMenuOpen] = useState(false)

  // Khi đổi trang: đóng menu mobile và đồng bộ ô tìm kiếm với URL.
  const locationKey = location.pathname + location.search
  const [lastLocationKey, setLastLocationKey] = useState(locationKey)
  if (locationKey !== lastLocationKey) {
    setLastLocationKey(locationKey)
    setMenuOpen(false)
    setQuery(searchParams.get('q') ?? '')
  }

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
  }

  return (
    <header className="site-header">
      <div className="announcement">
        Miễn phí giao hàng tiêu chuẩn cho đơn từ {formatPrice(FREE_SHIPPING_THRESHOLD)} ·
        Nhập mã <strong>NORTHSTAR10</strong> để được giảm 10%
      </div>

      <div className="header-main">
        <button
          className="icon-button menu-toggle"
          aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        <Brand />

        <form className="header-search" role="search" onSubmit={handleSearch}>
          <label className="sr-only" htmlFor="header-search">
            Tìm kiếm sản phẩm
          </label>
          <input
            id="header-search"
            type="search"
            placeholder="Tìm áo khoác, tai nghe, trang sức..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" aria-label="Tìm kiếm">
            <SearchIcon />
          </button>
        </form>

        <div className="header-actions">
          <Link className="icon-button" to="/wishlist" aria-label={`Yêu thích (${wishlistCount})`}>
            <HeartIcon />
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </Link>
          <Link className="icon-button" to="/cart" aria-label={`Giỏ hàng (${cartCount})`}>
            <BagIcon />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>

      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Điều hướng chính">
        <NavLink to="/" end>
          Trang chủ
        </NavLink>
        <NavLink to="/shop" end>
          Tất cả sản phẩm
        </NavLink>
        {NAV_CATEGORIES.map((category) => (
          <Link key={category} to={`/shop?category=${encodeURIComponent(category)}`}>
            {categoryLabel(category)}
          </Link>
        ))}
        <NavLink to="/orders">Đơn hàng của tôi</NavLink>
      </nav>
    </header>
  )
}
