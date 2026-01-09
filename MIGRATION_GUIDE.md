# Database Migration Guide - Phase 1 Enhancements

## Overview
This guide explains how to apply the Phase 1 database migrations for the OpsHandover enhancements.

## Migration Files
1. `002_enhancements_phase1.sql` - Core schema changes
2. `003_seed_templates.sql` - Template data migration

## Prerequisites
- Supabase project set up and running
- Database connection credentials in `.env.local`
- Supabase CLI installed (optional, for local testing)

## Running Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Log in to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `002_enhancements_phase1.sql`
5. Click **Run**
6. Wait for completion (should show "Success")
7. Repeat steps 3-6 for `003_seed_templates.sql`

### Option 2: Supabase CLI
```bash
# Navigate to project directory
cd c:\Apps\opsHandover\ops-handover-app

# Run migrations
supabase db push

# Or run specific migration
supabase db execute --file supabase/migrations/002_enhancements_phase1.sql
supabase db execute --file supabase/migrations/003_seed_templates.sql
```

### Option 3: Node.js Script
```bash
# Run the migration script
npm run migrate
```

## Verification

After running the migrations, verify the changes:

```sql
-- Check new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'template_libraries',
    'template_domains', 
    'template_checks',
    'handover_history'
);

-- Verify system templates were created
SELECT id, name, category FROM template_libraries;

-- Check evidence table columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'evidence';
```

## Rollback (if needed)

If you need to rollback the migrations:

```sql
-- Drop new tables
DROP TABLE IF EXISTS template_checks CASCADE;
DROP TABLE IF NOT EXISTS template_domains CASCADE;
DROP TABLE IF EXISTS template_libraries CASCADE;
DROP TABLE IF EXISTS handover_history CASCADE;

-- Remove evidence columns
ALTER TABLE evidence 
    DROP COLUMN IF EXISTS tags,
    DROP COLUMN IF EXISTS description,
    DROP COLUMN IF EXISTS file_size,
    DROP COLUMN IF EXISTS file_type,
    DROP COLUMN IF EXISTS uploaded_by,
    DROP COLUMN IF EXISTS uploaded_at;

-- Drop functions
DROP FUNCTION IF EXISTS calculate_handover_metrics(BIGINT);
DROP FUNCTION IF EXISTS record_handover_snapshot(BIGINT);
DROP FUNCTION IF EXISTS update_updated_at_column();
```

## Next Steps

After successful migration:
1. ✅ Update task.md to mark database setup as complete
2. ✅ Begin implementing template service layer
3. ✅ Start building template library UI components

## Troubleshooting

**Error: relation already exists**
- This is safe to ignore if re-running migrations
- The `IF NOT EXISTS` clauses prevent errors

**Error: permission denied**
- Ensure you're using the correct database credentials
- Check that RLS policies allow your operations

**Error: foreign key constraint**
- Ensure migrations run in order (002 before 003)
- Check that referenced tables exist

## Support
For issues, check the Supabase logs in the dashboard under **Logs** > **Postgres Logs**.
