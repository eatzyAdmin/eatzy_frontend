# Đối chiếu web → React Native

Nguồn web là repo này, đích là repo `eatzy_mobile` bên cạnh khi có sẵn. Danh mục
dưới đây được đọc từ route, hook và submit handler; chưa xác minh mọi thao tác
bằng tài khoản thật. Dùng nó làm bản đồ tham chiếu, cập nhật trạng thái sau khi
tích hợp và thử nghiệm. Không gắn nhãn native “hoàn tất” chỉ vì đã có màn hình.

Quy ước: **API** = có mã gọi backend; **hỗn hợp** = có API cùng phần demo/local;
**demo** = hành vi mô phỏng hoặc placeholder; **chuyển hướng** = không phải màn
nghiệp vụ riêng. API không đồng nghĩa đã kiểm thử end-to-end thành công.

## Customer

Root route chuẩn: `apps/customer/src/app`. `P` dưới đây là `(protected)/(normal)`.
Các route auth được `(public)/layout.tsx` dựng từ `*PageContent.tsx`; đừng đánh
giá bằng `page.tsx` trả `null` đơn lẻ.

| URL / route source | Domain / tham chiếu | Trạng thái source và việc native cần làm |
|---|---|---|
| `/login` → `(public)/login` | `features/auth/hooks/useLogin.ts`, `useAuth.ts` | API login/account/refresh; native session adapter, role và account isolation |
| `/register` → `(public)/register` | `components/auth/RegisterForm.tsx` | Demo: timeout, OTP giả và log form; không có tích hợp tạo tài khoản trong submit đang đọc |
| `/forgot-password` → `(public)/forgot-password` | `ForgotPasswordPageContent.tsx` | Demo: setIsSent từ email; chưa gửi reset email qua API |
| `/home` → `P/home/page.tsx` | `features/home/hooks/useHomePage.ts`, `search/hooks`, `restaurant/hooks/useNearbyRestaurants.ts` | API categories/restaurant/search; giữ bộ lọc, location, phân trang/loading/empty/error |
| `/restaurants/[slug]` → `P/restaurants/[slug]` | `features/restaurant`, `features/cart/hooks/useCart.ts` | API menu/detail/options/reviews/vouchers/cart; kiểm tra chuyển ID/slug và lựa chọn món |
| `/checkout` → `(protected)/checkout` | `checkout/hooks/useCheckout.ts`, `useCreateOrder.ts` | API cart/fee/voucher/order; VNPAY trả URL rồi redirect browser; native payment return cần thiết kế/kiểm chứng riêng |
| `/favorites` → `P/favorites` | `features/favorites/hooks/useFavorites.ts` | API danh sách/thay đổi yêu thích; giữ invalidation và empty state |
| `/order-history` → `P/order-history` | `features/orders/hooks/useOrderHistory.ts`, `useOrderDetail.ts` | API lịch sử/detail; giữ pagination/filter và quyền theo tài khoản |
| `/orders/[id]/review` → `P/orders/[id]/review` | `features/orders/hooks/useReview.ts` | API review; giữ điều kiện trạng thái đơn và gửi review một lần |
| `/messages` → `P/messages` | `features/messages/hooks`, `packages/socket` | API lịch sử + STOMP chat/typing; native reconnect, unsubscribe và foreground |
| `/profile` → `P/profile` | `features/profile/hooks/*`, `data/mockProfileData.ts` | Hỗn hợp: API user/customer/addresses/wallet nhưng display merge mock profile; không coi membership/avatar dự phòng là dữ liệu thật |
| `/booking` → `P/booking` | `page.tsx` | Placeholder trả null; chưa có booking flow hoàn chỉnh tại route |
| `/` → `app/page.tsx` | landing components | Trang web/marketing; không tự đưa vào core native flow |
| `/test-notification`, `/test-magazine` | app test pages | Màn thử thiết kế/dev; không tính vào parity nghiệp vụ mặc định |

Giỏ, current orders, địa điểm giao hàng và ví còn mở bằng drawer/modal trên
những route trên. Tham chiếu `features/cart`, `features/location`,
`features/orders/hooks/useCurrentOrders.ts`, `features/wallet`,
`features/profile/hooks/useCustomerWalletTransactions.ts`; không chỉ đếm URL.

## Driver

Root: `apps/driver/src/app`; `P` = `(protected)/(normal)`.

| URL / route source | Domain / tham chiếu | Trạng thái source và việc native cần làm |
|---|---|---|
| `/login` → `(public)/login` | `features/auth/hooks/*` | API auth; xác minh role và session sau app restart |
| `/register`, `/onboarding` → `(public)` | `features/onboarding/store/useOnboardingStore.tsx`, `steps/OtpStep.tsx` | Demo onboarding: state React, OTP mô phỏng, submit timeout rồi chuyển pending-review; chưa phải quy trình KYC backend |
| `/pending-review` → `(protected)/pending-review` | onboarding UI | Màn chờ trong flow trên; xác minh API duyệt trước khi báo tính năng hoàn chỉnh |
| `/home` → `P/home` | `features/online/hooks/useDriverStatus.ts`, `orders/hooks/useOrderOffers.ts`, `map/DriverMapView.tsx` | API online/order offers, polling 5s; map/browser GPS; native cần quyền vị trí và accept/reject/timeout thực |
| Current order panel trên `/home` | `features/orders/components/CurrentOrderPanel.tsx`, `packages/api/src/order/order.api.ts` | API pickup/arrive/deliver; giữ trạng thái backend, không suy transition từ nhãn UI |
| `/history` → `P/history` | `features/history/hooks/useDriverOrderHistory.ts`, `useOrderDetail.ts` | API lịch sử/detail/earnings; giữ commission/null và filter |
| `/wallet` → `P/wallet` | `features/wallet/hooks/*` | API wallet/transactions; không dùng thao tác tiền thật làm smoke test |
| `/messages` → `P/messages` | `features/messages/hooks/*`, `packages/socket` | API + STOMP theo order; quản lý vòng đời chat khi đơn kết thúc/đổi account |
| `/profile` → `P/profile` | `features/profile/hooks/useDriverProfile.ts` | API profile; kiểm chứng upload/các field cập nhật trên thiết bị |
| `/settings` → `P/settings` | `useDriverProfile`, state trong page | Hỗn hợp: profile API nhưng autoAccept là local state; không khẳng định đã lưu tùy chọn này trên server |

