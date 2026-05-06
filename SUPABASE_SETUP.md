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
