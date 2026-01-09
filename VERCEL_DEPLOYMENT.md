# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Your code is already pushed to GitHub
3. **Supabase Credentials**: You have these from earlier setup

---

## Deployment Steps

### Step 1: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository: `kanwarsingh/opsHandover`
4. Click "Import"

### Step 2: Configure Build Settings

Vercel should auto-detect Vite. Verify these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

**CRITICAL**: Add these environment variables in Vercel:

1. Click "Environment Variables" section
2. Add the following variables:

**Variable 1:**
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://cwnhiwghqnvjrqwsqbto.supabase.co`
- **Environment**: Production, Preview, Development (select all)

**Variable 2:**
- **Name**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bmhpd2docW52anJxd3NxYnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzE2NjcsImV4cCI6MjA4MzU0NzY2N30.hffK9fctN_-_nvcWI-jLiDMihhSS0GPtVCpZfHLTCKE`
- **Environment**: Production, Preview, Development (select all)

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~1-2 minutes)
3. Vercel will provide a URL like: `https://ops-handover-app.vercel.app`

### Step 5: Configure Custom Domain (Optional)

If you want to use `ops.everydaysystems.com`:

1. In Vercel project settings, go to "Domains"
2. Add custom domain: `ops.everydaysystems.com`
3. Vercel will provide DNS records
4. Add these records in your GoDaddy DNS:
   - **Type**: CNAME
   - **Name**: ops
   - **Value**: `cname.vercel-dns.com`
5. Wait for DNS propagation (5-30 minutes)

---

## Automatic Deployments

Once configured, Vercel will automatically deploy:
- **Production**: Every push to `master` branch
- **Preview**: Every pull request

---

## Verification Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Dashboard shows handovers from Supabase
- [ ] Can navigate to workspace
- [ ] Status updates persist
- [ ] No console errors related to environment variables

---

## Troubleshooting

### Issue: "Supabase not configured" warning

**Solution**: Verify environment variables are set correctly in Vercel:
1. Go to Project Settings > Environment Variables
2. Check both variables are present
3. Redeploy if needed

### Issue: Build fails

**Solution**: Check build logs in Vercel dashboard for specific errors

### Issue: App loads but no data

**Solution**: 
1. Check browser console for Supabase errors
2. Verify Supabase RLS policies allow anonymous access
3. Check environment variables are correct

---

## Quick Deploy Button (Optional)

You can add this to your README for one-click deploys:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kanwarsingh/opsHandover&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY)
```

---

## Next Steps After Deployment

1. **Test Production**: Verify all features work on live URL
2. **Share URL**: Send to stakeholders for feedback
3. **Monitor**: Check Vercel Analytics for usage
4. **Iterate**: Make updates and push to GitHub for auto-deploy
