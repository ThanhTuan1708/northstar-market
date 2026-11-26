import { Link } from 'react-router-dom'
import { EmptyPanel } from '../components/StatePanel'

export function NotFoundPage() {
  return (
    <div className="page">
      <EmptyPanel
        title="404 · Không tìm thấy trang"
        action={
          <Link className="button button-dark" to="/">
            Về trang chủ
          </Link>
        }
      >
        Trang bạn tìm có thể đã được di chuyển hoặc không tồn tại.
      </EmptyPanel>
    </div>
  )
}
