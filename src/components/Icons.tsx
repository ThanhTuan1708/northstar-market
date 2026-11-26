import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const StarMark = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M12 1.5l1.9 7.1 7.1-1.6-5.2 5 5.2 5-7.1-1.6L12 22.5l-1.9-7.1L3 17l5.2-5L3 7l7.1 1.6z"
    />
  </svg>
)

export const SearchIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="10.8" cy="10.8" r="6.8" />
    <path d="m16 16 4.5 4.5" />
  </svg>
)

export const BagIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
)

export const HeartIcon = ({ filled, ...props }: IconProps & { filled?: boolean }) => (
  <svg {...base} fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />
  </svg>
)

export const MenuIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const CloseIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const TruckIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
)

export const ReturnIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 9h11a5 5 0 0 1 0 10H8" />
    <path d="M8 5 4 9l4 4" />
  </svg>
)

export const ShieldIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

export const ChatIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 5h14v10H9l-4 4z" />
  </svg>
)

export const ArrowRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const CheckIcon = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
)
