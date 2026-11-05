# Eatzy web → mobile: thay đổi API và hợp đồng tích hợp

Ngày bàn giao: 05/11/2026. Đối chiếu với source backend/frontend trên nhánh `work/from-main`, so với `main` local trước bàn giao. Đây là hướng dẫn chuyển đổi cho team mobile; không yêu cầu dùng lại React hook hoặc model giao diện web. Các ví dụ ID chỉ minh họa, phải lấy ID thật từ API/seed.

## 1. Các việc mobile cần cập nhật trước

| Phần | Thay đổi cần mang sang mobile |
|---|---|
| HTTP/auth | Bearer trong request nghiệp vụ; refresh cookie HttpOnly xoay vòng; dùng chung một promise refresh cho các request 401; không retry request tài khoản cũ bằng token tài khoản mới |
| Tạo đơn | Bắt buộc `Idempotency-Key`; giữ nguyên key khi retry cùng một lần đặt đơn; hỗ trợ 202 và `workflowStatus` |
| Danh sách đơn | Các API theo customer/driver/restaurant ID dùng page object, không còn mặc định xử lý như mảng |
| Hủy/từ chối | Lý do ở query `reason`, body `{}` |
| Review | Dùng API phân trang; ưu tiên target ID thay tên hiển thị |
| Món/tùy chọn | Wire field Java khác model UI; giữ ID, `isAvailable`, số 0 và tính phân biệt giữa omitted/null |
| Giỏ | Thay toàn bộ giỏ trong POST; option IDs không trùng; chỉ gộp dòng khi dish và option set giống nhau |
| Yêu thích | Danh sách phân trang, filter theo nhà hàng; không chỉ đọc trang đầu rồi suy ra toàn bộ trạng thái |
| Driver KYC | Hồ sơ đã duyệt và revision chờ duyệt riêng; gửi base/version; xử lý 409 bằng reload |
| Socket | JWT ở CONNECT; chờ CONNECTED, hủy đăng ký đúng owner, đăng ký lại sau reconnect/token change |
| Báo cáo | Một số trường không có dữ liệu là `null`, không tự hiển thị thành 0 |

## 2. Base URL, response và kiểu dữ liệu

- Web gọi `/api/proxy/api/v1/...`; đây là proxy của Next. **Mobile gọi Gateway trực tiếp**: `http(s)://<backend-host>:8080/api/v1/...`, không thêm `/api/proxy`.
- Android emulator thường đến máy dev qua `10.0.2.2:8080`; máy thật dùng IP LAN của máy chạy Docker và mở firewall thích hợp. `localhost` trên điện thoại là điện thoại. HTTPS/cookie Secure cần được cấu hình và test trên thiết bị thật.
- Response Java có dạng `{statusCode,error,message,data}`. Axios web trả HTTP body qua interceptor; mobile cần tự unwrap đúng **một lần** từ body. `message` có thể là chuỗi hoặc mảng lỗi validation; `data` có thể null.
- ID wire thường là JSON number; nhiều ID trong model UI web là string để render. Không đổi field backend thành string chỉ vì UI web làm vậy. Tiền là `BigDecimal` ở server; không tự tính/sửa giá để vượt validation. Thời gian thường ISO-8601, ngày giấy tờ `YYYY-MM-DD`.

```json
{
  "statusCode": 200,
  "error": null,
  "message": "...",
  "data": {
    "meta": { "page": 1, "pageSize": 20, "total": 42, "pages": 3 },
    "result": []
  }
}
```

Page HTTP bắt đầu từ **1**, size nên 20 và không quá 100. Hook/UI KYC dùng index từ 0 nhưng adapter đã chuyển thành `page + 1` trước khi gửi HTTP. Mobile gọi trực tiếp thì dùng page 1, 2, 3. Encode query bằng URL/query builder; không nối trực tiếp nội dung người dùng vào filter expression.

Lỗi thường gặp: 400 input/validation, 401 token/phiên không hợp lệ, 403 thiếu role/quyền sở hữu, 409 xung đột version/idempotency, 413 tập dữ liệu quá giới hạn, 429 admission/rate limit, 503 dependency chưa sẵn sàng. Không retry mù mọi 4xx; không coi response 2xx là bằng chứng thanh toán đã hoàn tất.

## 3. Đăng nhập, refresh và quyền

| Method/path | Input và output |
|---|---|
| `POST /api/v1/auth/login` | Body `{username,password}`; username là email. Đọc `data.access_token`, `data.user`; nhận cookie `refresh_token` |
| `GET /api/v1/auth/account` | Bearer access token; trả `data.user` |
| `GET /api/v1/auth/refresh` | Gửi cookie, **không gửi bearer cũ**; đọc access token mới và lưu Set-Cookie mới |
| `POST /api/v1/auth/logout` | Bearer hiện tại; backend thu hồi session và xóa cookie |
| `POST /api/v1/auth/register` | Đăng ký mới; public registration chỉ cấp CUSTOMER, không cho client tự chọn ADMIN |

Access token không được persist trong Zustand/localStorage của web; chỉ user info được persist. Mobile cần quyết định kho credential và cookie jar phù hợp nền tảng, không copy Zustand/Next proxy. Refresh cookie là HttpOnly, Secure, Path `/`; không có refresh token trong JSON. Nếu RN networking không giữ/gửi Set-Cookie đúng, refresh sẽ thất bại dù login thành công. **Chưa có bằng chứng tích hợp cookie trên repo mobile mới.**

