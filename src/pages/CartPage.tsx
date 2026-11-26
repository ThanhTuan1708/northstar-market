import { Link } from 'react-router-dom'
import { ArrowRight } from '../components/Icons'
import {
  DiscountForm,
  FreeShippingProgress,
  ShippingOptions,
  SummaryLines,
} from '../components/OrderSummary'
import { QuantityControl } from '../components/QuantityControl'
import { EmptyPanel } from '../components/StatePanel'
import { selectCartItems, selectCartSummary } from '../features/cart/cartSelectors'
import {
  MAX_QUANTITY,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../features/cart/cartSlice'
import { useAppDispatch, useAppSelector } from '../hooks'
import { categoryLabel, formatPrice } from '../lib/format'

export function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const summary = useAppSelector(selectCartSummary)
  const discountCode = useAppSelector((state) => state.cart.discountCode)
  const shippingMethod = useAppSelector((state) => state.cart.shippingMethod)
  const storageError = useAppSelector((state) => state.cart.storageError)

  return (
    <div className="page">
      <div className="page-heading">
        <h1>Giỏ hàng</h1>
        {items.length > 0 && <p>{summary.itemCount} sản phẩm trong giỏ của bạn</p>}
      </div>

      {storageError && (
        <p className="notice error-notice" role="alert">
          {storageError}
        </p>
      )}

      {items.length === 0 ? (
        <EmptyPanel
          title="Giỏ hàng của bạn đang trống"
          action={
            <Link className="button button-dark" to="/shop">
              Bắt đầu mua sắm <ArrowRight />
            </Link>
          }
        >
          Hãy khám phá các sản phẩm được tuyển chọn tại NorthStar Market.
        </EmptyPanel>
      ) : (
        <div className="cart-layout">
          <section aria-label="Sản phẩm trong giỏ">
            <FreeShippingProgress remaining={summary.freeShippingRemaining} />
            <ul className="cart-items">
              {items.map((item) => (
                <li className="cart-item" key={item.id}>
                  <Link to={`/product/${item.id}`} className="cart-item-image">
                    <img src={item.image} alt="" />
                  </Link>
                  <div className="cart-item-info">
                    <span className="product-category">{categoryLabel(item.category)}</span>
                    <h3>
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <span className="unit-price">{formatPrice(item.price)}</span>
                    <QuantityControl
                      value={item.quantity}
                      label={item.name}
                      max={MAX_QUANTITY}
                      onDecrease={() => dispatch(decreaseQuantity(item.id))}
                      onIncrease={() => dispatch(increaseQuantity(item.id))}
                    />
                  </div>
                  <div className="cart-item-end">
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                    <button
                      className="link-button"
                      aria-label={`Xóa ${item.name} khỏi giỏ`}
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-actions">
              <Link className="text-link" to="/shop">
                ← Tiếp tục mua sắm
              </Link>
              <button className="link-button" onClick={() => dispatch(clearCart())}>
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </section>

          <aside className="summary-panel" aria-label="Tóm tắt đơn hàng">
            <h2>Tóm tắt đơn hàng</h2>
            <DiscountForm discountCode={discountCode} />
            <ShippingOptions
              value={shippingMethod}
              freeEligible={summary.freeShippingRemaining === 0}
            />
            <SummaryLines summary={summary}>
              <Link className="button button-dark full" to="/checkout">
                Tiến hành thanh toán <ArrowRight />
              </Link>
            </SummaryLines>
            <p className="discount-hint">Mã dùng thử: NORTHSTAR10 hoặc SPECIAL20</p>
          </aside>
        </div>
      )}
    </div>
  )
}
