# NorthStar Market

Cửa hàng trực tuyến (demo) viết bằng **React 19, TypeScript, Redux Toolkit,
React Router và Vite**. Sản phẩm được tải từ
[Fake Store API](https://fakestoreapi.com/products) và quy đổi sang VNĐ theo tỷ
giá cố định 1 USD = 25.000 ₫.

## Chạy ứng dụng

```sh
npm install
npm run dev
```

## Kiểm tra & build

```sh
npm run lint
npm run build     # kết quả nằm trong thư mục dist/
npm run preview   # xem thử bản build
```

Ứng dụng dùng `HashRouter` nên bản build trong `dist/` chạy được trên mọi hosting
tĩnh (GitHub Pages, Netlify, Vercel...) mà không cần cấu hình rewrite.

## Các trang

| Đường dẫn          | Nội dung                                                        |
| ------------------ | --------------------------------------------------------------- |
| `/`                | Trang chủ: banner, cam kết, danh mục, sản phẩm nổi bật, ưu đãi |
| `/shop`            | Danh sách sản phẩm: tìm kiếm, lọc danh mục/khoảng giá, sắp xếp |
| `/product/:id`     | Chi tiết sản phẩm, chọn số lượng, mua ngay, sản phẩm liên quan  |
| `/cart`            | Giỏ hàng, mã giảm giá, phương thức giao hàng, tóm tắt đơn       |
| `/checkout`        | Form thông tin nhận hàng có kiểm tra dữ liệu, chọn thanh toán   |
| `/order/:id`       | Xác nhận đơn hàng                                               |
| `/orders`          | Lịch sử đơn hàng                                                |
| `/wishlist`        | Danh sách yêu thích                                             |

## Tính năng

- Tìm kiếm từ thanh header; bộ lọc và sắp xếp được lưu trên URL (chia sẻ được).
- Giỏ hàng, danh sách yêu thích và lịch sử đơn hàng được lưu trong `localStorage`
  và kiểm tra hợp lệ khi khôi phục.
- Mã giảm giá `NORTHSTAR10` (10%) và `SPECIAL20` (20%).
- Giao hàng tiêu chuẩn 30.000 ₫ (miễn phí cho đơn từ 1.000.000 ₫ sau giảm giá)
  hoặc giao nhanh 60.000 ₫. Giá đã bao gồm VAT.
- Thanh toán khi nhận hàng (COD) hoặc chuyển khoản (mô phỏng).
- Giao diện responsive, có trạng thái đang tải (skeleton), lỗi và thử lại.

> Đây là dự án demo: không kết nối cổng thanh toán, đơn hàng chỉ được lưu trên
> trình duyệt và không phát sinh giao dịch thật.

## Cấu trúc thư mục

```
src/
  components/   Header, Footer, ProductCard, OrderSummary, Icons...
  features/     Redux slices: products, cart, wishlist, orders
  lib/          Định dạng tiền/ngày, tính giá, lưu trữ localStorage
  pages/        Các trang của cửa hàng
  store.ts      Cấu hình store + middleware lưu dữ liệu
```
