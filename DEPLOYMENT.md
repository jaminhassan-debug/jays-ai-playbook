# Deployment Guide

## Step 1: Push to GitHub

```bash
cd /workspaces/jays-ai-playbook

# Initialize git if not already done
git init

# Configure git
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: AI playbook platform with Supabase, Stripe, and Vercel"

# Add your GitHub repository as remote
git remote add origin https://github.com/jaminhassan-debug/jays-ai-playbook.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository `jaminhassan-debug/jays-ai-playbook`
4. Set Environment Variables in Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Click "Deploy"

Your site will be live at: `https://jays-ai-playbook.vercel.app`

## Step 3: Populate Supabase Tables

### Option A: Using Supabase Dashboard (Recommended for first-time)

1. Go to your Supabase project dashboard
2. Navigate to the SQL editor
3. Paste the contents of `scripts/seed.sql`
4. Click "Run"

This will populate:
- **products** table (4 products)
- **prompts** table (5 premium prompts)
- **articles** table (3 sample articles)

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Run seed script
supabase db push
```

## Step 4: Verify Setup

1. Check Vercel deployment at: `https://jays-ai-playbook.vercel.app`
2. Verify articles display on homepage
3. Check `/products` page shows items
4. Check `/prompts` page shows premium content

## Troubleshooting

**Articles not showing?**
- Verify Supabase keys in Vercel environment variables
- Check that articles have `status = 'published'`

**Products not showing?**
- Ensure products table has data
- Check browser console for errors

**Build errors?**
- Run `npm install` locally
- Run `npm run build` to test build

## Environment Variables Reference

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Next Steps

After deployment:
1. Test checkout flow with Stripe test keys first
2. Add Google Analytics
3. Set up email automation
4. Configure custom domain
