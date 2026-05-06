#!/bin/bash
# JAY'S AI PLAYBOOK - AUTOMATED DEPLOYMENT COMMANDS
# Copy & Paste these into your terminal one at a time

echo "🚀 Starting deployment..."

# ============================================
# STEP 1: CONFIGURE GIT USER
# ============================================

git config user.name "AI Playbook Developer"
git config user.email "developer@jaysaiplaybook.com"

# ============================================
# STEP 2: VIEW CHANGES
# ============================================

git status

# ============================================
# STEP 3: STAGE ALL FILES
# ============================================

git add .

# ============================================
# STEP 4: CREATE INITIAL COMMIT
# ============================================

git commit -m "feat: Complete AI playbook platform with Supabase, Stripe, and Vercel

Production-ready features:
- Next.js + React frontend with Tailwind CSS
- Dark AI-themed user interface  
- Supabase database integration
- Stripe payment processing
- Product marketplace (4 products)
- Premium prompts library (5 prompts)
- Article publishing system (3 sample articles)
- Email subscription system
- Dynamic routing and SEO optimization
- GitHub Actions CI/CD workflow
- Responsive mobile-friendly design
- API routes for payments and subscriptions

Environment configured for:
- Local development with .env.local
- Vercel cloud deployment
- Supabase database

Ready to deploy and monetize!"

# ============================================
# STEP 5: PUSH TO GITHUB
# ============================================

git branch -M main
git push -u origin main

# ============================================
# STEP 6: VERIFY PUSH
# ============================================

echo ""
echo "✅ Push complete!"
echo ""
echo "📋 NEXT STEPS (Do in browser):"
echo ""
echo "1. DEPLOY TO VERCEL (3 minutes)"
echo "   URL: https://vercel.com/new"
echo "   - Select: jaminhassan-debug/jays-ai-playbook"
echo "   - Add environment variables (see MANUAL_DEPLOY.md)"
echo "   - Click Deploy"
echo ""
echo "2. POPULATE SUPABASE (2 minutes)"
echo "   URL: https://app.supabase.com"
echo "   - SQL Editor → New Query"
echo "   - Copy from: scripts/seed.sql"
echo "   - Click Run"
echo ""
echo "3. TEST YOUR SITE (2 minutes)"
echo "   - Visit your Vercel URL"
echo "   - Check /, /products, /prompts"
echo ""
echo "🎉 You'll be live in ~15 minutes!"