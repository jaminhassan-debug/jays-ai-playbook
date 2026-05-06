#!/bin/bash

#############################################################################
#              SUPABASE DATABASE POPULATION HELPER                          #
#  This script prepares the seed data and shows you how to load it         #
#############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}    SUPABASE DATABASE POPULATION HELPER${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Verify seed.sql exists
if [ ! -f "scripts/seed.sql" ]; then
    echo "❌ scripts/seed.sql not found!"
    exit 1
fi

log_success "Found scripts/seed.sql"

# Copy seed file to root for easy access
cp scripts/seed.sql ./SEED_DATA.sql
log_success "Copied seed data to: SEED_DATA.sql"

# Show seed data info
echo -e "\n${BLUE}═══ SEED DATA SUMMARY ═══${NC}"
echo ""
echo "📦 What will be loaded:"
echo "   • 4 Products"
echo "   • 5 Premium Prompts"
echo "   • 3 Articles"
echo ""
echo "📊 Database tables:"
echo "   • products"
echo "   • prompts"
echo "   • articles"
echo "   • email_subscribers (empty, ready for your list)"
echo "   • facebook_posts (empty, ready for automation)"

# Create Supabase instructions
cat > SUPABASE_SETUP.md << 'EOF'
# Supabase Database Population

## Step 1: Go to Supabase Dashboard
→ https://app.supabase.com

## Step 2: Select Your Project
→ Project: prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM

## Step 3: Open SQL Editor
→ Left sidebar: "SQL Editor"
→ Click: "New Query"
→ Or click the + icon

## Step 4: Load Seed Data
→ Use one of these methods:

### Method A: Copy-Paste (Easiest)
1. Open: SEED_DATA.sql (in this folder)
2. Select All: Ctrl+A (or Cmd+A)
3. Copy: Ctrl+C (or Cmd+C)
4. Go back to Supabase SQL Editor
5. Paste: Ctrl+V (or Cmd+V)
6. Click: "Run" (blue button)

### Method B: Upload File
1. In SQL Editor
2. Click: "Upload File" (if available)
3. Select: SEED_DATA.sql
4. Click: "Run"

### Method C: Via Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Push seed
psql postgresql://... < SEED_DATA.sql
```

## Step 5: Verify
After clicking Run, you should see:
- ✅ Query executed successfully
- ✅ 4 rows inserted into products
- ✅ 5 rows inserted into prompts
- ✅ 3 rows inserted into articles

## What Was Loaded

### Products Table (4 items)
1. AI Writing Prompts Pack - $29.99
2. ChatGPT Master Course - $99.99
3. Prompt Engineering Playbook - $49.99
4. AI Automation Template Pack - $39.99

### Prompts Table (5 items)
1. Advanced Content Creation
2. Deep Research Assistant
3. Email Campaign Writer
4. Product Launch Strategy
5. SEO Content Optimizer

### Articles Table (3 items)
1. The Complete Guide to Prompt Engineering
2. AI Tools 2024: The Complete Stack
3. How to Build a $100K AI Business in 90 Days

## Next Steps
1. Go to your Vercel URL
2. Check homepage - should show 3 articles
3. Check /products - should show 4 products
4. Check /prompts - should show 5 prompts
5. Click around to verify everything works

## Testing Queries

To verify data was loaded, run these in SQL Editor:

```sql
-- Check products
SELECT COUNT(*) FROM products;
-- Should return: 4

-- Check prompts
SELECT COUNT(*) FROM prompts;
-- Should return: 5

-- Check articles
SELECT COUNT(*) FROM articles;
-- Should return: 3
```

## Troubleshooting

**Error: "relation 'products' does not exist"**
→ Your tables haven't been created yet
→ Go to your Supabase schema and run the table creation SQL first

**Error: "duplicate key value"**
→ Data was already loaded
→ Delete the rows and try again, or just proceed (data is there)

**No errors but no data shows up**
→ Check your environment variables in Vercel
→ Make sure NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
→ Try redeploying your Vercel project

## Files Reference
- SEED_DATA.sql - All seed data
- Supabase URL: https://app.supabase.com
- Your Project: prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM

✅ Done! Your database is populated!
EOF

log_success "Created SUPABASE_SETUP.md instructions"

cat << 'EOF'

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 NEXT: POPULATE YOUR DATABASE

Option 1 (Easiest):
  1. Open: SEED_DATA.sql
  2. Select All: Ctrl+A
  3. Copy: Ctrl+C
  4. Go to: https://app.supabase.com
  5. SQL Editor → New Query
  6. Paste: Ctrl+V
  7. Click: Run

Option 2 (Full Details):
  → Open: SUBABASE_SETUP.md (in this folder)
  → Follow step-by-step instructions

Time needed: ~2 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Ready to populate!

🔗 Supabase URL: https://app.supabase.com
📁 Project ID: prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM
📄 Seed file: SEED_DATA.sql

EOF

log_success "Supabase population helper complete"