Backend hiện giữ một session cho mỗi user; login ở nơi khác có thể thu hồi phiên cũ của cùng user. Khi nhiều request 401, chỉ gọi refresh một lần, cho request còn lại chờ; lỗi refresh phải reject tất cả. Response refresh cũ không được ghi đè lần login mới; request của user A không được retry dưới danh tính B. Xem `packages/api/src/http.ts` và `scripts/test-http-refresh.cjs`.

Quyền hiện mint theo tên role `CUSTOMER`, `DRIVER`, `RESTAURANT`, `ADMIN`, chưa phải engine permission đầy đủ từ bảng `permission_role`. ADMIN không mặc nhiên kế thừa toàn bộ nghiệp vụ. Tạo đơn yêu cầu CUSTOMER; online/offline/my-profile yêu cầu DRIVER. API `orders/my-customer` chấp nhận CUSTOMER hoặc ADMIN nhưng chỉ đọc đơn của ID trong JWT. Các API khác vẫn kiểm tra owner/participant, trạng thái, giới hạn ví/KYC.

Local web nhiều cổng trên localhost dùng chung tên refresh cookie; mở nhiều app khác role trong cùng browser profile có thể lẫn phiên sau refresh/reload. Dùng browser profile riêng khi test; **chưa triển khai cookie namespace theo app**. Đây không phải lỗi dữ liệu role cần chữa bằng cách gán tất cả user thành ADMIN.

## 4. Đơn hàng: idempotency, Saga và phân trang

### Tạo đơn

`POST /api/v1/orders`, role CUSTOMER. Header `Idempotency-Key`: 16–100 ký tự `[A-Za-z0-9_-]`; UUID phù hợp. React Native cần UUID provider phù hợp nền tảng, không mặc định có `crypto.randomUUID()` như browser. Scope theo customer. Cùng key/cùng payload là retry; cùng key/payload khác trả 409. Không tạo key mới mỗi lần retry mạng. Payload thay đổi thực sự thì là một lần đặt khác.

```json
{
  "customer": { "id": 18 },
  "restaurant": { "id": 1 },
  "vouchers": [],
  "deliveryAddress": "Dia chi giao hang test",
  "deliveryLatitude": 10.77,
  "deliveryLongitude": 106.69,
  "specialInstructions": "",
  "deliveryFee": 15000,
  "paymentMethod": "COD",
  "orderItems": [
    {
      "dish": { "id": 1 },
      "quantity": 1,
      "orderItemOptions": [{ "menuOption": { "id": 42 } }]
    }
  ]
}
```

Customer ID phải khớp user đang đăng nhập; không cho đặt hộ bằng cách sửa ID. Dish/option phải thuộc nhà hàng/món, có sẵn, đúng min/max. Tối đa 100 dòng, quantity mỗi dòng 1–100, tối đa 30 option/dòng và không trùng ID, tối đa 10 voucher. Giá được server kiểm tra/tính lại; đừng gửi các field nội bộ như driver, paymentStatus, workflowStatus để điều khiển luồng.

Lấy phí trước bằng `POST /api/v1/orders/delivery-fee` với `{restaurantId,deliveryLatitude,deliveryLongitude}`. `deliveryFee` trong ví dụ chỉ minh họa; dùng giá quote thực tế. Route provider có thể trả 503; không tự bịa khoảng cách/phí khi provider hỏng.

Backend trả 201 khi workflow ACTIVE hoặc 202 khi còn xử lý. Client web chấp nhận 200/201/202 để tương thích. Order DTO thêm **`workflowStatus`**, bên cạnh `orderStatus` và `paymentStatus`. `REQUIRES_REVIEW` hoặc REJECTED phải hiện tình trạng cần kiểm tra/lý do; không báo đã thu/hoàn tiền. Poll `GET /api/v1/orders/{id}`/danh sách và nghe notification để theo dõi kết quả.

`vnpayPaymentUrl` có thể null; VNPay sandbox hiện tạm gác, không có bằng chứng end-to-end mới. `vouchers[].code` có thể null. Dòng đơn trả `id`, `quantity`, `priceAtPurchase`, `dish:{id,name,price}`, `orderItemOptions`. Option trả `id`, `menuOption:{id,name,priceAdjustment}` và có thể thêm `optionName`, `priceAtPurchase` từ snapshot. Backend mapper dùng snapshot mua hàng khi có, không yêu cầu danh mục live luôn tồn tại. Đừng suy ra field ảnh của order item từ model dish UI. Dùng `packages/types/src/order-api.ts` và DTO Java làm đối chiếu, không dùng model giao diện làm wire schema.

### Danh sách và thao tác

| Trước | Hiện tại |
|---|---|
| Xử lý `/orders/customer/{id}`, `/driver/{id}`, `/restaurant/{id}` như mảng | Đọc `data.result` và `data.meta`, gửi `page,size,filter` |
| `/orders/customer/{id}/status/{status}` | Dùng `/orders/customer/{id}?filter=orderStatus:'READY'` |
| Body `{cancellationReason}` khi hủy/từ chối | Body `{}`, query `reason=<lý do đã encode>` |

Endpoint theo actor hiện tại:

- `GET /api/v1/orders/my-customer`, `/my-driver`, `/my-restaurant` với `page,size,filter`.
- `PATCH /api/v1/orders/{id}/customer/cancel?reason=...`.
- `PATCH /api/v1/orders/{id}/restaurant/reject?reason=...`.
- Nhận/ready/nhận đơn tài xế/lấy/giao dùng endpoint actor cụ thể trong phụ lục, không PATCH tùy ý `orderStatus`. Các đường cập nhật trạng thái tổng quát cũ bị từ chối.

