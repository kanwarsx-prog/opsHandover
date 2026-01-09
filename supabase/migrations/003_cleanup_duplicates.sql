-- Cleanup Script: Remove Duplicate Templates
-- Run this BEFORE running 003_seed_templates.sql again

-- Delete all existing template data (cascades to domains and checks)
DELETE FROM template_libraries WHERE category = 'system';

-- This will also delete all related template_domains and template_checks
-- due to the CASCADE delete constraints
