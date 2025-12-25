# 🔐 EATZY LOGIN GUIDE

## ✅ Tài khoản đăng nhập đã có sẵn

### 📱 **Customer App** (`http://localhost:8080/customer/login`)

```
Email: customer@eatzy.local
Password: 123456
```

**Thông tin tài khoản:**
- Tên: Nguyễn Văn An
- Role: Customer
- Tổng đơn hàng: 10
- Yêu thích: 5 restaurants (Phở Hà Nội, Sushi Sakura, Korean BBQ, Dim Sum Palace, Mediterranean Delight)

---

### 🚗 **Driver App** (`http://localhost:8080/driver/login`)

```
Email: driver@eatzy.local
Password: 123456
```

**Thông tin tài khoản:**
- Tên: Trần Văn Bình
- Role: Driver
- Xe: Yamaha Sirius (59B-67890)
- Tổng chuyến: 5 (delivered)
- Thu nhập: ~117,600đ
- Số dư: ~3,117,600đ

---

### 🍽️ **Restaurant App** (`http://localhost:8080/restaurant/login`)

```
Email: phohanoi@eatzy.local
Password: 123456
```

**Thông tin tài khoản:**
- Tên: Lê Văn Cường
- Role: Restaurant Owner
- Quán: Phở Hà Nội (rest-1)
- Địa chỉ: 123 Nguyễn Huệ, Q1, TP.HCM

---

### 🔧 **Super Admin App** (`http://localhost:8080/super-admin/login`)

```
Email: admin@eatzy.local
Password: 123456
```

**Thông tin tài khoản:**
- Tên: Phạm Văn Dũng
- Role: Super Admin
- Quyền: Quản lý toàn bộ hệ thống

---

## 🧪 Test Login Flow

### Customer App:
1. Mở `http://localhost:8080/customer/login`
2. Nhập:
   - Email: `customer@eatzy.local`
   - Password: `123456`
3. Click "Đăng nhập"
4. Sẽ redirect về `/home` với full customer data

### Kiểm tra localStorage sau khi login:
```javascript
// Check current user
const currentUser = JSON.parse(localStorage.getItem('eatzy_current_user'));
console.log('Current user:', currentUser);

// Check auth token
const token = localStorage.getItem('access_token');
console.log('Token:', token);
```

---

## 🔒 Security Notes

⚠️ **LƯU Ý:** Đây là demo với localStorage, KHÔNG dùng trong production!

- Password được lưu plain text (không hash)
- Token chỉ là base64 encode (không JWT thật)
- Không có refresh token
- Không có rate limiting

**Trong production cần:**
- Hash passwords (bcrypt, argon2)
- JWT tokens với expiry
- Refresh tokens
- HTTPS only
- Rate limiting
- Session management

---

## 🛠️ Customize

### Thêm user mới:

```typescript
import { clearEatzyData, initializeEatzyData } from '@repo/ui';

// 1. Clear data
clearEatzyData();

// 2. Modify SEED_USERS in localStorage-manager.ts
// Add your new user to the array

// 3. Re-initialize
initializeEatzyData();
```

### Đổi password:

```javascript
// Get users
const users = JSON.parse(localStorage.getItem('eatzy_users'));

// Find and update
const user = users.find(u => u.email === 'customer@eatzy.local');
user.password = 'newpassword123';

// Save back
localStorage.setItem('eatzy_users', JSON.stringify(users));
```

---

## ✨ Features

- ✅ **Email/Password authentication** từ localStorage
- ✅ **Role-based access** - chỉ customer role mới login được vào customer app
- ✅ **Account status check** - tài khoản disabled không login được
- ✅ **Customer profile loading** - tự động load profile sau khi login
- ✅ **Auto redirect** - redirect về /home sau khi login thành công
- ✅ **Error handling** - hiển thị lỗi rõ ràng

---

**Created:** 2025-12-26  
**Status:** ✅ READY TO USE
