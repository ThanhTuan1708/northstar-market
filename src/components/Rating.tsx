import type { ProductRating } from '../types'

export function Rating({ rating, compact = false }: { rating: ProductRating; compact?: boolean }) {
  const percent = Math.max(0, Math.min(100, (rating.rate / 5) * 100))

  return (
    <span
      className="rating"
      aria-label={`Đánh giá ${rating.rate.toFixed(1)} trên 5 từ ${rating.count} lượt`}
    >
      <span className="rating-stars" aria-hidden="true">
        <span className="rating-fill" style={{ width: `${percent}%` }}>
          ★★★★★
        </span>
        ★★★★★
      </span>
      <span className="rating-text" aria-hidden="true">
        {rating.rate.toFixed(1)}
        {!compact && ` (${rating.count})`}
      </span>
    </span>
  )
}
