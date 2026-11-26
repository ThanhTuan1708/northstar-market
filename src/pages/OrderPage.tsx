import { Link, useParams } from 'react-router-dom'
import { CheckIcon } from '../components/Icons'
import { SummaryLines } from '../components/OrderSummary'
import { EmptyPanel } from '../components/StatePanel'
import { useAppSelector } from '../hooks'
import { formatDate, formatPrice } from '../lib/format'
import { SHIPPING_OPTIONS } from '../lib/pricing'

export function OrderPage() {
  const { id } = useParams()
  const order = useAppSelector((state) => state.orders.items.find((item) => item.id === id))

  if (!order) {
    return (
      <div className="page">
        <EmptyPanel
          title="Không tìm thấy đơn hàng"
          action={
            <Link className="button button-dark" to="/orders">
              Xem đơn hàng của tôi
            </Link>
          }
        >
          Mã đơn {id} không tồn tại trên thiết bị này.
        </EmptyPanel>
      </div>
    )
  }

  const { customer } = order

  return (
    <div className="page order-page">
      <div className="order-hero">
        <span className="success-icon">
          <CheckIcon />
        </span>
        <h1>Cảm ơn bạn đã đặt hàng!</h1>
        <p>
          Mã đơn hàng <strong>{order.id}</strong> · {formatDate(order.createdAt)}
        </p>
        <p>
          NorthStar Market sẽ liên hệ số <strong>{customer.phone}</strong> để xác nhận
          đơn hàng.
        </p>
      </div>

      <div className="cart-layout">
        <section className="order-card">
          <h2>Sản phẩm</h2>
          <ul className="mini-items">
            {order.items.map((item) => (
              <li key={item.id}>
                <span className="mini-image">
                  <img src={item.image} alt="" />
                  <b>{item.quantity}</b>
                </span>
                <span className="mini-name">
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="order-info-grid">
            <div>
              <h3>Giao đến</h3>
              <p>
                {customer.fullName}
                <br />
                {customer.address}, {customer.city}
                <br />
                {customer.email}
              </p>
              {customer.note && <p className="muted">Ghi chú: {customer.note}</p>}
            </div>
            <div>
              <h3>Vận chuyển & thanh toán</h3>
              <p>
                {SHIPPING_OPTIONS[order.shippingMethod]?.label} ({SHIPPING_OPTIONS[order.shippingMethod]?.eta})
                <br />
                {order.paymentMethod === 'cod'
                  ? 'Thanh toán khi nhận hàng (COD)'
                  : 'Chuyển khoản ngân hàng'}
              </p>
              {order.paymentMethod === 'bank' && (
                <p className="bank-box">
                  Nội dung chuyển khoản: <strong>{order.id}</strong>
                  <br />
                  (Demo — không có tài khoản nhận thật)
                </p>
              )}
            </div>
          </div>
        </section>

        <aside className="summary-panel">
          <h2>Thanh toán</h2>
          {order.discountCode && <p className="muted">Mã giảm giá: {order.discountCode}</p>}
          <SummaryLines summary={order.summary}>
            <Link className="button button-dark full" to="/shop">
              Tiếp tục mua sắm
            </Link>
          </SummaryLines>
        </aside>
      </div>
    </div>
  )
}
