#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment setup...${NC}\n"

# Step 1: Git Configuration
echo -e "${BLUE}📝 Step 1: Configuring Git${NC}"
git config user.name "AI Playbook Bot"
git config user.email "bot@jaysaiplaybook.com"

# Step 2: Stage and commit all changes
echo -e "${BLUE}📦 Step 2: Staging files${NC}"
git add .
git commit -m "feat: Full AI playbook platform with Supabase, Stripe, and Vercel integration

- Next.js frontend with dark AI theme
- Supabase database integration
- Stripe payment processing
- Product marketplace
- Premium prompts system
- Email subscription API
- Automated content generation
- Tailwind CSS styling
- SEO optimized pages
- API routes for payments and subscriptions

Ready for production deployment on Vercel." || echo "Nothing to commit (working tree clean)"

# Step 3: Push to GitHub
echo -e "${BLUE}🚀 Step 3: Pushing to GitHub${NC}"
git branch -M main
git push -u origin main

echo -e "${GREEN}✅ GitHub push complete!${NC}\n"

# Step 4: Display Vercel deployment instructions
echo -e "${BLUE}📋 Step 4: Deploy to Vercel${NC}"
echo "1. Visit: https://vercel.com/new"
echo "2. Select 'Import Git Repository'"
echo "3. Connect: jaminhassan-debug/jays-ai-playbook"
echo "4. Add Environment Variables:"
echo "   - NEXT_PUBLIC_SUPABASE_URL=https://prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM.supabase.co"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY=[your_anon_key]"
echo "   - STRIPE_SECRET_KEY=[your_stripe_secret_key]"
echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your_stripe_publishable_key]"
echo "5. Click 'Deploy'"
echo -e "${GREEN}✅ Your site will be live in 2-3 minutes!${NC}\n"

# Step 5: Display Supabase population instructions
echo -e "${BLUE}📊 Step 5: Populate Supabase${NC}"
echo "1. Go to: https://app.supabase.com"
echo "2. Select your project (prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM)"
echo "3. Go to: SQL Editor > New Query"
echo "4. Copy all content from: ./scripts/seed.sql"
echo "5. Paste and click 'Run'"
echo -e "${GREEN}✅ Your data will be loaded!${NC}\n"

echo -e "${GREEN}🎉 Setup complete! Follow steps 4 & 5 above to finish deployment.${NC}"