Ví dụ filter nhiều trạng thái: `orderStatus:'PENDING' or orderStatus:'PREPARING'`. Các trạng thái frontend helper chấp nhận: PENDING, PREPARING, DRIVER_ASSIGNED, READY, PICKED_UP, ARRIVED, DELIVERED, REJECTED. Không suy ra PLACED là trạng thái Java hợp lệ từ comment cũ. Sử dụng equality cho enum thay vì tìm chuỗi gần đúng.

## 5. Món và tùy chọn: giữ đúng wire field

| Wire Java/backend | Model UI web |
|---|---|
| `menuOptionGroups` | `optionGroups` |
| `groupName` | `title` |
| `minChoices`, `maxChoices` | `minSelect`, `maxSelect` |
| `menuOptions` | `options` |
| `priceAdjustment` | `price` của option |
| `isAvailable` | `isAvailable`, phải giữ qua read → edit → write |
| `availabilityQuantity` | Số tồn kho; 0 là giá trị hợp lệ |

`required` UI được suy ra từ minimum, không gửi `required` để thay cho minChoices. Response có thể có `menuOptionGroupCount` để biết còn nhóm chưa được tải đầy đủ. Lấy chi tiết khi cần customize/edit; danh sách không đảm bảo chứa mọi nhóm.

```json
{
  "id": 1,
  "name": "Mon test",
  "price": 60000,
  "availabilityQuantity": 10,
  "menuOptionGroups": [{
    "id": 2,
    "groupName": "Loai soi my",
    "minChoices": 1,
    "maxChoices": 1,
    "menuOptions": [{ "id": 42, "name": "Soi tron", "priceAdjustment": 0, "isAvailable": true }]
  }]
}
```

Endpoint và field category/restaurant dùng đúng request DTO của API tương ứng (`packages/api/src/restaurant/dish.api.ts` và mapper); ví dụ trên chỉ minh họa phần options. ID tạm do UI tạo phải thành null khi tạo mới; giữ ID persisted khi sửa. Không dùng `value || default` làm mất số 0, không tự bật lại option unavailable, không biến trường omitted thành false/0/null ngoài ý muốn. Giá hiển thị khác tiền server quyết định.

## 6. Giỏ và yêu thích

`POST /api/v1/carts` **thay toàn bộ items của giỏ customer + restaurant**, không phải append command. Customer được backend lấy từ JWT, không tin customer ID do client tự chọn.

```json
{
  "restaurant": { "id": 1 },
  "cartItems": [{
    "dish": { "id": 1 }, "quantity": 1,
    "cartItemOptions": [{ "menuOption": { "id": 42 } }]
  }]
}
```

Muốn thêm món, tải giỏ hiện tại và tạo snapshot replacement đúng. Cùng dish và **cùng tập option IDs** thì cộng quantity; khác lựa chọn là dòng riêng. Drawer web có cùng lựa chọn ở `variant`/`addons`/`groups`: phải deduplicate trước khi gửi; nếu cộng cả ba sẽ lỗi `Duplicate menu option`. Sửa nằm ở `features/cart/utils/cart-request.ts`.

Giỏ của một nhà hàng: web dùng `GET /api/v1/carts?page=1&size=1&filter=restaurantId:1`, đọc `data.result[0]` hoặc null, không tải tất cả giỏ để tìm. Backend scope theo owner. Giỏ rỗng bị xóa; reload sau lỗi response để xác định trạng thái vì write có thể đã commit trước lỗi enrich. Cart quote không đồng nghĩa reserve tồn kho; checkout tiếp tục kiểm tra lại.

Favorite: `GET /api/v1/favorites?page=1&size=20&sort=id,desc`, thêm filter `restaurantId : <id>` khi kiểm tra một nhà hàng. Đọc page và tải trang tiếp theo khi cần. Endpoint add/remove giữ nguyên trong `packages/api/src/favorite.ts`. UI favorites đã cập nhật paging và truyền restaurant ID khi kiểm tra trạng thái.

## 7. Review và báo cáo

| Endpoint GET mới/được ưu tiên | Query |
|---|---|
| `/api/v1/reviews/customer/{id}/paginated` | `page=1&size=20` |
| `/api/v1/reviews/order/{id}/paginated` | `page=1&size=20` |
| `/api/v1/reviews/target/paginated` | `reviewTarget=restaurant hoặc driver`, `targetName`, page/size |
| `/api/v1/reviews/target-id` | `reviewTarget`, **`targetId`**, page/size |

Response là page object. Legacy array vẫn tồn tại để tương thích nhưng bị giới hạn 100 kết quả; không dùng để kết luận không còn dữ liệu. Ưu tiên target ID vì nhiều nhà hàng/tài xế có thể trùng tên. Encode tên có tiếng Việt, `&`, `?` bằng query builder.

Create review body chính: `{order:{id},reviewTarget,rating,comment,targetName?}`; server lấy customer/target ID từ đơn, kiểm tra quyền và trạng thái. Rating 1–5. Không tự gán customer hoặc target ID khác để đánh giá hộ. Trường reply/status do owner/admin kiểm soát theo API, không gửi tùy ý trong create.

Báo cáo menu: `averageRating`, `reviewCount`, `trend`, `trendPercent` có thể null; summary review `averageResponseTime` có thể null. Hiện `packages/types/src/report.ts` và UI hiển thị thiếu dữ liệu riêng. Mobile không đổi null thành số liệu 0 hoặc trend giả. Giá trị nullable khác lỗi request.

## 8. Driver profile và KYC có phiên bản

