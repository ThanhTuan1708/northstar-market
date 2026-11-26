import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Brand } from './Brand'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-about">
          <Brand className="footer-brand" />
          <p>
            NorthStar Market tuyển chọn những sản phẩm thời trang, trang sức và
            đồ điện tử bền đẹp — để mỗi món đồ đều là lựa chọn đáng giá.
          </p>
        </div>

        <div>
          <h3>Mua sắm</h3>
          <Link to="/shop">Tất cả sản phẩm</Link>
          <Link to="/shop?category=women's%20clothing">Thời trang nữ</Link>
          <Link to="/shop?category=men's%20clothing">Thời trang nam</Link>
          <Link to="/shop?category=electronics">Điện tử</Link>
        </div>

        <div>
          <h3>Hỗ trợ</h3>
          <Link to="/orders">Tra cứu đơn hàng</Link>
          <Link to="/cart">Giỏ hàng</Link>
          <Link to="/wishlist">Danh sách yêu thích</Link>
          <span>Hotline: 1900 0000 (demo)</span>
        </div>

        <div className="footer-newsletter">
          <h3>Nhận tin ưu đãi</h3>
          <p>Đăng ký để nhận thông tin bộ sưu tập mới và mã giảm giá độc quyền.</p>
          {subscribed ? (
            <p className="form-message" role="status">
              Cảm ơn bạn! Bản demo không gửi email thật.
            </p>
          ) : (
            <form onSubmit={handleSubscribe}>
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Email của bạn"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit">Đăng ký</button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {CURRENT_YEAR} NorthStar Market. Dự án demo.</span>
        <span>Dữ liệu sản phẩm từ Fake Store API · Giá quy đổi sang VNĐ</span>
      </div>
    </footer>
  )
}
