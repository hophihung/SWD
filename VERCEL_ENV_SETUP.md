# 🚨 FIX LỖI 500 TRÊN VERCEL

## Nguyên nhân: Thiếu Environment Variables

Vercel đang thiếu các biến môi trường cần thiết để kết nối database.

---

## ✅ GIẢI PHÁP: Thêm Environment Variables vào Vercel

### Bước 1: Vào Vercel Dashboard

1. Mở https://vercel.com/dashboard
2. Click vào project **swd** (https://swd-psi.vercel.app)
3. Click tab **Settings**
4. Click **Environment Variables** ở menu bên trái

### Bước 2: Thêm 3 biến sau

**⚠️ QUAN TRỌNG**: Mỗi biến phải check cả 3 ô: **Production**, **Preview**, và **Development**

---

#### 1. NEXT_PUBLIC_SUPABASE_URL

**Key:**

```
NEXT_PUBLIC_SUPABASE_URL
```

**Value:**

```
https://wwonmtozlaonatgayrag.supabase.co
```

✅ Check: Production, Preview, Development

---

#### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY

**Key:**

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Value:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3b25tdG96bGFvbmF0Z2F5cmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjQ3NDEsImV4cCI6MjA3ODU0MDc0MX0.XkHTYA7ZSmq00ekRvOqdi1TRD824yEsXkHsQfhnQrIo
```

✅ Check: Production, Preview, Development

---

#### 3. DATABASE_URL

**Key:**

```
DATABASE_URL
```

**Value:**

```
postgresql://postgres:Hophohingqe1@db.wwonmtozlaonatgayrag.supabase.co:5432/postgres
```

✅ Check: Production, Preview, Development

---

### Bước 3: Redeploy

Sau khi thêm xong cả 3 biến:

1. Click tab **Deployments**
2. Tìm deployment mới nhất (top)
3. Click nút **⋯** (3 chấm) bên phải
4. Click **Redeploy**
5. **KHÔNG** check "Use existing Build Cache"
6. Click **Redeploy** để xác nhận

**Hoặc:**

Force redeploy bằng cách push commit mới:

```bash
git commit --allow-empty -m "Trigger Vercel redeploy with env vars"
git push
```

---

### Bước 4: Kiểm tra

1. Đợi deployment hoàn thành (~2-3 phút)
2. Mở https://swd-psi.vercel.app
3. Thử tạo recipe mới
4. Nếu thành công → ✅ XONG!

---

## 🔍 Troubleshooting

### Vẫn thấy lỗi 500?

1. **Kiểm tra Build Logs:**

   - Vào Deployments → Latest deployment
   - Click vào deployment
   - Xem phần "Building" có lỗi gì không
   - Tìm dòng "prisma generate" - phải thấy "✓ Generated Prisma Client"

2. **Kiểm tra Runtime Logs:**

   - Trong deployment, click tab "Logs"
   - Xem có error message gì không
   - Tìm database connection errors

3. **Kiểm tra Environment Variables:**

   - Settings → Environment Variables
   - Đảm bảo cả 3 biến đều có
   - Đảm bảo mỗi biến đều check cả 3 environments
   - **Copy lại value chính xác** - không có khoảng trắng thừa

4. **Force Clean Redeploy:**
   ```bash
   git commit --allow-empty -m "Force clean build"
   git push
   ```

### Lỗi "Prisma Client not found"?

- Package.json đã có: `"postinstall": "prisma generate"` ✅
- Vercel sẽ tự động chạy khi build

### Lỗi "Cannot connect to database"?

- Kiểm tra DATABASE_URL có đúng format không
- Thử test connection local: `npx prisma db pull`
- Kiểm tra Supabase dashboard xem database có đang chạy không

---

## 📋 Checklist

Trước khi redeploy, đảm bảo:

- [ ] Đã thêm `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Đã thêm `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Đã thêm `DATABASE_URL`
- [ ] Mỗi biến đều check cả 3 environments
- [ ] Đã redeploy (không dùng cache)
- [ ] Đã đợi deployment hoàn thành

---

## 🎯 Kết quả mong đợi

Sau khi setup đúng, bạn sẽ thấy:

✅ Homepage hiển thị danh sách recipes (hoặc empty state)
✅ Có thể tạo recipe mới
✅ Có thể edit recipe
✅ Có thể delete recipe
✅ Search/Filter/Sort hoạt động

Không còn lỗi 500! 🎉
