# 🚀 EATZY NGINX SETUP - QUICK IMPLEMENTATION GUIDE

## ⏱️ Thời gian ước tính: 15-20 phút

---

## 📋 BƯỚC 1: Cấu hình Windows Hosts File (2 phút)

### Windows 10/11:

1. Nhấn `Win + X`, chọn **Windows Terminal (Admin)** hoặc **PowerShell (Admin)**

2. Chạy lệnh:
   ```powershell
   notepad C:\Windows\System32\drivers\etc\hosts
   ```

3. Thêm dòng này vào cuối file:
   ```
   127.0.0.1 eatzy.local
   ```

4. Lưu file (Ctrl + S) và đóng Notepad

5. Kiểm tra:
   ```powershell
   ping eatzy.local
   ```
   
   Phải thấy: `Reply from 127.0.0.1...` ✅

---

## 📋 BƯỚC 2: Cài đặt và cấu hình Nginx trong WSL2 (5-7 phút)

### 2.1. Mở WSL Ubuntu

Trong PowerShell hoặc Windows Terminal:
```powershell
wsl
```

### 2.2. Cài đặt Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### 2.3. Kiểm tra cài đặt

```bash
sudo nginx -t
```

Kết quả phải là:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 2.4. Copy config file từ project

```bash
cd /mnt/c/Users/OWNER/source/Eatzy/eatzy_frontend
sudo cp nginx-eatzy.conf /etc/nginx/sites-available/eatzy
```

### 2.5. Enable site

```bash
sudo ln -s /etc/nginx/sites-available/eatzy /etc/nginx/sites-enabled/eatzy
```

### 2.6. Test config

```bash
sudo nginx -t
```

Phải thấy: `syntax is ok` ✅

### 2.7. Khởi động Nginx

```bash
sudo service nginx start
```

### 2.8. Kiểm tra status

```bash
sudo service nginx status
```

Phải thấy: `* nginx is running` ✅

### 2.9. Test trong browser

Mở browser và vào: http://eatzy.local

Phải thấy trang welcome của Nginx (hoặc 502 Bad Gateway - OK vì apps chưa chạy) ✅

---

## 📋 BƯỚC 3: Chạy tất cả apps (3-5 phút)

### Option A: PowerShell Script (Khuyến nghị cho Windows)

1. Mở PowerShell trong thư mục project:
   ```powershell
   cd C:\Users\OWNER\source\Eatzy\eatzy_frontend
   ```

2. Chạy script:
   ```powershell
   .\start-all-apps.ps1
   ```

3. Sẽ có 5 cửa sổ PowerShell mở ra, mỗi cửa sổ chạy 1 app

4. Đợi khoảng 30-60 giây để tất cả apps build và start

### Option B: Git Bash / WSL

1. Trong Git Bash hoặc WSL:
   ```bash
   cd /mnt/c/Users/OWNER/source/Eatzy/eatzy_frontend
   chmod +x start-all-apps.sh
   ./start-all-apps.sh
   ```

### Option C: Chạy thủ công (nếu script không hoạt động)

Mở 5 terminals riêng biệt và chạy:

**Terminal 1:**
```bash
cd C:\Users\OWNER\source\Eatzy\eatzy_frontend
pnpm --filter customer dev --port 3000
```

**Terminal 2:**
```bash
cd C:\Users\OWNER\source\Eatzy\eatzy_frontend
pnpm --filter driver dev --port 3001
```

**Terminal 3:**
```bash
cd C:\Users\OWNER\source\Eatzy\eatzy_frontend
pnpm --filter restaurant dev --port 3002
```

**Terminal 4:**
```bash
cd C:\Users\OWNER\source\Eatzy\eatzy_frontend
pnpm --filter admin dev --port 3003
```

**Terminal 5:**
```bash
cd C:\Users\OWNER\source\Eatzy\eatzy_frontend
pnpm --filter super-admin dev --port 3004
```

---

## 📋 BƯỚC 4: Kiểm tra và test (2-3 phút)

