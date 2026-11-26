import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ShippingOptions, SummaryLines } from '../components/OrderSummary'
import { selectCartItems, selectCartSummary } from '../features/cart/cartSelectors'
import { clearCart } from '../features/cart/cartSlice'
import { createOrderId, placeOrder } from '../features/orders/ordersSlice'
import { useAppDispatch, useAppSelector } from '../hooks'
import { formatPrice } from '../lib/format'
import type { Customer, PaymentMethod } from '../types'

const EMPTY_CUSTOMER: Customer = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  note: '',
}

const CITIES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'Huế',
  'Khánh Hòa',
  'Lâm Đồng',
  'Quảng Ninh',
  'Tỉnh/thành khác',
]

const PAYMENT_OPTIONS: Record<PaymentMethod, { label: string; hint: string }> = {
  cod: { label: 'Thanh toán khi nhận hàng (COD)', hint: 'Trả tiền mặt cho nhân viên giao hàng.' },
  bank: {
    label: 'Chuyển khoản ngân hàng',
    hint: 'Thông tin chuyển khoản sẽ hiển thị sau khi đặt hàng (demo).',
  },
}

type Errors = Partial<Record<keyof Customer, string>>

function validate(customer: Customer): Errors {
  const errors: Errors = {}
  if (customer.fullName.trim().length < 2) errors.fullName = 'Vui lòng nhập họ và tên.'
  if (!/^(0|\+84)\d{9,10}$/.test(customer.phone.replace(/[\s.-]/g, '')))
    errors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()))
    errors.email = 'Email không hợp lệ.'
  if (customer.address.trim().length < 5) errors.address = 'Vui lòng nhập địa chỉ nhận hàng.'
  if (!customer.city) errors.city = 'Vui lòng chọn tỉnh/thành phố.'
  return errors
}

export function CheckoutPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector(selectCartItems)
  const summary = useAppSelector(selectCartSummary)
  const discountCode = useAppSelector((state) => state.cart.discountCode)
  const shippingMethod = useAppSelector((state) => state.cart.shippingMethod)
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER)
  const [payment, setPayment] = useState<PaymentMethod>('cod')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0 && !submitting) return <Navigate to="/cart" replace />

  const update =
    (field: keyof Customer) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setCustomer((current) => ({ ...current, [field]: event.target.value }))
      if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(customer)
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      document.getElementById(`checkout-${firstError}`)?.focus()
      return
    }

    setSubmitting(true)
    const id = createOrderId()
    dispatch(
      placeOrder({
        id,
        createdAt: new Date().toISOString(),
        items,
        customer: {
          ...customer,
          fullName: customer.fullName.trim(),
          email: customer.email.trim(),
          address: customer.address.trim(),
          note: customer.note.trim(),
        },
        shippingMethod,
        paymentMethod: payment,
        discountCode,
        summary,
      }),
    )
    dispatch(clearCart())
    navigate(`/order/${id}`, { replace: true })
  }

  const field = (
    name: keyof Customer,
    label: string,
    props: InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div className={`field ${errors[name] ? 'has-error' : ''}`}>
      <label htmlFor={`checkout-${name}`}>{label}</label>
      <input
        id={`checkout-${name}`}
        value={customer[name]}
        onChange={update(name)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `checkout-${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <span className="field-error" id={`checkout-${name}-error`}>
          {errors[name]}
        </span>
      )}
    </div>
  )

  return (
    <div className="page">
      <nav className="breadcrumbs" aria-label="Đường dẫn">
        <Link to="/cart">Giỏ hàng</Link>
        <span aria-hidden="true">/</span>
        <span>Thanh toán</span>
      </nav>
      <div className="page-heading">
        <h1>Thanh toán</h1>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout-main">
          <section className="checkout-section">
            <h2>
              <span>1</span> Thông tin nhận hàng
            </h2>
            <div className="field-grid">
              {field('fullName', 'Họ và tên *', { autoComplete: 'name' })}
              {field('phone', 'Số điện thoại *', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
              {field('email', 'Email *', { type: 'email', autoComplete: 'email' })}
              <div className={`field ${errors.city ? 'has-error' : ''}`}>
                <label htmlFor="checkout-city">Tỉnh/Thành phố *</label>
                <select
                  id="checkout-city"
                  value={customer.city}
                  onChange={update('city')}
                  aria-invalid={Boolean(errors.city)}
                >
                  <option value="">Chọn tỉnh/thành</option>
                  {CITIES.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <span className="field-error">{errors.city}</span>}
              </div>
              <div className="span-2">
                {field('address', 'Địa chỉ chi tiết *', {
                  autoComplete: 'street-address',
                  placeholder: 'Số nhà, tên đường, phường/xã',
                })}
              </div>
              <div className="field span-2">
                <label htmlFor="checkout-note">Ghi chú cho đơn hàng</label>
                <textarea
                  id="checkout-note"
                  rows={3}
                  value={customer.note}
                  onChange={update('note')}
                  placeholder="VD: Giao giờ hành chính"
                />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h2>
              <span>2</span> Giao hàng
            </h2>
            <ShippingOptions
              value={shippingMethod}
              freeEligible={summary.freeShippingRemaining === 0}
            />
          </section>

          <section className="checkout-section">
            <h2>
              <span>3</span> Thanh toán
            </h2>
            <fieldset className="option-list">
              <legend className="sr-only">Phương thức thanh toán</legend>
              {(Object.keys(PAYMENT_OPTIONS) as PaymentMethod[]).map((method) => (
                <label key={method} className={payment === method ? 'is-selected' : ''}>
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === method}
                    onChange={() => setPayment(method)}
                  />
                  <span>
                    {PAYMENT_OPTIONS[method].label}
                    <small>{PAYMENT_OPTIONS[method].hint}</small>
                  </span>
                </label>
              ))}
            </fieldset>
          </section>
        </div>

        <aside className="summary-panel" aria-label="Đơn hàng của bạn">
          <h2>Đơn hàng của bạn</h2>
          <ul className="mini-items">
            {items.map((item) => (
              <li key={item.id}>
                <span className="mini-image">
                  <img src={item.image} alt="" />
                  <b>{item.quantity}</b>
                </span>
                <span className="mini-name">{item.name}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <SummaryLines summary={summary}>
            <button className="button button-dark full" type="submit" disabled={submitting}>
              Đặt hàng · {formatPrice(summary.total)}
            </button>
          </SummaryLines>
          <p className="discount-hint">
            Đây là cửa hàng demo: đơn hàng chỉ được lưu trên trình duyệt của bạn, không
            phát sinh giao dịch thật.
          </p>
        </aside>
      </form>
    </div>
  )
}
