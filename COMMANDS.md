# 🚀 DEPLOYMENT COMMANDS - COPY & PASTE

Run these commands one by one in your terminal inside `/workspaces/jays-ai-playbook`:

## Step 1: Configure Git

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
```

## Step 2: Commit All Changes

```bash
git add .
git commit -m "feat: Full AI playbook platform with Supabase, Stripe, and Vercel integration

- Next.js frontend with dark AI theme
- Supabase database integration  
- Stripe payment processing
- Product marketplace
- Premium prompts system
- Email subscription API
- Automated content generation
- Tailwind CSS styling"
```

## Step 3: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

**Status:** ✅ You should see confirmation that files are pushed

---

## Step 4: Deploy to Vercel (Do in Browser)

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Click "Import" and select: `jaminhassan-debug/jays-ai-playbook`
4. When asked for environment variables, add these 4:

```
NEXT_PUBLIC_SUPABASE_URL = https://prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = [PASTE YOUR ANON KEY HERE]
STRIPE_SECRET_KEY = sk_test_... (use test key for now)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_... (use test key for now)
```

5. Click "Deploy"
6. Wait 2-3 minutes
7. You'll get a deployment URL

---

## Step 5: Populate Supabase (Do in Browser)

1. Go to https://app.supabase.com → Select your project
2. Click "SQL Editor" (left sidebar)
3. Click "New Query"
4. Go back to VS Code and open `scripts/seed.sql`
5. Copy ALL the SQL code
6. Paste it into Supabase SQL editor
7. Click "Run" button
8. Wait for completion

✅ Your tables are now populated with:
- 4 Products
- 5 Premium Prompts
- 3 Sample Articles

---

## Step 6: Test Your Site

Visit your Vercel URL:
- ✅ Homepage should show 3 articles
- ✅ /products should show 4 products  
- ✅ /prompts should show 5 prompts
- ✅ Click "Read More" to test dynamic routes

---

## 🎉 You're Live!

Your platform is now:
- Live on Vercel
- Connected to Supabase
- Ready for Stripe payments
- Auto-deploying from GitHub

Every time you `git push`, Vercel automatically redeploys!