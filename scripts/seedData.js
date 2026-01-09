/**
 * Seed Data Script for Supabase
 * Run this after setting up your .env.local file with Supabase credentials
 * 
 * Usage: node scripts/seedData.js
 */

import { createClient } from '@supabase/supabase-js';
import { mockHandovers } from '../src/data/mockData.js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.error('Please create .env.local with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Main seed function
 */
async function seedDatabase() {
    console.log('🌱 Starting database seed...\n');

    try {
        // Clear existing data (in reverse order of dependencies)
        console.log('🗑️  Clearing existing data...');
        await supabase.from('evidence').delete().neq('id', 0);
        await supabase.from('approvals').delete().neq('id', 0);
        await supabase.from('checks').delete().neq('id', 0);
        await supabase.from('domains').delete().neq('id', 0);
        await supabase.from('handovers').delete().neq('id', 0);
        console.log('✅ Existing data cleared\n');

        // Seed each handover
        for (const mockHandover of mockHandovers) {
            console.log(`📦 Seeding handover: ${mockHandover.name}`);

            // Insert handover
            const { data: handover, error: handoverError } = await supabase
                .from('handovers')
                .insert([{
                    name: mockHandover.name,
                    description: mockHandover.description,
                    lead: mockHandover.lead,
                    owner: mockHandover.owner,
                    target_date: mockHandover.targetDate,
                    status: mockHandover.status,
                    score: mockHandover.score
                }])
                .select()
                .single();

            if (handoverError) throw handoverError;
            console.log(`  ✓ Handover created (ID: ${handover.id})`);

            // Insert domains
            if (mockHandover.domains && mockHandover.domains.length > 0) {
                for (const mockDomain of mockHandover.domains) {
                    const { data: domain, error: domainError } = await supabase
                        .from('domains')
                        .insert([{
                            handover_id: handover.id,
                            title: mockDomain.title,
                            sort_order: 0
                        }])
                        .select()
                        .single();

                    if (domainError) throw domainError;
                    console.log(`    ✓ Domain: ${mockDomain.title} (ID: ${domain.id})`);

                    // Insert checks
                    if (mockDomain.checks && mockDomain.checks.length > 0) {
                        for (const mockCheck of mockDomain.checks) {
                            const { data: check, error: checkError } = await supabase
                                .from('checks')
                                .insert([{
                                    domain_id: domain.id,
                                    title: mockCheck.title,
                                    status: mockCheck.status,
                                    owner: mockCheck.owner,
                                    blocker_reason: mockCheck.blockerReason || null,
                                    requires_approval: mockCheck.requiresApproval || false,
                                    approval_status: mockCheck.approvalStatus || null,
                                    sort_order: 0
                                }])
                                .select()
                                .single();

                            if (checkError) throw checkError;
                            console.log(`      ✓ Check: ${mockCheck.title} (ID: ${check.id})`);

                            // Insert approvals
                            if (mockCheck.approvals && mockCheck.approvals.length > 0) {
                                for (const mockApproval of mockCheck.approvals) {
                                    const { error: approvalError } = await supabase
                                        .from('approvals')
                                        .insert([{
                                            check_id: check.id,
                                            approver: mockApproval.approver,
                                            role: mockApproval.role,
                                            decision: mockApproval.decision,
                                            comments: mockApproval.comments
                                        }]);

                                    if (approvalError) throw approvalError;
                                    console.log(`        ✓ Approval by ${mockApproval.approver}`);
                                }
                            }

                            // Insert evidence
                            if (mockCheck.evidence && mockCheck.evidence.length > 0) {
                                for (const mockEvidence of mockCheck.evidence) {
                                    const { error: evidenceError } = await supabase
                                        .from('evidence')
                                        .insert([{
                                            check_id: check.id,
                                            title: mockEvidence.title,
                                            url: mockEvidence.url,
                                            type: mockEvidence.type,
                                            description: mockEvidence.description || null,
                                            uploaded_by: mockEvidence.uploadedBy
                                        }]);

                                    if (evidenceError) throw evidenceError;
                                    console.log(`        ✓ Evidence: ${mockEvidence.title}`);
                                }
                            }
                        }
                    }
                }
            }

            console.log('');
        }

        console.log('✅ Database seeded successfully!');
        console.log('\n📊 Summary:');

        // Get counts
        const { count: handoverCount } = await supabase.from('handovers').select('*', { count: 'exact', head: true });
        const { count: domainCount } = await supabase.from('domains').select('*', { count: 'exact', head: true });
        const { count: checkCount } = await supabase.from('checks').select('*', { count: 'exact', head: true });
        const { count: approvalCount } = await supabase.from('approvals').select('*', { count: 'exact', head: true });
        const { count: evidenceCount } = await supabase.from('evidence').select('*', { count: 'exact', head: true });

        console.log(`  Handovers: ${handoverCount}`);
        console.log(`  Domains: ${domainCount}`);
        console.log(`  Checks: ${checkCount}`);
        console.log(`  Approvals: ${approvalCount}`);
        console.log(`  Evidence: ${evidenceCount}`);

    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed
seedDatabase();