Giữ nguyên casing wire: nhiều field KYC là snake_case qua `@JsonProperty`, trong khi `vehicleDetails`, `codLimit`, `completedTrips`, `averageRating`, `kycEligible`, `kycRevisionState` là camelCase. Tách user ID và driver profile ID; các endpoint revision dùng **profile ID**, không phải user ID.

| Method/path | Payload/response |
|---|---|
| `GET /driver-profiles/my-profile` | DTO riêng chủ hồ sơ; đọc `kycEligible`, `kycRevisionState` |
| `GET /driver-profiles/my-profile/status` | `data.status` |
| `POST /driver-profiles/go-online`, `/go-offline` | Body `{}`; role DRIVER |
| `POST /driver-profiles/{profileId}/kyc-revisions` | `{baseRevisionNumber,expectedVersion,documents}` |
| `GET /driver-profiles/{profileId}/kyc-revisions` | Lịch sử private, HTTP page bắt đầu 1, size 10 trong web |
| `GET /driver-kyc-revisions/pending` | ADMIN, HTTP page bắt đầu 1, size 20 |
| `POST /driver-profiles/{profileId}/kyc-revisions/{revisionId}/review` | ADMIN: `{expectedVersion,decision:"APPROVE" hoặc "REJECT",reason?}` |

Các path trên thêm prefix `/api/v1`. Driver đã duyệt sửa giấy tờ sẽ tạo bản riêng chờ duyệt, bản đang duyệt hợp lệ vẫn được dùng. Khi submit: `baseRevisionNumber = profile.kycRevisionState.activeRevisionNumber`; `expectedVersion = pendingRevision.lockVersion` hoặc null khi chưa có draft. Bản legacy chưa có revision dùng base 0. Không gửi toàn bộ DTO cũ để tránh đè status/earnings/counter.

`kycRevisionState`: `{activeRevisionNumber,legacyApproved,pendingRevision}`. Pending revision có `id,driverProfileId,revisionNumber,baseRevisionId,lockVersion,status,documents,submittedBy,submittedAt,reviewedBy,reviewedAt,reason,reviewSource`. Khi 409: reload hồ sơ/lịch sử và yêu cầu kiểm tra lại chỉnh sửa; không tự thay expectedVersion rồi ghi đè.

Allowlist `documents`:

```text
vehicleDetails, national_id_front, national_id_back, national_id_number, profile_photo,
driver_license_image, driver_license_number, driver_license_class, driver_license_expiry,
bank_name, bank_branch, bank_account_holder, bank_account_number, tax_code, bank_account_image,
vehicle_type, vehicle_brand, vehicle_model, vehicle_license_plate, vehicle_year,
vehicle_registration_image, vehicle_insurance_image, vehicle_insurance_expiry, vehicle_photo,
criminal_record_image, criminal_record_number, criminal_record_issue_date
```

Omitted = giữ giá trị, null = chủ động xóa nếu được phép, 0 không được làm mất. Không gửi approval flags/rejection reason/user/codLimit/reservedOrderId trong documents. `kycEligible`, `kycRevisionState` chỉ đọc. Admin sửa profile thông thường gửi patch field đã đổi + id, không replay counter/status từ DTO cũ. Xem `packages/api/src/driver-kyc.ts`.

Online yêu cầu vị trí, tài khoản/role active, hồ sơ đầy đủ và các nhóm giấy tờ approved/còn hạn. `Approved valid driver documents required` là validation lúc online. Offline chặn khi `reservedOrderId` khác null hoặc status BUSY. UI web hiện tính online theo AVAILABLE/UNAVAILABLE; đừng dựa duy nhất trạng thái nút để kết luận endpoint nào được gọi.

Đã quan sát một lỗi SQL concurrent snapshot khi offline trên MariaDB 12.1 (`Record has changed since last read`), chưa có bản sửa xác nhận. Thông báo 500 đó khác validation giấy tờ và không được mobile che thành “giấy tờ chưa duyệt”.

## 9. STOMP, chat và GPS

- SockJS endpoint Gateway: `/ws`. Native STOMP transport phải được kiểm tra trên nền tảng mobile; không giả định URL `/ws` là một raw WebSocket không cần SockJS negotiation.
- CONNECT header: `Authorization: Bearer <access-token>`. Không đặt JWT trong query URL; không log frame CONNECT/token.
- Đợi CONNECTED rồi đăng ký. Khi rớt transport, chuyển trạng thái disconnected; giữ ý định subscribe và đăng ký lại đúng một lần sau reconnect. Đổi token/account thì deactivate client cũ và dọn listener, không phát lại chat/GPS cũ.
- Nhiều màn hình cùng destination phải sở hữu listener riêng; unmount một màn hình không được unsubscribe listener của màn hình khác. Web đã sửa chung trong `packages/socket`.

| Loại | Destination |
|---|---|
| SUBSCRIBE đơn/thông báo | `/user/queue/orders`, `/user/queue/system` |
| SUBSCRIBE vị trí tài xế | `/user/queue/driver-location` |
| SUBSCRIBE chat/typing | `/user/queue/chat/order/{orderId}`, thêm `/typing` |
| SEND chat/typing | `/app/chat/{orderId}`, `/app/typing/{orderId}` |
| SEND GPS tài xế | `/app/driver/location`, payload `{latitude,longitude}` |

Chat/typing chỉ dành cho participant của đơn. GPS yêu cầu DRIVER và điều kiện online/đơn; user ID lấy từ session, không lấy từ payload. Đừng gửi GPS dày hơn khoảng 2 giây/lần. Backend cap payload 8 KiB và 64 subscriptions/session; xử lý lỗi quyền có thể đóng socket. Driver order polling 5 giây vẫn là kênh dự phòng, không chứng minh socket đã hoạt động.

