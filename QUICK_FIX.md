# ⚡ QUICK FIX - Lỗi 500 Database Connection

## 🔴 Vấn đề

API trả về lỗi 500 vì **DATABASE_URL chưa được cập nhật đúng** trong Vercel.

## ✅ Giải pháp (2 phút)

### Bước 1: Vào Vercel Dashboard
1. https://vercel.com/dashboard
2. Chọn project **swd**
3. **Settings** → **Environment Variables**

### Bước 2: Cập nhật DATABASE_URL

**Xóa** DATABASE_URL cũ và **thêm mới** với giá trị này:

```
postgresql://postgres.wwonmtozlaonatgayrag:Hophihungqe1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**✅ Check cả 3:** Production, Preview, Development

### Bước 3: Redeploy

1. Tab **Deployments**
2. Click **⋯** (3 chấm) trên deployment mới nhất
3. **Redeploy** (KHÔNG check "Use existing Build Cache")

### Bước 4: Đợi 2-3 phút và test lại

---

## ⚠️ Lưu ý quan trọng

- ❌ **KHÔNG dùng:** Port 5432 (Direct Connection)
- ✅ **PHẢI dùng:** Port 6543 (Connection Pooler)
- ✅ **Mật khẩu:** `Hophihungqe1` (không phải `Hophohingqe1`)
- ✅ **Format:** Phải có `?pgbouncer=true` ở cuối

---

## 🔍 Kiểm tra sau khi fix

Sau khi redeploy, mở:
- https://swd-psi.vercel.app
- Nếu thấy toast message với error chi tiết → Check Vercel Logs
- Nếu thấy danh sách recipes (hoặc empty state) → ✅ Thành công!

---

## 📋 Checklist

- [ ] Đã xóa DATABASE_URL cũ
- [ ] Đã thêm DATABASE_URL mới (port 6543)
- [ ] Đã check cả 3 environments
- [ ] Đã redeploy (không dùng cache)
- [ ] Đã đợi deployment hoàn thành
- [ ] Đã test lại website

