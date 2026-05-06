# 🎯 30-SECOND DEPLOY CARD

## Terminal Commands (Copy & Paste Each)

```bash
git config user.name "Your Name" && git config user.email "your@email.com"
```

```bash
git add . && git commit -m "Deploy: AI playbook platform"
```

```bash
git branch -M main && git push -u origin main
```

✅ **GitHub done!**

---

## Browser Steps

**Step 1:** Go to https://vercel.com/new
- Import: `jaminhassan-debug/jays-ai-playbook`
- Add 4 env variables (see DEPLOY_CHECKLIST.md)
- Click Deploy

✅ **Site is live!**

**Step 2:** Go to https://app.supabase.com
- Select your project
- SQL Editor → New Query
- Copy all from `scripts/seed.sql`
- Click Run

✅ **Data loaded!**

---

## Test

Visit your Vercel URL:
- `/` - See articles
- `/products` - See products
- `/prompts` - See prompts

---

## You're Done! 🎉

**Total time:** ~15 minutes
**Your platform:** LIVE & REVENUE-READY