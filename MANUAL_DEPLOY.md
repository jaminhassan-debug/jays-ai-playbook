# 🎯 MANUAL DEPLOYMENT - STEP BY STEP

Since the terminal has file system issues, follow these exact steps in your terminal:

## ✅ PHASE 1: PUSH TO GITHUB (5 minutes)

Open your terminal in VS Code and run these commands **one at a time**:

### 1.1 Configure Git User
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 1.2 Check What's Changed
```bash
git status
```

You should see many new files in green (untracked).

### 1.3 Stage Everything
```bash
git add .
```

### 1.4 Create Commit
```bash
git commit -m "feat: Complete AI playbook platform with Supabase, Stripe, and Vercel

- Next.js frontend with dark AI theme
- Supabase database integration
- Stripe payment processing
- Product marketplace with 4 items
- Premium prompts system with 5 prompts
- Email subscription API
- Automated content generation
- Tailwind CSS dark theme styling
- SEO optimized dynamic pages
- Complete API routes for payments

Production-ready platform. Deploy to Vercel."
```

### 1.5 Push to GitHub
```bash
git branch -M main
git push -u origin main
```

**✅ If you see "Everything up-to-date" or file counts, you're good!**

---

## ✅ PHASE 2: DEPLOY TO VERCEL (5 minutes)

### 2.1 Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2.2 Create New Project
1. Click "Add New..." → "Project"
2. Click "Import Git Repository"
3. Find and select: `jaminhassan-debug/jays-ai-playbook`
4. Click "Import"

### 2.3 Add Environment Variables
When Vercel asks for environment variables, add these **EXACTLY**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | [Paste your Supabase anon key] |
| `STRIPE_SECRET_KEY` | `sk_test_51234...` (use test key for now) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51234...` (use test key for now) |

### 2.4 Deploy
Click "Deploy" and wait 2-3 minutes.

You'll get a URL like: `https://jays-ai-playbook.vercel.app`

✅ **Your site is now live!**

---

## ✅ PHASE 3: POPULATE SUPABASE (5 minutes)

### 3.1 Go to Supabase Dashboard
Visit: https://app.supabase.com

### 3.2 Select Your Project
Click on project: `prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM`

### 3.3 Open SQL Editor
In left sidebar, click: "SQL Editor"

### 3.4 Create New Query
Click: "New Query"

### 3.5 Paste Seed Data
1. In VS Code, open: `scripts/seed.sql`
2. **Select ALL** the SQL code (Ctrl+A)
3. **Copy** (Ctrl+C)
4. Paste into Supabase SQL Editor
5. Click the **blue "Run" button**

Wait for completion message.

✅ **Your database is now populated with:**
- 4 Products
- 5 Premium Prompts  
- 3 Sample Articles

---

## ✅ PHASE 4: VERIFY EVERYTHING (2 minutes)

### 4.1 Test Homepage
Visit your Vercel URL (e.g., `https://jays-ai-playbook.vercel.app`)

You should see:
- ✅ Header with navigation
- ✅ Hero section with title
- ✅ 3 article cards showing

### 4.2 Test Products Page
Visit: `/products`

You should see:
- ✅ "Our Products" heading
- ✅ 4 product cards with buy buttons

### 4.3 Test Prompts Page
Visit: `/prompts`

You should see:
- ✅ "Premium Prompts" heading
- ✅ 5 prompt cards with content

### 4.4 Test Dynamic Routes
Click "Read More" on any article

You should see:
- ✅ Full article page with title
- ✅ Article content

---

## 🎉 YOU'RE DONE!

Your AI Playbook is now:
- ✅ Live on Vercel
- ✅ Connected to Supabase
- ✅ Ready for payments
- ✅ Auto-deploys on git push

---

## ⚙️ NEXT (OPTIONAL)

### Add Real Stripe Keys
1. Get live keys from Stripe
2. Update environment variables in Vercel
3. Test payments with real card info

### Add Custom Domain
1. In Vercel dashboard
2. Click "Domains"
3. Add your domain

### Enable GitHub Actions
- Your GitHub workflow in `.github/workflows/generate.yml` is ready
- It will auto-generate content daily

---

## 🆘 TROUBLESHOOTING

**Articles not showing?**
- Check Supabase: Are articles in `articles` table with `status = 'published'`?
- Check Vercel env vars: Are they set correctly?

**Build failed?**
- Check Dependencies: Run `npm install` locally first
- Test build: Run `npm run build` to see errors

**Push to GitHub failed?**
- Check remote: `git remote -v`
- Verify repo exists: https://github.com/jaminhassan-debug/jays-ai-playbook
- Check auth: Try `git push origin main` (no `-u` flag)

---

**Need help? Check these files:**
- Technical details: `DEPLOYMENT.md`
- Quick reference: `QUICKSTART.md`
- Status: `STATUS.md`