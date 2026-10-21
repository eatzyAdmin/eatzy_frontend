# Dùng agent để làm việc với frontend

Mở thư mục `eatzy_frontend` trong Codex. Agent đọc `AGENTS.md` để biết cấu trúc,
lệnh kiểm tra và các điểm dễ sửa sai. Skill là hướng dẫn theo loại công việc;
bạn có thể gọi bằng tên, hoặc mô tả việc cần làm để agent chọn khi phù hợp.
Các file này không tự mở server, không cấp quyền GitHub và không tự deploy.

## Chạy và kiểm tra trên máy

Mở terminal tại thư mục repo. Chạy lần đầu hoặc khi lockfile thay đổi:

```powershell
pnpm install --frozen-lockfile
pnpm agent:check doctor
```

Doctor cho biết điều kiện nào đang có hoặc thiếu; đọc kết quả cụ thể, không xem
đây là chứng nhận ứng dụng chạy đúng. Giữ Node/pnpm đang dùng nếu đã tương thích.
Nếu thiếu runtime, cài/chọn version trước rồi mở terminal mới.

Bật cả 5 giao diện bằng `pnpm dev`, hoặc chạy từng app để giảm tải:

```powershell
pnpm --filter customer dev
```

Cổng customer/driver/restaurant/super-admin/admin lần lượt là 3000/3001/3002/3003/3004.
Giữ terminal chạy, nhấn Ctrl+C để dừng phiên mình đã mở. Backend Docker là phiên
riêng; không cần build lại backend chỉ để sửa CSS trên web.

Các lệnh harness chạy từ repo root:

```powershell
pnpm agent:check doctor
pnpm agent:check config
pnpm agent:check typecheck --app customer
pnpm agent:check lint --app customer
pnpm agent:check health
```

`--app` nhận `customer`, `driver`, `restaurant`, `super-admin`, `admin`. Bỏ
`--app` ở `typecheck`/`lint` để chạy cho cả 5. `health` gửi GET qua proxy từng
frontend tới backend; cần bật các server trước. Nó không đăng nhập, không đặt món
và không kiểm tra được realtime hay thanh toán. `config` kiểm tra cú pháp file
Next config, không xác minh toàn bộ biến môi trường hoặc máy chủ đích.

Các lệnh giữ exit code lỗi. Repo có thể đang có lỗi TS/lint từ trước; agent cần
phân biệt lỗi nền với lỗi vừa tạo. Có thể lưu log riêng khi cần so sánh:

```powershell
pnpm agent:check typecheck --app customer *> .agent-baseline-customer.log
```

Tên log trên chỉ là file ghi kết quả, không biến lỗi thành pass. Đừng commit log
có dữ liệu tài khoản. Không dùng `pnpm build` làm bằng chứng TS/lint sạch vì
Next config đang bỏ qua hai nhóm lỗi này; `pnpm check-types` cũ cũng chưa chạy app.

## Khi giao diện không gọi được Docker backend

1. Kiểm tra `http://localhost:8080/actuator/health`.
2. Kiểm tra `/api/proxy/actuator/health` tại cổng app đang chạy.
3. Đọc `next.config.mjs` và `BACKEND_URL` hiệu lực của app; trong Next.js,
   `.env.local` thường đặt ở root của app, không tự giả định env root monorepo
   đã được nạp. Biến môi trường shell có thể được Turbo truyền vào task.
4. Restart app sau khi đổi cấu hình. Kiểm tra cache/service worker nếu vẫn thấy
   giao diện cũ, đồng thời giữ lại dữ liệu đăng nhập khi chưa cần xóa nó.

Mặc định dev dùng gateway local; production dùng server đang cấu hình.
Socket là đường riêng: kiểm tra `NEXT_PUBLIC_WS_URL`, token CONNECT và log
communication-service. REST health chạy được chưa chứng minh chat/tracking chạy.
Khi thử trên điện thoại, `localhost` là chính điện thoại; dùng host/IP thích hợp
và kiểm tra cookie/CORS/TLS theo nền tảng.

## Yêu cầu agent thêm/sửa tính năng

Ví dụ:

> Dùng $eatzy-web-change thêm bộ lọc trạng thái tại lịch sử đơn customer.
> Giữ thiết kế hiện tại, gọi API thật, kiểm tra app customer và nói rõ lỗi nền.

Nên cung cấp vai trò, màn hình, hành vi mong muốn và tình huống đã biết. Agent
sẽ lần từ route tới hook/API/types, thực hiện thay đổi và kiểm tra phần liên quan.
Thay đổi UI nên xem cả trạng thái tải/rỗng/lỗi và kích thước màn hình cần dùng.

## Yêu cầu tìm và sửa lỗi

> Dùng $eatzy-web-debug tìm lỗi driver không hiện đơn sau khi bật online.
> Backend đang chạy Docker local; tái hiện bằng tài khoản thử nghiệm tôi đã mở.

Gửi URL, thao tác, kết quả mong muốn và thông báo lỗi đã che thông tin nhạy cảm.
Agent kiểm tra từng lớp thay vì đổi hàng loạt URL hoặc reset dữ liệu để đoán lỗi.
Không cần gửi `.env`, token, mật khẩu hay SSH key trong chat.

## Yêu cầu review trước khi commit

> Dùng $eatzy-web-review review thay đổi hiện tại, tập trung auth, order statuses
> và các app dùng chung UI. Chỉ ra lỗi có thể tái hiện, chưa sửa tự động.

Review đưa finding kèm file/dòng và ảnh hưởng. Nếu muốn sửa các finding, nói rõ
để agent tiếp tục. Kiểm tra xong không tự đồng nghĩa đã commit/push/deploy;
push `main` hiện kích hoạt GitHub Actions triển khai thật.

## Chuyển màn sang mobile

> Đối chiếu màn checkout customer theo docs/agent/native-parity.md với repo
> eatzy_mobile bên cạnh. Giữ hierarchy và trạng thái UI, dùng API contract thật,
> đánh dấu phần chưa tích hợp; không mang Next/DOM/localStorage sang native.

Đây là điểm bắt đầu có source tham chiếu. Native cần kiểm tra trên emulator hoặc
thiết bị, gồm session, GPS, app background/foreground và payment return. Một
scaffold hoặc màn mock chưa phải bản chuyển hoàn chỉnh của web.

## Baseline ban đầu

Xem [baseline.md](baseline.md) để biết lỗi TypeScript/lint đang tồn tại khi cài bộ agent. Check trả lỗi là thông tin cần xử lý, không phải lý do bỏ kiểm tra hay kết luận tác vụ mới làm hỏng toàn bộ repo.