## 10. File frontend đã thay đổi

- HTTP: `packages/api/src/http.ts` — refresh concurrency, timeout, account generation, không bearer tại credential endpoints.
- Orders: `packages/api/src/order/order.api.ts`, `packages/types/src/order-api.ts`, checkout hook/page và order-detail — idempotency, 202/workflow, paging, reason query, snapshot/nullable voucher code.
- Cart: `packages/api/src/cart.ts`, customer cart hook/helper và restaurant page — scoped read, deduplicate options, line identity theo option set.
- Catalog: dish/detail API, dish/restaurant mapper, `packages/types/src/menu.ts` — đúng field và giữ availability/count/zero/omitted.
- Favorites/reviews: API và hooks/pages, restaurant review/report UI — paging, stable target IDs, filter và nullable metrics.
- Driver: API/KYC helper, `packages/types/src/driver.ts`, driver profile/settings/KYC panel, super-admin driver queue/review/edit — revision và patch đúng version.
- Finance UI: nullable/khuyết dữ liệu lịch sử được hiển thị phù hợp; không coi giá trị fallback là ledger thật.
- Socket: `SocketProvider.tsx`, `socket-client.ts` — chờ kết nối/reconnect, ổn định callback, cleanup, không log CONNECT. Driver service worker bypass cache cho GET `/api/proxy/...`.
- Thêm test hợp đồng trong `scripts/test-*.cjs`; chạy bằng `pnpm test:http`, `test:cart`, `test:orders`, `test:reviews`, `test:dishes`, `test:driver-kyc`, `test:driver-profile`, `test:socket`.

## 11. Checklist team mobile

### API Python AI nếu mobile sử dụng

`POST /api/v1/ai/restaurants/{restaurant_id}/insights` dùng bearer; chỉ ADMIN hoặc chủ nhà hàng tương ứng. Service lấy tối đa 50 review liên kết theo target ID, trả `restaurant_id`, `restaurant_name`, `total_reviews_analyzed`, `scope`, `insights`; khi có kết quả phân tích có thêm `analysis:{summary,strengths,improvements,actions}`. Không gửi danh sách review/name từ client để thay nguồn dữ liệu tin cậy. Phải xử lý không có review, quota 429, bận/chưa cấu hình 503, upstream 502 và kết quả cache.

AI là FastAPI: response này **không dùng envelope Java**, lỗi thường ở `detail`. `GET /api/v1/ai/models` yêu cầu ADMIN; `health` chỉ liveness, `ready` kiểm tra dependency/cấu hình nhưng không gọi provider để chứng minh key còn quota. Chưa test provider trả phí trong lần bàn giao.

- [ ] Chọn backend URL đúng emulator/device; thử login và `/auth/account` để đối chiếu email/role thực tế.
- [ ] Test refresh sau reload/app restart/token expiry và nhiều request 401; logout/account switch không lẫn user.
- [ ] Map envelope/page đúng, test trang thứ hai và empty/null/error states.
- [ ] Menu detail giữ IDs, giá điều chỉnh, availability, min/max; không gửi option lặp.
- [ ] Tạo giỏ mới, tăng/giảm/xóa, cùng món khác lựa chọn; kiểm tra lại server response.
- [ ] Quote và tạo COD mới; retry cùng key, payload khác/key cũ trả 409; hỗ trợ 202/REQUIRES_REVIEW.
- [ ] Test restaurant → driver → delivered, kiểm tra role, owner và tiền/status thực tế.
- [ ] KYC submit/review đúng profile ID/base/version, test 409 và expired documents.
- [ ] Chat/GPS: CONNECT auth, reconnect, đổi token, nhiều màn hình cùng subscription, offline/online.
- [ ] Không gọi internal endpoints; không hardcode refresh token, internal credentials hoặc private signing key.

53 test frontend đã pass tại lần bàn giao; Java test build thành công. Typecheck: restaurant/admin pass; customer còn 37 lỗi cũ, driver 2, super-admin 76. Next build hiện cấu hình bỏ qua type/lint nên build thành công không đồng nghĩa chất lượng toàn repo sạch. Chưa xác nhận full flow trên mobile mới, VNPay thực tế hoặc tải 1.000 người dùng cho mọi API. Đây là giới hạn cần giữ trong kế hoạch chuyển đổi.

## 12. Phụ lục endpoint công khai theo source backend

Danh sách dưới đây lấy từ controller Java để tra tên đường dẫn; quyền nghiệp vụ/field chi tiết vẫn theo DTO và annotation trong source. `/internal/` được loại khỏi danh sách vì không dành cho mobile. Path được liệt kê không có nghĩa mọi role đều được gọi hoặc mọi endpoint cũ vẫn được hỗ trợ; `denyAll()` nghĩa là đã đóng.

<!-- ENDPOINT_INVENTORY -->

