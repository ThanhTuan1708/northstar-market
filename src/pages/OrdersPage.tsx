import { Link } from 'react-router-dom'
import { EmptyPanel } from '../components/StatePanel'
import { useAppSelector } from '../hooks'
import { formatDate, formatPrice } from '../lib/format'

export function OrdersPage() {
  const orders = useAppSelector((state) => state.orders.items)

  return (
    <div className="page">
      <div className="page-heading">
        <h1>Đơn hàng của tôi</h1>
        <p>Lịch sử đơn hàng được lưu trên trình duyệt này.</p>
      </div>

      {orders.length === 0 ? (
        <EmptyPanel
          title="Bạn chưa có đơn hàng nào"
          action={
            <Link className="button button-dark" to="/shop">
              Mua sắm ngay
            </Link>
          }
        />
      ) : (
        <ul className="orders-list">
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/order/${order.id}`} className="order-row">
                <div className="order-thumbs" aria-hidden="true">
                  {order.items.slice(0, 3).map((item) => (
                    <img key={item.id} src={item.image} alt="" />
                  ))}
                </div>
                <div>
                  <strong>{order.id}</strong>
                  <span className="muted">{formatDate(order.createdAt)}</span>
                </div>
                <span>{order.summary.itemCount} sản phẩm</span>
                <span className="status-pill">Đang xử lý</span>
                <strong>{formatPrice(order.summary.total)}</strong>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
