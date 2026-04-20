# Deployment Guide

We recommend using **Vercel** to deploy this application, as it is the creator of Next.js and provides first-class support for it. This repository is already fully optimized to deploy cleanly on Vercel without any code changes.

## Prerequisites
1. A GitHub account.
2. A deployed production Supabase project (which holds your `LIVE` database).

---

## Step 1: Push to GitHub
If you haven't already, commit your code and push it to a new GitHub repository:

```bash
git init
git add .
git commit -m "Agency ERP Initial Commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New** > **Project**.
3. You will see a list of your GitHub repositories. Click **Import** on the `agency-erp` repository.
4. Keep the Framework Preset as **Next.js**.

## Step 3: Add Environment Variables
Before clicking "Deploy", you must provide your production Supabase keys so the app knows where your production data lives.

Open the **Environment Variables** tab and add the following two variables (you can find these in your Supabase project under Settings > API):
*   `NEXT_PUBLIC_SUPABASE_URL` — e.g. `https://xxx.supabase.co`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY` — (Copy the `anon` `public` key from Supabase).

## Step 4: Click Deploy!
Your application will automatically build using `npm run build` and launch. Any future commits pushed to your GitHub `main` branch will seamlessly trigger an automatic production update.

---
> [!NOTE]
> If you wish to test deployment locally via CLI without GitHub, open a terminal here and simply type: `npx vercel`. It will ask you to login to Vercel and then push the assets!
