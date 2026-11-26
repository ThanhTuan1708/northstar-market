import { useState, type FormEvent, type ReactNode } from 'react'
import {
  applyDiscount,
  clearDiscount,
  setShippingMethod,
} from '../features/cart/cartSlice'
import { useAppDispatch } from '../hooks'
import { formatPrice } from '../lib/format'
import { DISCOUNT_CODES, FREE_SHIPPING_THRESHOLD, SHIPPING_OPTIONS } from '../lib/pricing'
import type { CartSummary, ShippingMethod } from '../types'

export function DiscountForm({ discountCode }: { discountCode: string | null }) {
  const dispatch = useAppDispatch()
  const [input, setInput] = useState('')
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const code = input.trim().toUpperCase()
    if (!code) return
    if (!DISCOUNT_CODES[code]) {
      setMessage({ text: 'Mã giảm giá không hợp lệ hoặc đã hết hạn.', error: true })
      return
    }
    dispatch(applyDiscount(code))
    setInput('')
    setMessage({ text: `Đã áp dụng mã ${code}.`, error: false })
  }

  return (
    <div className="discount-block">
      <label htmlFor="discount-code">Mã giảm giá</label>
      {discountCode ? (
        <div className="applied-code">
          <span>
            <strong>{discountCode}</strong> · {DISCOUNT_CODES[discountCode]?.label}
          </span>
          <button
            type="button"
            onClick={() => {
              dispatch(clearDiscount())
              setMessage(null)
            }}
          >
            Gỡ mã
          </button>
        </div>
      ) : (
        <form className="inline-form" onSubmit={handleSubmit}>
          <input
            id="discount-code"
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              setMessage(null)
            }}
            placeholder="VD: NORTHSTAR10"
            autoComplete="off"
          />
          <button type="submit">Áp dụng</button>
        </form>
      )}
      {message && (
        <p className={`form-message ${message.error ? 'is-error' : ''}`} role="status">
          {message.text}
        </p>
      )}
    </div>
  )
}

export function ShippingOptions({
  value,
  freeEligible,
}: {
  value: ShippingMethod
  freeEligible: boolean
}) {
  const dispatch = useAppDispatch()

  return (
    <fieldset className="option-list">
      <legend>Phương thức giao hàng</legend>
      {(Object.keys(SHIPPING_OPTIONS) as ShippingMethod[]).map((method) => {
        const option = SHIPPING_OPTIONS[method]
        const isFree = method === 'standard' && freeEligible
        return (
          <label key={method} className={value === method ? 'is-selected' : ''}>
            <input
              type="radio"
              name="shipping"
              checked={value === method}
              onChange={() => dispatch(setShippingMethod(method))}
            />
            <span>
              {option.label}
              <small>{option.eta}</small>
            </span>
            <strong>{isFree ? 'Miễn phí' : formatPrice(option.fee)}</strong>
          </label>
        )
      })}
    </fieldset>
  )
}

export function SummaryLines({
  summary,
  children,
}: {
  summary: CartSummary
  children?: ReactNode
}) {
  return (
    <div className="order-summary">
      <div>
        <span>Tạm tính ({summary.itemCount} sản phẩm)</span>
        <span>{formatPrice(summary.subtotal)}</span>
      </div>
      {summary.discount > 0 && (
        <div className="discount-row">
          <span>Giảm giá</span>
          <span>−{formatPrice(summary.discount)}</span>
        </div>
      )}
      <div>
        <span>Phí giao hàng</span>
        <span>{summary.shipping === 0 ? 'Miễn phí' : formatPrice(summary.shipping)}</span>
      </div>
      <div className="summary-total">
        <strong>Tổng cộng</strong>
        <strong>{formatPrice(summary.total)}</strong>
      </div>
      <p className="vat-note">Giá đã bao gồm VAT</p>
      {children}
    </div>
  )
}

export function FreeShippingProgress({ remaining }: { remaining: number }) {
  const percent = Math.min(100, ((FREE_SHIPPING_THRESHOLD - remaining) / FREE_SHIPPING_THRESHOLD) * 100)
  return (
    <div className="free-shipping">
      <p>
        {remaining > 0 ? (
          <>
            Mua thêm <strong>{formatPrice(remaining)}</strong> để được miễn phí giao hàng tiêu chuẩn.
          </>
        ) : (
          <>🎉 Đơn hàng của bạn được miễn phí giao hàng tiêu chuẩn!</>
        )}
      </p>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