| Service | HTTP | Path | Gợi ý quyền (vẫn kiểm tra owner/business) |
|---|---|---|---|
| auth | DELETE | `/api/v1/addresses/me/{id}` | `Theo security/service/owner` |
| auth | DELETE | `/api/v1/addresses/{id}` | `Theo security/service/owner` |
| auth | DELETE | `/api/v1/customer-profile/me` | `Theo security/service/owner` |
| auth | DELETE | `/api/v1/customer-profiles/{id}` | `Theo security/service/owner` |
| auth | DELETE | `/api/v1/driver-profiles/{id}` | `hasRole('ADMIN')` |
| auth | DELETE | `/api/v1/permissions/{id}` | `Theo security/service/owner` |
| auth | DELETE | `/api/v1/roles/{id}` | `Theo security/service/owner` |
| auth | DELETE | `/api/v1/users/{id}` | `hasRole('ADMIN')` |
| auth | GET | `/.well-known/jwks.json` | `Theo security/service/owner` |
| auth | GET | `/api/v1/addresses` | `hasRole('ADMIN')` |
| auth | GET | `/api/v1/addresses/customer/{customerId}` | `hasRole('ADMIN')` |
| auth | GET | `/api/v1/addresses/me` | `Theo security/service/owner` |
| auth | GET | `/api/v1/addresses/me/{id}` | `Theo security/service/owner` |
| auth | GET | `/api/v1/addresses/{id}` | `hasRole('ADMIN')` |
| auth | GET | `/api/v1/auth/account` | `Theo security/service/owner` |
| auth | GET | `/api/v1/auth/refresh` | `Theo security/service/owner` |
| auth | GET | `/api/v1/customer-profile/me` | `Theo security/service/owner` |
| auth | GET | `/api/v1/customer-profiles` | `hasRole('ADMIN')` |
| auth | GET | `/api/v1/customer-profiles/user/{userId}` | `hasRole('ADMIN')` |
| auth | GET | `/api/v1/customer-profiles/{id}` | `hasRole('ADMIN')` |
| auth | GET | `/api/v1/driver-kyc-revisions/pending` | `hasRole('ADMIN')` |
| auth | GET | `/api/v1/driver-profiles` | `hasRole('ADMIN')` |
| auth | GET | `/api/v1/driver-profiles/count` | `hasAnyRole('ADMIN', 'INTERNAL_ORDER')` |
| auth | GET | `/api/v1/driver-profiles/my-profile` | `hasRole('DRIVER')` |
| auth | GET | `/api/v1/driver-profiles/my-profile/status` | `hasRole('DRIVER')` |
| auth | GET | `/api/v1/driver-profiles/user/{userId}` | `hasRole('ADMIN') or @authAccess.self(#userId)` |
| auth | GET | `/api/v1/driver-profiles/{id}` | `@authAccess.driverProfile(#id)` |
| auth | GET | `/api/v1/driver-profiles/{profileId}/kyc-revisions` | `@authAccess.driverProfile(#profileId)` |
| auth | GET | `/api/v1/email/check` | `Theo security/service/owner` |
| auth | GET | `/api/v1/permissions` | `Theo security/service/owner` |
| auth | GET | `/api/v1/roles` | `Theo security/service/owner` |
| auth | GET | `/api/v1/roles/{id}` | `Theo security/service/owner` |
| auth | GET | `/api/v1/users` | `hasRole('ADMIN') or @authAccess.self(#id) or hasAnyRole('INTERNAL_ORDER', 'INTERNAL_PAYMENT', 'INTERNAL_RESTAURANT', 'INTERNAL_COMMUNICATION', 'INTERNAL_INTERACTION', 'INTERNAL_CART')` |
| auth | GET | `/api/v1/users/email/{email}` | `hasRole('ADMIN') or @authAccess.self(#user.id)` |
| auth | GET | `/api/v1/users/role/{roleName}` | `Theo security/service/owner` |
| auth | GET | `/api/v1/users/{id}` | `hasRole('ADMIN') or @authAccess.selfEmail(#email) or hasAnyRole('INTERNAL_ORDER', 'INTERNAL_PAYMENT', 'INTERNAL_RESTAURANT', 'INTERNAL_COMMUNICATION', 'INTERNAL_CART', 'INTERNAL_INTERACTION')` |
| auth | POST | `/api/v1/addresses` | `hasRole('ADMIN')` |
| auth | POST | `/api/v1/addresses/me` | `Theo security/service/owner` |
| auth | POST | `/api/v1/auth/login` | `Theo security/service/owner` |
| auth | POST | `/api/v1/auth/logout` | `Theo security/service/owner` |
| auth | POST | `/api/v1/auth/register` | `Theo security/service/owner` |
| auth | POST | `/api/v1/customer-profile/me` | `Theo security/service/owner` |
| auth | POST | `/api/v1/customer-profiles` | `hasRole('ADMIN')` |
| auth | POST | `/api/v1/driver-profiles` | `hasAnyRole('ADMIN', 'DRIVER')` |
| auth | POST | `/api/v1/driver-profiles/go-offline` | `hasRole('DRIVER')` |
| auth | POST | `/api/v1/driver-profiles/go-online` | `hasRole('DRIVER')` |
| auth | POST | `/api/v1/driver-profiles/validate-drivers` | `hasRole('INTERNAL_ORDER')` |
| auth | POST | `/api/v1/driver-profiles/{profileId}/kyc-revisions` | `hasAnyRole('DRIVER','ADMIN') and @authAccess.driverProfile(#profileId)` |
| auth | POST | `/api/v1/driver-profiles/{profileId}/kyc-revisions/{revisionId}/review` | `hasRole('ADMIN')` |
| auth | POST | `/api/v1/email/resend` | `Theo security/service/owner` |
| auth | POST | `/api/v1/email/verify-otp` | `Theo security/service/owner` |
| auth | POST | `/api/v1/permissions` | `Theo security/service/owner` |
| auth | POST | `/api/v1/roles` | `Theo security/service/owner` |
| auth | PUT | `/api/v1/addresses` | `hasRole('ADMIN')` |
| auth | PUT | `/api/v1/addresses/me/{id}` | `Theo security/service/owner` |
| auth | PUT | `/api/v1/customer-profile/me` | `Theo security/service/owner` |
| auth | PUT | `/api/v1/customer-profiles` | `hasRole('ADMIN')` |
| auth | PUT | `/api/v1/driver-profiles` | `@authAccess.driverProfile(#driverProfile.id)` |
| auth | PUT | `/api/v1/driver-profiles/user/{userId}/increment-completed-trips` | `hasRole('INTERNAL_ORDER')` |
| auth | PUT | `/api/v1/driver-profiles/user/{userId}/status` | `hasRole('INTERNAL_ORDER')` |
| auth | PUT | `/api/v1/permissions` | `Theo security/service/owner` |
| auth | PUT | `/api/v1/roles` | `Theo security/service/owner` |
| auth | PUT | `/api/v1/users` | `hasRole('ADMIN')` |
| auth | PUT | `/api/v1/users/{id}/active` | `hasAnyRole('ADMIN', 'INTERNAL_PAYMENT', 'INTERNAL_ORDER')` |
| cart | DELETE | `/api/v1/carts/{id}` | `Theo security/service/owner` |
| cart | GET | `/api/v1/carts` | `Theo security/service/owner` |
| cart | GET | `/api/v1/carts/customer/{customerId}` | `Theo security/service/owner` |
| cart | GET | `/api/v1/carts/my-carts` | `Theo security/service/owner` |
| cart | GET | `/api/v1/carts/{id}` | `Theo security/service/owner` |
| cart | POST | `/api/v1/carts` | `Theo security/service/owner` |
| communication | GET | `/api/v1/chat/order/{orderId}` | `Theo security/service/owner` |
| communication | GET | `/api/v1/chat/order/{orderId}/count` | `Theo security/service/owner` |
| communication | GET | `/api/v1/chat/order/{orderId}/unread` | `Theo security/service/owner` |
| communication | PUT | `/api/v1/chat/order/{orderId}/read` | `Theo security/service/owner` |
| interaction | DELETE | `/api/v1/favorites/{id}` | `Theo security/service/owner` |
| interaction | DELETE | `/api/v1/reviews/{id}` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/favorites` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/favorites/my-favorites` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/favorites/{id}` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews/customer/{customerId}` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews/customer/{customerId}/paginated` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews/my-restaurant` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews/order/{orderId}` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews/order/{orderId}/paginated` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews/target` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews/target-id` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews/target/paginated` | `Theo security/service/owner` |
| interaction | GET | `/api/v1/reviews/{id}` | `Theo security/service/owner` |
| interaction | POST | `/api/v1/favorites` | `Theo security/service/owner` |
| interaction | POST | `/api/v1/interaction/batch-scores` | `Theo security/service/owner` |
| interaction | POST | `/api/v1/reviews` | `Theo security/service/owner` |
| interaction | PUT | `/api/v1/reviews` | `Theo security/service/owner` |
| order | DELETE | `/api/v1/orders/{id}` | `denyAll()` |
| order | GET | `/api/v1/earnings/driver/{driverId}/total` | `@orderAccess.self(#driverId)` |
| order | GET | `/api/v1/earnings/order/{orderId}` | `@orderAccess.read(#orderId)` |
| order | GET | `/api/v1/earnings/restaurant/{restaurantId}/total` | `@orderAccess.restaurant(#restaurantId)` |
| order | GET | `/api/v1/orders` | `hasRole('ADMIN')` |
| order | GET | `/api/v1/orders/customer/{customerId}` | `@orderAccess.self(#customerId)` |
| order | GET | `/api/v1/orders/driver/{driverId}` | `@orderAccess.self(#driverId)` |
| order | GET | `/api/v1/orders/driver/{driverId}/active` | `@orderAccess.self(#driverId)` |
| order | GET | `/api/v1/orders/my-customer` | `hasAnyRole('CUSTOMER','ADMIN')` |
| order | GET | `/api/v1/orders/my-driver` | `hasAnyRole('DRIVER','ADMIN')` |
| order | GET | `/api/v1/orders/my-restaurant` | `hasAnyRole('RESTAURANT','ADMIN')` |
| order | GET | `/api/v1/orders/my-restaurant/status/{status}` | `hasAnyRole('RESTAURANT','ADMIN')` |
| order | GET | `/api/v1/orders/restaurant/{restaurantId}` | `@orderAccess.restaurant(#restaurantId)` |
| order | GET | `/api/v1/orders/restaurant/{restaurantId}/date-range` | `@orderAccess.restaurant(#restaurantId)` |
| order | GET | `/api/v1/orders/restaurant/{restaurantId}/status/{status}` | `@orderAccess.restaurant(#restaurantId)` |
| order | GET | `/api/v1/orders/{id}` | `@orderAccess.read(#id)` |
| order | PATCH | `/api/v1/orders/{id}/assign-driver` | `@orderAccess.owner(#id)` |
| order | PATCH | `/api/v1/orders/{id}/customer/cancel` | `@orderAccess.customer(#id)` |
| order | PATCH | `/api/v1/orders/{id}/driver/accept` | `@orderAccess.driver(#id)` |
| order | PATCH | `/api/v1/orders/{id}/driver/arrived` | `@orderAccess.driver(#id)` |
| order | PATCH | `/api/v1/orders/{id}/driver/delivered` | `@orderAccess.driver(#id)` |
| order | PATCH | `/api/v1/orders/{id}/driver/picked-up` | `@orderAccess.driver(#id)` |
| order | PATCH | `/api/v1/orders/{id}/driver/reject` | `@orderAccess.driver(#id)` |
| order | PATCH | `/api/v1/orders/{id}/restaurant/accept` | `@orderAccess.owner(#id)` |
| order | PATCH | `/api/v1/orders/{id}/restaurant/ready` | `@orderAccess.owner(#id)` |
| order | PATCH | `/api/v1/orders/{id}/restaurant/reject` | `@orderAccess.owner(#id)` |
| order | POST | `/api/v1/orders` | `hasRole('CUSTOMER')` |
| order | POST | `/api/v1/orders/delivery-fee` | `Theo security/service/owner` |
| order | PUT | `/api/v1/orders` | `denyAll()` |
| payment | DELETE | `/api/v1/vouchers/{id}` | `Theo security/service/owner` |
| payment | GET | `/api/v1/payment/calculate-commissions` | `Theo security/service/owner` |
| payment | GET | `/api/v1/payment/vnpay/callback` | `denyAll()` |
| payment | GET | `/api/v1/vouchers` | `Theo security/service/owner` |
| payment | GET | `/api/v1/vouchers/code/{code}` | `Theo security/service/owner` |
| payment | GET | `/api/v1/vouchers/restaurant/{restaurantId}` | `hasRole('ADMIN')` |
| payment | GET | `/api/v1/vouchers/{id}` | `Theo security/service/owner` |
| payment | GET | `/api/v1/wallet-transactions` | `@paymentAccess.canReadWallet(#walletId)` |
| payment | GET | `/api/v1/wallet-transactions/my-transactions` | `Theo security/service/owner` |
| payment | GET | `/api/v1/wallet-transactions/wallet/{walletId}` | `Theo security/service/owner` |
| payment | GET | `/api/v1/wallets/my-wallet` | `Theo security/service/owner` |
| payment | POST | `/api/v1/payment/calculate-discount` | `hasAuthority('ROLE_INTERNAL_ORDER')` |
| payment | POST | `/api/v1/payment/cod/delivery` | `denyAll()` |
| payment | POST | `/api/v1/payment/initiate` | `Theo security/service/owner` |
| payment | POST | `/api/v1/payment/refund` | `Theo security/service/owner` |
| payment | POST | `/api/v1/vouchers` | `hasRole('ADMIN')` |
| payment | POST | `/api/v1/vouchers/all-restaurants` | `hasRole('ADMIN')` |
| payment | POST | `/api/v1/wallet-transactions/deposit` | `denyAll()` |
| payment | POST | `/api/v1/wallet-transactions/withdraw` | `hasRole('ADMIN')` |
| payment | PUT | `/api/v1/vouchers` | `Theo security/service/owner` |
| restaurant | DELETE | `/api/v1/dish-categories/{id}` | `Theo security/service/owner` |
| restaurant | DELETE | `/api/v1/dishes/{id}` | `Theo security/service/owner` |
| restaurant | DELETE | `/api/v1/menu-option-groups/{id}` | `Theo security/service/owner` |
| restaurant | DELETE | `/api/v1/menu-options/{id}` | `Theo security/service/owner` |
| restaurant | DELETE | `/api/v1/restaurant-types/{id}` | `Theo security/service/owner` |
| restaurant | DELETE | `/api/v1/restaurants/{id}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/dish-categories` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/dish-categories/restaurant/{restaurantId}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/dish-categories/{id}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/dishes` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/dishes/category/{categoryId}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/dishes/restaurant/{restaurantId}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/dishes/{id}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/menu-option-groups` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/menu-option-groups/dish/{dishId}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/menu-option-groups/{id}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/menu-options` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/menu-options/group/{groupId}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/menu-options/{id}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurant-types` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/my-restaurant` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/my-restaurant/menu` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/my-restaurant/status` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/nearby` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/reports/full` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/reports/menu` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/reports/orders` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/reports/revenue` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/reports/reviews` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/slug/{slug}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/{id}` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/{id}/commission` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/{id}/distance` | `Theo security/service/owner` |
| restaurant | GET | `/api/v1/restaurants/{id}/menu` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/dish-categories` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/dishes` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/menu-option-groups` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/menu-options` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/restaurant-types` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/restaurants` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/restaurants/close` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/restaurants/open` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/restaurants/{id}/approve` | `Theo security/service/owner` |
| restaurant | POST | `/api/v1/restaurants/{restaurantId}/quote` | `Theo security/service/owner` |
| restaurant | PUT | `/api/v1/dish-categories` | `Theo security/service/owner` |
| restaurant | PUT | `/api/v1/dishes` | `Theo security/service/owner` |
| restaurant | PUT | `/api/v1/menu-option-groups` | `Theo security/service/owner` |
| restaurant | PUT | `/api/v1/menu-options` | `Theo security/service/owner` |
| restaurant | PUT | `/api/v1/restaurant-types` | `Theo security/service/owner` |
| restaurant | PUT | `/api/v1/restaurants` | `Theo security/service/owner` |
| restaurant | PUT | `/api/v1/restaurants/my-restaurant` | `Theo security/service/owner` |
| system-config | DELETE | `/api/v1/system-configurations/{id}` | `Theo security/service/owner` |
| system-config | GET | `/api/v1/system-configurations` | `Theo security/service/owner` |
| system-config | GET | `/api/v1/system-configurations/key/{configKey}` | `Theo security/service/owner` |
| system-config | GET | `/api/v1/system-configurations/{id}` | `Theo security/service/owner` |
| system-config | POST | `/api/v1/system-configurations` | `Theo security/service/owner` |
| system-config | PUT | `/api/v1/system-configurations` | `Theo security/service/owner` |