### 4.1. Kiểm tra apps đang chạy

Các terminal phải hiển thị:
```
✓ Ready in Xms
○ Local: http://localhost:300X/[app-name]
```

### 4.2. Truy cập qua Nginx

Mở browser và test từng app:

- **Customer:** http://eatzy.local/customer  
  ✅ Phải load được trang chủ

- **Driver:** http://eatzy.local/driver  
  ✅ Phải load được trang chủ

- **Restaurant:** http://eatzy.local/restaurant  
  ✅ Phải load được trang chủ

- **Admin:** http://eatzy.local/admin  
  ✅ Phải load được trang chủ

- **Super Admin:** http://eatzy.local/super-admin  
  ✅ Phải load được trang chủ

### 4.3. Test localStorage sharing

1. Mở http://eatzy.local/customer
2. Mở DevTools (F12)
3. Console tab, chạy:
   ```javascript
   localStorage.setItem('test', 'Hello from Customer!');
   ```

4. Mở tab mới: http://eatzy.local/driver
5. Mở DevTools (F12)
6. Console tab, chạy:
   ```javascript
   localStorage.getItem('test');
   ```

7. Phải trả về: `"Hello from Customer!"` ✅

### 4.4. Test BroadcastChannel

**Tab 1 (Customer app):**
```javascript
const channel = new BroadcastChannel('eatzy-test');
channel.onmessage = (e) => console.log('Received:', e.data);
channel.postMessage({ from: 'customer', message: 'Hello!' });
```

**Tab 2 (Driver app):**
```javascript
const channel = new BroadcastChannel('eatzy-test');
channel.onmessage = (e) => console.log('Received:', e.data);
```

Trong Driver app console phải thấy: `Received: {from: 'customer', message: 'Hello!'}` ✅

---

## 🎉 HOÀN THÀNH!

Nếu tất cả các bước trên đều pass, bạn đã setup thành công! 🚀

---

## 🐛 Troubleshooting nhanh

### ❌ Không ping được eatzy.local
- Kiểm tra lại file hosts
- Thử ping với quyền admin
- Flush DNS: `ipconfig /flushdns`

### ❌ nginx -t báo lỗi
- Kiểm tra syntax trong file config
- Đảm bảo không có tab character, chỉ dùng spaces
- So sánh với file `nginx-eatzy.conf` gốc

### ❌ Apps không chạy
- Kiểm tra port có bị chiếm: `netstat -ano | findstr :3000`
- Kiểm tra pnpm đã cài: `pnpm -v`
- Thử chạy từng app riêng lẻ để debug

### ❌ 502 Bad Gateway
- Apps chưa chạy → Start apps
- Port trong Nginx config sai → Sửa config và reload Nginx
- Xem Nginx error log để debug chi tiết

### ❌ Assets không load (/_next/... 404)
- Kiểm tra basePath trong next.config.mjs
- Restart app sau khi thay đổi config
- Clear browser cache (Ctrl + Shift + R)

---

## 📞 Cần trợ giúp?

1. Đọc `SETUP_CHECKLIST.md` - Phần Troubleshooting chi tiết
2. Check Nginx logs:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```
3. Check browser console cho errors
4. Kiểm tra tất cả apps đang chạy:
   ```bash
   # Windows
   netstat -ano | findstr :300
   
   # WSL
   ps aux | grep node
   ```

---

## 🎯 Next Steps sau khi setup

1. **Implement auth sync** - User login/logout sync across apps
2. **Order notifications** - Real-time order updates with BroadcastChannel
3. **Shared state management** - Zustand/Redux with sync
4. **Offline support** - Service Workers + IndexedDB

Xem `CROSS_APP_SYNC_GUIDE.md` để biết cách implement.

---

**Setup Date:** 2025-12-26  
**Version:** 1.0.0  
**Estimated Time:** 15-20 minutes  
**Difficulty:** ⭐⭐☆☆☆ (Medium)
