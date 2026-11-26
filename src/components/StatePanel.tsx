import type { ReactNode } from 'react'

export function ErrorPanel({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="state-panel error-panel" role="alert">
      <h3>Không tải được sản phẩm</h3>
      <p>{message ?? 'Đã có lỗi xảy ra.'}</p>
      <button className="button button-dark" onClick={onRetry}>
        Thử tải lại
      </button>
    </div>
  )
}

export function EmptyPanel({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="state-panel">
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
