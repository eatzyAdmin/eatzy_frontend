# Baseline kiểm tra khi cài agent — 2026-10-18

Source tham khảo: commit d85005b của eatzy_frontend. Phần setup thêm hướng dẫn, skills, .nvmrc và script kiểm tra; không thay hành vi UI/API.

| Kiểm tra | Kết quả quan sát |
|---|---|
| agent:check doctor | Node 24.22.0, pnpm 9.0.0; dependencies của 5 app hiện có |
| agent:check config | Cú pháp 5 next.config.mjs hợp lệ |
| agent:check typecheck | Exit 1; tổng 116 diagnostics TypeScript qua 5 lượt kiểm tra; customer/driver/restaurant/super-admin lỗi, admin không báo lỗi |
| agent:check lint | Exit 1; tổng 882 thông báo Error và 47 Warning qua 5 app |

Đây là số diagnostics từ log, không phải số bug độc lập: cùng một lỗi ở shared package có thể hiện trong nhiều app. Counts sẽ đổi khi source/dependencies thay đổi; kết quả mới nhất của lệnh là bằng chứng hiện tại.

Các nhóm ví dụ: dependency lucide-react không được khai báo/resolve ở nơi import; mock data dùng string nơi contract cần number; props/exports không khớp; ESLint báo any và biến/import chưa dùng. Danh sách chính xác lấy bằng chạy lại lệnh, không suy diễn chỉ từ nhóm ví dụ này.

Build Next hiện cấu hình bỏ qua TypeScript và lint errors. Chạy build thành công không phủ nhận các lỗi trên. Không đổi rule để làm xanh baseline. Khi bảo trì, ghi check trước/sau theo app bị tác động, ưu tiên sửa lỗi thuộc luồng đang làm; việc dọn toàn bộ baseline là một task riêng.

```powershell
pnpm agent:check typecheck --app customer
pnpm agent:check lint --app customer
pnpm agent:check typecheck
pnpm agent:check lint
```

Không thay toàn bộ quy trình deploy đang chạy chỉ để thêm bộ agent. Trước khi dùng kết quả check làm required CI gate, cần xử lý hoặc thống nhất chiến lược đối với các lỗi đang có.
