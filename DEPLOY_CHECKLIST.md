# ⚡ DEPLOYMENT CHECKLIST

Copy & paste these commands in order into your terminal at `/workspaces/jays-ai-playbook`:

## GitHub Push (Copy & Paste Each Line)

```bash
git config user.name "Your Name"
```

```bash
git config user.email "your@email.com"
```

```bash
git add .
```

```bash
git commit -m "feat: Full AI playbook platform - production ready"
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

---

## ✅ If You See This: SUCCESS!
```
Enumerating objects: ...
Counting objects: ...
Writing objects: ...
[new branch]      main -> main
Branch 'main' set up to track 'origin/main'.
```

---

## Next: Browser Steps (Copy URLs)

1. **Deploy to Vercel**
   Open: https://vercel.com/new
   - Import `jaminhassan-debug/jays-ai-playbook`
   - Add env vars (see MANUAL_DEPLOY.md)
   - Click "Deploy"

2. **Populate Database**
   Open: https://app.supabase.com
   - Select project
   - SQL Editor → New Query
   - Copy all from `scripts/seed.sql`
   - Click "Run"

3. **Test Live Site**
   Visit your Vercel URL
   - Check homepage has articles
   - Check /products has products
   - Check /prompts has prompts

---

## 🎉 DONE!

Your platform is now:
- Live on Vercel
- Connected to Supabase
- Ready for revenue