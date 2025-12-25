# ⚡ HƯỚNG DẪN NHANH - ĐÃ SẴN SÀNG CHẠY!

## ✅ Đã hoàn tất tự động

1. ✅ Đã cấu hình `basePath` cho tất cả 5 apps
2. ✅ Đã tạo Node.js proxy server (thay thế Nginx)
3. ✅ Đã cài package `http-proxy`
4. ✅ Đã tạo script tự động chạy tất cả

---

## 🚀 CHỈ CẦN 2 BƯỚC NỮA!

### BƯỚC 1: Thêm domain vào hosts file (1 lần duy nhất)

**Cách làm:**
1. Nhấn `Win + X` → Chọn "Windows Terminal (Admin)"
2. Chạy lệnh:
   ```powershell
   notepad C:\Windows\System32\drivers\etc\hosts
   ```
3. Thêm dòng này vào cuối file:
   ```
   127.0.0.1 eatzy.local
   ```
4. Lưu file (Ctrl + S)

**Kiểm tra:**
```powershell
ping eatzy.local
```
Phải thấy: `Reply from 127.0.0.1...` ✅

---

### BƯỚC 2: Chạy tất cả apps!

**Trong PowerShell (không cần admin):**
```powershell
cd C:\Users\OWNER\source\Eatzy\eatzy_frontend
.\start-all-apps.ps1
```

Hoặc double-click file `start-all-apps.ps1` trong Windows Explorer.

**Sẽ mở ra 6 cửa sổ PowerShell:**
1. Proxy Server (port 80)
2. Customer App (port 3000)
3. Driver App (port 3001)
4. Restaurant App (port 3002)
5. Admin App (port 3003)
6. Super Admin App (port 3004)

**Đợi khoảng 30-60 giây** để tất cả apps build xong.

---

## 🎉 TRUY CẬP APPS

Mở browser và vào:

- 🛒 **Customer:** http://eatzy.local/customer
- 🚗 **Driver:** http://eatzy.local/driver
- 🍽️ **Restaurant:** http://eatzy.local/restaurant
- 👔 **Admin:** http://eatzy.local/admin
- 🔧 **Super Admin:** http://eatzy.local/super-admin

---

## ✨ TEST SHARED STORAGE

### Test 1: localStorage
1. Mở http://eatzy.local/customer
2. F12 → Console, chạy:
   ```javascript
   localStorage.setItem('test', 'Hello from Customer!');
   ```
3. Mở tab mới: http://eatzy.local/driver
4. F12 → Console, chạy:
   ```javascript
   localStorage.getItem('test');
   ```
5. Phải trả về: `"Hello from Customer!"` ✅

### Test 2: BroadcastChannel
**Tab 1 (Customer):**
```javascript
const channel = new BroadcastChannel('test');
channel.onmessage = (e) => console.log('Got:', e.data);
channel.postMessage('Hello from Customer!');
```

**Tab 2 (Driver):**
```javascript
const channel = new BroadcastChannel('test');
channel.onmessage = (e) => console.log('Got:', e.data);
```
Phải thấy message từ Customer! ✅

---

## 🛑 DỪNG TẤT CẢ

Đóng tất cả 6 cửa sổ PowerShell.

---

## 📊 Sự khác biệt so với Nginx

| Feature | Nginx | Node.js Proxy |
|---------|-------|---------------|
| **Cài đặt** | Phức tạp, cần WSL | ✅ Đơn giản, chỉ dùng Node |
| **Config** | nginx.conf | ✅ JavaScript file |
| **Chạy trên Windows** | Cần WSL/Windows Service | ✅ Chạy trực tiếp |
| **Quyền admin** | Cần (port 80) | ⚠️ Cần cho port 80 |
| **Performance** | Cao hơn | Đủ cho development |
| **WebSocket/HMR** | ✅ Support | ✅ Support |
| **Shared origin** | ✅ Có | ✅ Có |

---

## 🐛 Troubleshooting

### ❌ "Access denied" khi chạy proxy
Proxy cần port 80 → Cần quyền adminGiải pháp:
- Click phải `start-all-apps.ps1` → "Run as Administrator"
- Hoặc đổi proxy port trong `proxy-server.js` từ `80` sang `8080`, rồi truy cập `http://eatzy.local:8080`

### ❌ Apps không load
- Kiểm tra 5 apps có đang chạy không (xem terminal outputs)
- Đợi thêm 1-2 phút để apps build xong
- Refresh browser (F5)

### ❌ localhost refused to connect
- Kiểm tra proxy server có đang chạy không
- Check port 80 có bị chiếm: `netstat -ano | findstr :80`

---

## 🎯 Next Steps

Sau khi chạy thành công:

1. **Implement auth sync** - Xem `CROSS_APP_SYNC_GUIDE.md`
2. **Order notifications** - Dùng `useEatzySync()` hook
3. **Shared state** - IndexedDB for offline data

---

## 📚 Tài liệu

- `MULTI_APP_SETUP_SUMMARY.md` - Overview toàn bộ architecture
- `CROSS_APP_SYNC_GUIDE.md` - BroadcastChannel usage với examples
- `proxy-server.js` - Source code của proxy server

---

**Created:** 2025-12-26  
**Status:** ✅ Ready to use  
**Difficulty:** ⭐☆☆☆☆ (Very Easy - Just 2 steps!)
