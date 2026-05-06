#!/usr/bin/env python3
"""
Automated deployment script for Jay's AI Playbook
Handles git operations and provides deployment instructions
"""

import subprocess
import sys
import os

def run_command(cmd, description):
    """Run a shell command and handle errors"""
    print(f"\n📝 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd='/workspaces/jays-ai-playbook')
        if result.returncode == 0:
            print(f"✅ {description} - SUCCESS")
            if result.stdout:
                print(result.stdout)
            return True
        else:
            print(f"❌ {description} - FAILED")
            if result.stderr:
                print(result.stderr)
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    print("\n" + "="*60)
    print("🚀 JAY'S AI PLAYBOOK - AUTOMATED DEPLOYMENT")
    print("="*60)
    
    os.chdir('/workspaces/jays-ai-playbook')
    
    # Step 1: Configure Git
    print("\n>>> STEP 1: GIT CONFIGURATION")
    run_command('git config user.name "AI Playbook Bot"', "Setting git user name")
    run_command('git config user.email "bot@jaysaiplaybook.com"', "Setting git user email")
    
    # Step 2: Stage all files
    print("\n>>> STEP 2: STAGING FILES")
    run_command('git add .', "Staging all files")
    
    # Step 3: Commit
    print("\n>>> STEP 3: CREATING COMMIT")
    commit_msg = """feat: Full AI playbook platform with Supabase, Stripe, and Vercel integration

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

Ready for production deployment on Vercel."""
    
    cmd = f'git commit -m "{commit_msg}"'
    run_command(cmd, "Creating initial commit")
    
    # Step 4: Push to GitHub
    print("\n>>> STEP 4: PUSHING TO GITHUB")
    run_command('git branch -M main', "Ensuring main branch")
    run_command('git push -u origin main', "Pushing to GitHub main branch")
    
    # Print success message and next steps
    print("\n" + "="*60)
    print("✅ GITHUB PUSH COMPLETE!")
    print("="*60)
    
    print("\n📋 NEXT STEPS:")
    print("""
1. DEPLOY TO VERCEL (3 minutes)
   - Visit: https://vercel.com/new
   - Click "Import Git Repository"
   - Select: jaminhassan-debug/jays-ai-playbook
   - Add Environment Variables:
     * NEXT_PUBLIC_SUPABASE_URL=https://prj_nP7rSQ3zfO8dkHiBkFnVrHvlAxaM.supabase.co
     * NEXT_PUBLIC_SUPABASE_ANON_KEY=[your_anon_key]
     * STRIPE_SECRET_KEY=[your_stripe_secret_key]
     * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your_stripe_publishable_key]
   - Click "Deploy"

2. POPULATE SUPABASE (2 minutes)
   - Go to: https://app.supabase.com
   - Select your project
   - Go to: SQL Editor > New Query
   - Copy ALL content from: scripts/seed.sql
   - Paste into editor and click "Run"

3. TEST YOUR SITE
   - Visit your Vercel URL
   - Check homepage shows 3 articles
   - Check /products shows 4 products
   - Check /prompts shows 5 prompts

🎉 YOUR SITE WILL BE LIVE!
""")

if __name__ == '__main__':
    main()
