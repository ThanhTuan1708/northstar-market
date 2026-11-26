import { Link } from 'react-router-dom'
import { StarMark } from './Icons'

export function Brand({ className = '' }: { className?: string }) {
  return (
    <Link className={`brand ${className}`} to="/" aria-label="NorthStar Market - trang chủ">
      <span className="brand-mark" aria-hidden="true">
        <StarMark />
      </span>
      <span className="brand-text">
        North<b>Star</b>
        <small>MARKET</small>
      </span>
    </Link>
  )
}
