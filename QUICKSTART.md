# Quick Start: Deploy & Populate

## 🚀 1. Push to GitHub (2 minutes)

```bash
# Configure git (one-time)
git config user.name "Your Name"
git config user.email "your@email.com"

# Stage all changes
git add .

# Create first commit
git commit -m "Initial: AI playbook platform with Supabase, Stripe, and Vercel integration"

# Add GitHub remote
git remote add origin https://github.com/jaminhassan-debug/jays-ai-playbook.git

# Push to main
git branch -M main
git push -u origin main
```

## 🌐 2. Deploy to Vercel (3 minutes)

1. Visit https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. **Add Environment Variables:**
   - `NEXT_PUBLIC_SUPABASE_URL=https://prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=` [your anon key]
   - `STRIPE_SECRET_KEY=` [your Stripe secret key - use test key for now]
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=` [your Stripe public key]
5. Click "Deploy"

⚡ Your site is live! (check email for URL)

## 📊 3. Populate Supabase Data (2 minutes)

### Quick SQL Method:

1. Go to your Supabase dashboard
2. Click "SQL Editor"
3. Click "New Query"
4. Copy & paste this:

```sql
-- Products
INSERT INTO products (name, description, price, category) VALUES
  ('AI Writing Prompts Pack', 'Advanced prompts for content creation', 29.99, 'prompts'),
  ('ChatGPT Master Course', 'Complete guide to ChatGPT for professionals', 99.99, 'courses'),
  ('Prompt Engineering Playbook', 'Step-by-step guide to create perfect prompts', 49.99, 'playbooks'),
  ('AI Automation Template Pack', 'Ready-to-use automation workflows', 39.99, 'templates');

-- Prompts  
INSERT INTO prompts (title, description, content, category) VALUES
  ('Advanced Content Creation', 'Create viral-worthy content for social media', 'You are an expert content creator. Write compelling social media posts...', 'content'),
  ('Deep Research Assistant', 'Comprehensive research for any topic', 'You are a research expert...', 'research'),
  ('Email Campaign Writer', 'Write high-converting email sequences', 'You are an email marketing expert...', 'marketing'),
  ('Product Launch Strategy', 'Complete product launch playbook', 'You are a product strategist...', 'strategy'),
  ('SEO Content Optimizer', 'Optimize content for search engines', 'You are an SEO specialist...', 'seo');

-- Articles
INSERT INTO articles (title, slug, content, excerpt, category, status, published_at) VALUES
  ('The Complete Guide to Prompt Engineering', 'complete-guide-prompt-engineering', '<h2>Master the Art of Prompts</h2><p>Prompt engineering is key...</p>', 'Discover how to write prompts that get you results 10x faster', 'playbooks', 'published', NOW()),
  ('AI Tools 2024: The Complete Stack', 'ai-tools-2024-complete-stack', '<h2>Your AI Toolkit</h2><p>Here is the complete stack...</p>', 'The definitive guide to AI tools that actually work', 'playbooks', 'published', NOW()),
  ('How to Build a $100K AI Business in 90 Days', 'build-100k-ai-business-90-days', '<h2>Your AI Business Blueprint</h2><p>Follow this framework...</p>', 'The step-by-step playbook for AI founders', 'playbooks', 'published', NOW());
```

5. Click "Run"

✅ Done! Your site now has data.

## 🧪 4. Test Your Site

- Homepage: Should show 3 articles
- /products: Should show 4 products
- /prompts: Should show 5 prompts
- Click "Read More" on an article to test dynamic routing

## 💡 Using Test Keys First

**For Stripe Testing:**
- Use test keys initially (sk_test_... and pk_test_...)
- Use test card: 4242 4242 4242 4242
- Once verified, switch to live keys

## 📚 Full Documentation

See `DEPLOYMENT.md` for complete setup instructions and troubleshooting.

---

**You're now live!** 🎉

Your platform is:
- Live on Vercel
- Connected to Supabase
- Ready for payments with Stripe
- Auto-deploying when you push to GitHub