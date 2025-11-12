# Deployment Guide

## Step-by-Step Deployment to Vercel

### 1. Prepare Your Repository

1. Initialize git (if not already done):

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Recipe sharing app"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/your-username/your-repo.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:

   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `next build`
   - **Output Directory**: .next

5. Add Environment Variables in Vercel:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://wwonmtozlaonatgayrag.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   DATABASE_URL=postgresql://postgres:Hophohingqe1@db.wwonmtozlaonatgayrag.supabase.co:5432/postgres
   ```

6. Click "Deploy"

### 3. Post-Deployment

After deployment completes:

- Your app will be available at: `https://your-project.vercel.app`
- Vercel will automatically redeploy on every push to main branch

## Alternative Deployment Options

### Deploy to Render

1. Go to [render.com](https://render.com)
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - Add environment variables

### Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add PostgreSQL database (or use existing Supabase)
4. Add environment variables
5. Deploy

## Database Setup (Supabase)

Your database is already configured! The Supabase PostgreSQL instance is running at:

- URL: `https://wwonmtozlaonatgayrag.supabase.co`
- Database: Already set up with the Recipe table

If you need to reset or migrate:

```bash
npx prisma db push
```

## Testing Your Deployed App

After deployment:

1. Visit your deployed URL
2. Create a test recipe
3. Try search and filter functionality
4. Edit and delete the test recipe

## Troubleshooting

### Build Errors

- Make sure all environment variables are set in Vercel
- Check that DATABASE_URL is accessible from Vercel servers

### Database Connection Issues

- Verify Supabase database is active
- Check connection pooling settings
- Ensure DATABASE_URL includes correct credentials

### Runtime Errors

- Check Vercel logs for detailed error messages
- Verify Prisma client is generated during build

## GitHub Repository Checklist

- [ ] All code committed and pushed
- [ ] README.md is complete
- [ ] .env.local is in .gitignore (NOT committed)
- [ ] All dependencies are in package.json
- [ ] Database schema is defined in prisma/schema.prisma

## Submission

For your assignment submission, provide:

1. **GitHub Repository URL**: `https://github.com/your-username/recipe-app`
2. **Live Deployment URL**: `https://your-project.vercel.app`
3. **Brief Report** (see REPORT.md)