Vị trí live: `packages/socket/src/hooks/useDriverLocationUpdate.ts` dùng
`navigator.geolocation.watchPosition`, gửi `/app/driver/location` mỗi 20s khi
available/connected. Native phải có adapter quyền GPS, ngừng theo dõi đúng lúc,
chính sách background hợp lệ và không gửi tọa độ giả khi chưa có vị trí.

## Restaurant

Root: `apps/restaurant/src/app`; `P` = `(protected)/(normal)`.

| URL / route source | Domain / tham chiếu | Trạng thái source và việc native cần làm |
|---|---|---|
| `/login` → `(public)/login` | `features/auth/hooks/*` | API auth và restaurant ownership |
| `/orders` → `P/orders` | `features/orders/hooks/useRestaurantOrders.ts`, `store/hooks/useRestaurantStatus.ts` | API accept/reject/ready/open-close; nhóm pending/inprogress/waiting chỉ là cách hiển thị |
| `/menu` → `P/menu` | `features/menu/hooks/useMenu.ts`, `useMenuCategories.ts` | API dishes/categories/options; giữ validation, upload và permission |
| `/history` → `P/history` | `features/history/hooks/*` | API lịch sử/detail; kiểm tra lọc, số tiền và trạng thái |
| `/store` → `P/store` | `features/store/hooks/*`, `components/StoreLocationMap.tsx` | API thông tin/trạng thái/commission/reviews; browser map cần native adapter |
| `/profile` → `P/profile` | `features/profile/hooks/useUserProfile.ts` | API user/profile, responsive sections |
| `/wallet` → `P/wallet` | `features/wallet/hooks/*` | API ví/giao dịch; giữ phân trang và hành vi lỗi |
| `/reviews` → `P/reviews` | `features/store/hooks/useReviews.ts` và page | Có API reviews; xác minh riêng phản hồi review và các hành động trước khi port |
| `/reports` → `P/reports` | `features/reports/hooks/useDashboardReport.ts`, `useRevenueReport.ts`, `useOrdersReport.ts`, `useMenuReport.ts`, `useReviewsReport.ts` | Hỗn hợp: report hooks gọi API; nút export còn TODO tích hợp |
| `/finances` → `P/finances` | page gọi router.replace('/reports') | Chuyển hướng sang reports, không phải module tài chính độc lập |
| `/promotions` → `P/promotions` | page.tsx | Placeholder chỉ có dòng “Trang Khuyến mãi”; không lấy super-admin promotions để giả định restaurant đã có API flow |

Super-admin/admin vẫn là web: có thể dùng làm tham chiếu hợp đồng/quyền, chưa nằm
trong 3 vai trò mobile đã yêu cầu.

## Giữ được gì, phải viết lại gì?

| Có thể tham chiếu/tách logic thuần | Cần adapter hoặc viết lại cho native |
|---|---|
| Wire DTOs, enum, pagination, pure mapper/schema/time/currency | Axios baseURL tuyệt đối; `/api/proxy` của Next không tồn tại trên thiết bị |
| Query keys, invalidation, lọc/sắp xếp và tính toán nghiệp vụ | Session/cookie refresh, secure storage, navigation khi hết phiên |
| Color tokens, hierarchy, nội dung, hình/icon được phép dùng | DOM/Tailwind CSS variables/Framer Motion web, Next routing/image/font |
| REST paths, STOMP destinations và payload | Native WebSocket/STOMP transport và app lifecycle |
| Mô hình địa điểm/cart/order | GPS permissions/background, map SDK, image upload/camera |
| Payment URL mà backend trả | Mở browser/payment flow + deep link return; xác minh trạng thái bằng server |

Không sao chép token Mapbox đã nhúng vào source; cấu hình public token đúng ứng
dụng, không nhầm public token với secret. Không persist access/refresh token
vào AsyncStorage bằng cách thay cơ học localStorage. Đọc hợp đồng refresh backend
trước, dùng kho lưu trữ an toàn cho vật liệu xác thực cần lưu trên thiết bị.

Một màn native cần được đánh giá riêng: thiết kế, API, auth/quyền, trạng thái
tải/rỗng/lỗi, keyboard/safe-area/back, reconnect và thiết bị/emulator. Đánh dấu
“chưa kiểm chứng” khi thiếu account, backend capability hoặc thiết bị; UI mock
phải thể hiện đúng trạng thái tích hợp, không tạo cảm giác thanh toán/OTP/KYC thật.
