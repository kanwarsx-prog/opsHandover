# Quick Vercel Setup

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com/new
2. **Import**: Select your GitHub repo `kanwarsingh/opsHandover`
3. **Add Environment Variables**:
   ```
   VITE_SUPABASE_URL=https://cwnhiwghqnvjrqwsqbto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bmhpd2docW52anJxd3NxYnRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5NzE2NjcsImV4cCI6MjA4MzU0NzY2N30.hffK9fctN_-_nvcWI-jLiDMihhSS0GPtVCpZfHLTCKE
   ```
4. **Deploy**: Click "Deploy" button
5. **Done**: Your app will be live at `https://ops-handover-app.vercel.app`

## Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables when prompted
# Or set them in Vercel dashboard after deployment
```

## Custom Domain Setup

To use `ops.everydaysystems.com`:

1. In Vercel: Project Settings → Domains → Add `ops.everydaysystems.com`
2. In GoDaddy DNS: Add CNAME record:
   - Name: `ops`
   - Value: `cname.vercel-dns.com`

---

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.
