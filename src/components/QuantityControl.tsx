export function QuantityControl({
  value,
  label,
  onDecrease,
  onIncrease,
  min = 1,
  max = 99,
}: {
  value: number
  label: string
  onDecrease: () => void
  onIncrease: () => void
  min?: number
  max?: number
}) {
  return (
    <div className="quantity-control">
      <button
        type="button"
        aria-label={`Giảm số lượng ${label}`}
        disabled={value <= min}
        onClick={onDecrease}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label={`Tăng số lượng ${label}`}
        disabled={value >= max}
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  )
}
