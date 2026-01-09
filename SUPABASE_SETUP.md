# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `ops-handover` (or your choice)
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
5. Click "Create new project" (takes ~2 minutes)

## Step 2: Run Database Migration

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (bottom right)
6. You should see "Success. No rows returned"

## Step 3: Verify Tables Created

1. Click **Table Editor** in the left sidebar
2. You should see these tables:
   - handovers
   - domains
   - checks
   - approvals
   - evidence

## Step 4: Get Your Credentials

1. Click **Project Settings** (gear icon in left sidebar)
2. Click **API** in the settings menu
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 5: Provide Credentials

Once you have the URL and anon key, provide them to me and I'll:
- Create the `.env.local` file
- Set up the Supabase client
- Create API services
- Migrate your mock data
- Update components to use the database

---

## Troubleshooting

**If migration fails:**
- Check for syntax errors in the SQL
- Make sure you copied the entire file
- Try running sections separately

**If tables don't appear:**
- Refresh the Table Editor page
- Check the SQL Editor for error messages

**Need help?**
Just let me know where you're stuck!
