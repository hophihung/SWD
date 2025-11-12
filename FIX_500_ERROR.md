# 🚨 FIX LỖI 500 - HƯỚNG DẪN CHI TIẾT

## ❌ Vấn đề hiện tại

Bạn đang gặp lỗi 500 vì:
1. **DATABASE_URL đang dùng Direct Connection (port 5432)** - không phù hợp cho Vercel serverless
2. **Mật khẩu có thể sai** - cần dùng `Hophihungqe1` (không phải `Hophohingqe1`)

## ✅ GIẢI PHÁP: Cập nhật DATABASE_URL trong Vercel

### Bước 1: Vào Vercel Dashboard

1. Mở https://vercel.com/dashboard
2. Click vào project **swd** (https://swd-psi.vercel.app)
3. Click tab **Settings**
4. Click **Environment Variables** ở menu bên trái

### Bước 2: Xóa DATABASE_URL cũ và thêm mới

**⚠️ QUAN TRỌNG**: 

1. **Xóa** DATABASE_URL cũ (nếu có)
2. **Thêm mới** với giá trị sau:

**Key:**
```
DATABASE_URL
```

**Value (Connection Pooler - Port 6543):**
```
postgresql://postgres.wwonmtozlaonatgayrag:Hophihungqe1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**✅ Check cả 3 ô:** Production, Preview, Development

### Bước 3: Kiểm tra các biến khác

Đảm bảo bạn có **3 biến** sau (tất cả đều check Production, Preview, Development):

#### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://wwonmtozlaonatgayrag.supabase.co
```

#### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3b25tdG96bGFvbmF0Z2F5cmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjQ3NDEsImV4cCI6MjA3ODU0MDc0MX0.XkHTYA7ZSmq00ekRvOqdi1TRD824yEsXkHsQfhnQrIo
```

#### 3. DATABASE_URL (MỚI - Connection Pooler)
```
postgresql://postgres.wwonmtozlaonatgayrag:Hophihungqe1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Bước 4: Redeploy

Sau khi cập nhật DATABASE_URL:

1. Click tab **Deployments**
2. Tìm deployment mới nhất (top)
3. Click nút **⋯** (3 chấm) bên phải
4. Click **Redeploy**
5. **KHÔNG** check "Use existing Build Cache"
6. Click **Redeploy** để xác nhận

**Hoặc** force redeploy:
```bash
git commit --allow-empty -m "Fix: Update DATABASE_URL to use Connection Pooler"
git push
```

### Bước 5: Kiểm tra

1. Đợi deployment hoàn thành (~2-3 phút)
2. Mở https://swd-psi.vercel.app
3. Kiểm tra Vercel Logs:
   - Vào Deployments → Latest → Runtime Logs
   - Xem có lỗi database connection không
4. Thử tạo recipe mới

---

## 🔍 So sánh: Direct vs Connection Pooler

| Feature | Direct (5432) ❌ | Pooler (6543) ✅ |
|---------|------------------|------------------|
| **Port** | 5432 | 6543 |
| **Use Case** | Local dev, migrations | Production (Vercel) |
| **Serverless** | ❌ Không tốt | ✅ Tốt nhất |
| **Max Connections** | ~100 | ~10000 |
| **Format** | `postgres://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres` | `postgresql://postgres.PROJECT:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true` |

---

## ⚠️ Lưu ý quan trọng

1. **Mật khẩu**: `Hophihungqe1` (không phải `Hophohingqe1`)
2. **Port**: Phải dùng **6543** (pooler), không dùng 5432
3. **Format**: Phải có `?pgbouncer=true` ở cuối URL
4. **Username**: Dùng `postgres.wwonmtozlaonatgayrag` (có dấu chấm) cho pooler
5. **Host**: `aws-0-ap-southeast-1.pooler.supabase.com` (không phải `db.wwonmtozlaonatgayrag.supabase.co`)

---

## 🐛 Troubleshooting

### Vẫn thấy lỗi 500?

1. **Kiểm tra Build Logs:**
   - Deployments → Latest → Building
   - Tìm "prisma generate" - phải thấy "✓ Generated Prisma Client"

2. **Kiểm tra Runtime Logs:**
   - Deployments → Latest → Runtime Logs
   - Tìm lỗi database connection
   - Copy error message để debug

3. **Kiểm tra Environment Variables:**
   - Settings → Environment Variables
   - Đảm bảo DATABASE_URL đúng format
   - Đảm bảo mỗi biến check cả 3 environments
   - **Copy lại value chính xác** - không có khoảng trắng thừa

4. **Test Connection:**
   - Thử kết nối local với DATABASE_URL mới
   - `npx prisma db pull` để test

---

## ✅ Kết quả mong đợi

Sau khi fix đúng:
- ✅ Homepage load được (không còn 500)
- ✅ Có thể tạo recipe mới
- ✅ Có thể edit/delete recipe
- ✅ Search/Filter/Sort hoạt động

Không còn lỗi 500! 🎉

