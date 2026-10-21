# Bản đồ source frontend Eatzy

Đây là monorepo web: 5 ứng dụng Next.js dùng chung các package TypeScript.
Tài liệu này mô tả source tại thời điểm thiết lập agent; khi code thay đổi, đọc
file thực tế trước khi quyết định.

## Các app

| Thư mục | Người dùng | Cổng dev | Nhóm chức năng |
|---|---|---:|---|
| `apps/customer` | Khách hàng | 3000 | Khám phá nhà hàng, giỏ hàng, đặt món, theo dõi đơn, chat, hồ sơ, ví |
| `apps/driver` | Tài xế | 3001 | Onboarding, online/offline, nhận đơn, bản đồ, giao hàng, chat, thu nhập |
| `apps/restaurant` | Nhà hàng | 3002 | Nhận/xử lý đơn, thực đơn, cửa hàng, lịch sử, báo cáo, ví |
| `apps/super-admin` | Quản trị hệ thống | 3003 | Dashboard, khách hàng, tài xế, nhà hàng, khuyến mãi, tài chính, cấu hình |
| `apps/admin` | Quản trị | 3004 | Dashboard, users/roles/permissions, đơn hàng, danh mục và các màn quản trị khác |

`src/app` tổ chức route và layout bằng App Router. Các nhóm `(public)`,
`(protected)`, `(normal)` không xuất hiện trong URL. Tên `(protected)` tự nó
không kiểm tra quyền; cần đọc AuthInitializer, layout và quyền backend.

`src/features/<domain>` chứa hooks, components và logic theo nghiệp vụ.
`src/components` chứa phần giao diện riêng của app; `src/store` có state riêng
như địa điểm giao hàng của khách hàng. Đừng chỉ đọc `page.tsx`: một số trang
auth trả `null` vì nội dung thật được dựng trong layout và `*PageContent.tsx`.

## Các package dùng chung

| Package | Vai trò và điểm cần nhớ |
|---|---|
| `packages/api` | Axios client, endpoint functions, mapper của restaurant/order/wallet |
| `packages/types` | DTO/request/response, phân trang, trạng thái và kiểu nghiệp vụ |
| `packages/models` | Một số model hiển thị riêng; không thay thế toàn bộ DTO trong `types` |
| `packages/store` | Zustand auth/cart; auth chỉ persist user, cart còn giữ active restaurant |
| `packages/socket` | STOMP/SockJS provider, chat, order notifications, vị trí tài xế |
| `packages/hooks` | Hook dùng chung, gồm browser geolocation, scroll/infinite scroll |
| `packages/lib` | QueryProvider, form/Zod, currency/time helpers |
| `packages/ui` | Tokens/themes, primitive, form, navigation, modal, feedback/shimmer, tables |
| `packages/fonts` | Font dùng chung trên web |
| Các package còn lại | `config`, `mappers`, `middleware`, `utils`, `validation`, ESLint/TS config; đọc exports và caller trước khi dùng |

## Một request đi qua đâu?

Ví dụ thêm món vào giỏ:

```text
customer route/component
  → features/cart/hooks/useCart.ts (TanStack Query/mutation)
  → packages/api/src/cart.ts
  → packages/api/src/http.ts
  → /api/proxy/api/v1/...
  → apps/customer/next.config.mjs rewrite
  → API Gateway :8080 → backend service
```

`http.ts` trả body của AxiosResponse. Body thường vẫn có cấu trúc
`{statusCode, message, data}` theo `packages/types/src/backend.ts`.
Sau mutation, hook vô hiệu hóa query liên quan để cập nhật giao diện.
Giỏ hàng đang dùng backend, không phải chỉ mảng `items` của Zustand.

## Đăng nhập và realtime

`features/auth/hooks/useLogin.ts` gọi auth API, xóa cache Query khi đổi tài khoản,
đặt access token vào bộ nhớ của HTTP client rồi cập nhật user trong store.
`packages/store/src/auth.ts` chỉ persist user bằng localStorage. Khi token hết
hạn, HTTP client gọi `GET /api/v1/auth/refresh` cùng cookie rồi thử lại request.
Sửa cơ chế này cần kiểm tra cả reload, logout, refresh thất bại và đổi tài khoản.

`packages/socket/src/socket-client.ts` mở SockJS + STOMP, gửi bearer token trong
CONNECT headers. Provider/hook quản lý subscribe/unsubscribe. Những destination
đang dùng gồm `/user/queue/orders`, chat theo order, `/app/chat/{orderId}`,
`/app/typing/{orderId}` và `/app/driver/location`. Khi sửa cần đối chiếu backend
communication-service, không suy từ REST endpoint ra tên STOMP destination.

Tài xế còn polling đơn mỗi 5 giây trong
`apps/driver/src/features/orders/hooks/useOrderOffers.ts`. Không được giả định
toàn bộ cập nhật đơn đã chạy qua WebSocket.

## Thiết kế giao diện

`packages/ui/src/tokens/colors.ts` định nghĩa primary `#78C841`, secondary
`#B4E50D`, warning `#FF9B2F`, danger `#FB4141`; themes đặt CSS variables.
Tailwind từng app quét source app và package UI. Giao diện dùng Framer Motion,
Lucide, nhiều drawer/modal, navigation cho màn nhỏ và shimmer khi tải.

Để sửa một màn, tìm cả route, hook và component được route import. Một thay đổi
trong `packages/ui` có thể ảnh hưởng cả 5 app; kiểm tra những nơi dùng component
đó. Web map dùng Mapbox GL/react-map-gl và browser GPS. PWA dùng Serwist/service
worker; stale cache có thể làm trình duyệt hiển thị code cũ sau khi restart.

## Cấu hình, kiểm tra và CI

- `next.config.mjs` của từng app rewrite API; `BACKEND_URL` override server-side
  gateway. Dev mặc định `127.0.0.1:8080`, production mặc định server đang dùng.
- Socket customer/driver dùng `NEXT_PUBLIC_WS_URL`; giá trị public được đưa vào
  client khi build. Đổi env xong cần restart/rebuild phù hợp.
- `turbo.json` đưa hai biến trên vào `globalEnv` để truyền vào task và cache key.
- `pnpm dev`, `build`, `lint`, `check-types` là các task gốc. `check-types` cũ
  chỉ chạy ở package có khai báo script đó, chưa bao phủ app.
- Các Next config hiện bỏ qua lint và TS errors khi build. Dùng
  `pnpm agent:check typecheck`/`lint` để nhìn thấy lỗi thật; xem
  [workflows.md](workflows.md) về phạm vi và cách lưu baseline.
- `.github/workflows/cicd.yml` build/push/deploy customer, driver, restaurant,
  super-admin khi push `main`; chưa có admin. Docker/server deployment là bước
  có tác động thật, không phải lệnh kiểm tra local.

Đối chiếu mobile theo [native-parity.md](native-parity.md). App native dùng chung
ý tưởng thiết kế và hợp đồng API, cần viết lại navigation/render/storage/location
theo nền tảng; không import trực tiếp component Next.js vào React Native.
