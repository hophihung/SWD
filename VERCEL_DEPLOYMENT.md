# ⚠️ QUAN TRỌNG: Hướng dẫn Deploy lên Vercel

## Vấn đề: Lỗi 500 khi deploy lên Vercel

**Nguyên nhân**: Vercel là serverless environment, mỗi request tạo một connection mới đến database. Direct connection (port 5432) sẽ bị quá tải và fail.

**Giải pháp**: Sử dụng **Connection Pooler** của Supabase (port 6543)

---

## Các bước Deploy đúng cách:

### 1. Lấy Connection String từ Supabase

1. Vào [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Project Settings** → **Database**
4. Tìm mục **Connection Pooling**

Bạn sẽ thấy 2 loại connection:

#### Connection Pooling (Transaction Mode) - Port 6543

```
postgresql://postgres.YOUR_PROJECT:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres
```

**→ Dùng cho Vercel (serverless)**

#### Direct Connection - Port 5432

```
postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres
```

**→ Chỉ dùng cho local development hoặc migrations**

---

### 2. Thêm Environment Variables trong Vercel

Vào **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Thêm **3 biến** sau cho **TẤT CẢ environments** (Production, Preview, Development):

```env
NEXT_PUBLIC_SUPABASE_URL
```

Value: `https://wwonmtozlaonatgayrag.supabase.co`

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3b25tdG96bGFvbmF0Z2F5cmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjQ3NDEsImV4cCI6MjA3ODU0MDc0MX0.XkHTYA7ZSmq00ekRvOqdi1TRD824yEsXkHsQfhnQrIo`

```env
DATABASE_URL
```

Value: `postgresql://postgres.wwonmtozlaonatgayrag:Hophohingqe1@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

⚠️ **CHÚ Ý**:

- Phải dùng **Connection Pooler URL** (port 6543)
- Thêm `?pgbouncer=true` vào cuối URL
- KHÔNG dùng Direct Connection (port 5432) cho Vercel

---

### 3. (Optional) Thêm DIRECT_URL nếu cần chạy migrations trên Vercel

```env
DIRECT_URL
```

Value: `postgresql://postgres:Hophohingqe1@db.wwonmtozlaonatgayrag.supabase.co:5432/postgres`

---

### 4. Redeploy

Sau khi thêm environment variables:

1. Vào **Deployments** tab
2. Click vào deployment mới nhất
3. Click nút **⋯** (3 dots) → **Redeploy**
4. Check "Use existing Build Cache" → **Redeploy**

Hoặc push code mới:

```bash
git add .
git commit -m "Fix: Use Supabase Connection Pooler for Vercel"
git push
```

---

## Kiểm tra Deployment thành công

Sau khi deploy xong:

1. **Mở app** trên Vercel URL
2. **Thử tạo recipe mới** - nếu thành công là OK
3. **Kiểm tra Vercel Logs**:
   - Vào Deployments → Latest → Runtime Logs
   - Xem có lỗi database connection không

---

## So sánh Port 5432 vs 6543

| Feature            | Direct (5432)           | Pooler (6543)           |
| ------------------ | ----------------------- | ----------------------- |
| Connection Type    | Direct                  | Connection Pool         |
| Use Case           | Local dev, migrations   | Production (Vercel)     |
| Max Connections    | Limited (~100)          | Pooled (~10000)         |
| Performance        | Slower (new connection) | Fast (reuse connection) |
| Serverless Support | ❌ Không tốt            | ✅ Tốt nhất             |

---

## Troubleshooting

### Lỗi: "Cannot connect to database server"

**Giải pháp:**

1. Kiểm tra lại DATABASE_URL có đúng format không
2. Đảm bảo dùng port 6543 (pooler) chứ không phải 5432
3. Kiểm tra password có đúng không (không có ký tự đặc biệt nào bị escape)

### Lỗi: "Failed to create recipe"

**Giải pháp:**

1. Vào Vercel → Settings → Environment Variables
2. Xóa DATABASE_URL cũ
3. Thêm lại với Connection Pooler URL (port 6543)
4. Redeploy

### Lỗi: "Prisma Client not generated"

**Giải pháp:**

1. Check `package.json` có script: `"postinstall": "prisma generate"`
2. Commit và push lại
3. Vercel sẽ tự động chạy postinstall

---

## Tóm tắt

✅ **Local Development**: Dùng cả Direct (5432) hoặc Pooler (6543) đều OK

✅ **Vercel Production**: **PHẢI** dùng Pooler (6543) + `?pgbouncer=true`

❌ **KHÔNG** dùng Direct Connection (5432) cho Vercel

---

## Reference

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pool)
- [Prisma with Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
