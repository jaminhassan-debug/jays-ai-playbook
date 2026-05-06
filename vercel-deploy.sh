#!/bin/bash

#############################################################################
#                   AUTOMATED VERCEL DEPLOYMENT                            #
#  This script automates the Vercel deployment via CLI                     #
#############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    VERCEL DEPLOYMENT HELPER${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    log_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
    log_success "Vercel CLI installed"
fi

# Create .vercelignore
cat > .vercelignore << 'EOF'
.git
.gitignore
node_modules
npm-debug.log
.DS_Store
.env.local
.next
out
EOF

log_success "Created .vercelignore"

# Prepare env variables template
cat > .env.deployment << 'EOF'
# Copy these into Vercel Dashboard → Project Settings → Environment Variables

NEXT_PUBLIC_SUPABASE_URL=https://prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY
EOF

log_success "Created .env.deployment template"

cat << 'EOF'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 MANUAL VERCEL DEPLOYMENT STEPS:

1. LOGIN TO VERCEL
   → Go to: https://vercel.com/dashboard
   → Sign up if needed (use GitHub)

2. CREATE NEW PROJECT
   → Click: "New Project" or "Add New..."
   → Click: "Import Git Repository"
   → Find: jaminhassan-debug/jays-ai-playbook
   → Click: "Import"

3. ADD ENVIRONMENT VARIABLES
   The system will ask for environment variables.
   
   Add these EXACTLY (copy from .env.deployment file):

   NEXT_PUBLIC_SUPABASE_URL:
   https://prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM.supabase.co

   NEXT_PUBLIC_SUPABASE_ANON_KEY:
   [Get from: https://app.supabase.com → Settings → API → anon public]

   STRIPE_SECRET_KEY:
   [Get from: https://dashboard.stripe.com → API Keys]

   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
   [Get from: https://dashboard.stripe.com → API Keys]

4. DEPLOY
   → Click: "Deploy"
   → Wait: 2-3 minutes
   → Copy: Your deployment URL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Your site will be live at a URL like:
   https://jays-ai-playbook.vercel.app

🔗 Environment variables file created at: .env.deployment
   Keep this safe, don't commit it to GitHub!

EOF

log_success "Vercel deployment setup complete"
