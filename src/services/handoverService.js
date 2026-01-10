import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { mockHandovers } from '../data/mockData';

/**
 * Fetch all handovers with full nested data
 * @returns {Promise<Array>} Array of handover objects
 */
export const fetchHandovers = async () => {
    // Fallback to mock data if Supabase not configured
    if (!isSupabaseConfigured()) {
        console.log('📦 Using mock data (Supabase not configured)');
        return mockHandovers;
    }

    try {
        const { data, error } = await supabase
            .from('handovers')
            .select(`
                *,
                domains (
                    *,
                    checks (
                        *,
                        approvals (*),
                        evidence (*)
                    )
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match frontend format
        return data.map(transformHandoverFromDB);
    } catch (error) {
        console.error('Error fetching handovers:', error);
        throw error;
    }
};

/**
 * Fetch a single handover by ID
 * @param {number} id - Handover ID
 * @returns {Promise<Object>} Handover object
 */
export const fetchHandoverById = async (id) => {
    if (!isSupabaseConfigured()) {
        return mockHandovers.find(h => h.id === id);
    }

    try {
        const { data, error } = await supabase
            .from('handovers')
            .select(`
                *,
                domains (
                    *,
                    checks (
                        *,
                        approvals (*),
                        evidence (*)
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return transformHandoverFromDB(data);
    } catch (error) {
        console.error('Error fetching handover:', error);
        throw error;
    }
};

/**
 * Create a new handover
 * @param {Object} handoverData - Handover data
 * @returns {Promise<Object>} Created handover
 */
export const createHandover = async (handoverData) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('handovers')
            .insert([{
                name: handoverData.name,
                description: handoverData.description,
                lead: handoverData.lead,
                owner: handoverData.owner,
                target_date: handoverData.targetDate,
                status: handoverData.status || 'Not Ready',
                score: handoverData.score || 0,
                user_id: user.id  // Automatically set user_id
            }])
            .select()
            .single();

        if (error) throw error;
        return transformHandoverFromDB(data);
    } catch (error) {
        console.error('Error creating handover:', error);
        throw error;
    }
};

/**
 * Update a handover
 * @param {number} id - Handover ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated handover
 */
export const updateHandover = async (id, updates) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        const dbUpdates = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.lead !== undefined) dbUpdates.lead = updates.lead;
        if (updates.owner !== undefined) dbUpdates.owner = updates.owner;
        if (updates.targetDate !== undefined) dbUpdates.target_date = updates.targetDate;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.score !== undefined) dbUpdates.score = updates.score;

        const { data, error } = await supabase
            .from('handovers')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return transformHandoverFromDB(data);
    } catch (error) {
        console.error('Error updating handover:', error);
        throw error;
    }
};

/**
 * Delete a handover
 * @param {number} id - Handover ID
 * @returns {Promise<void>}
 */
export const deleteHandover = async (id) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        const { error } = await supabase
            .from('handovers')
            .delete()
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error deleting handover:', error);
        throw error;
    }
};

/**
 * Transform database handover to frontend format
 * @param {Object} dbHandover - Handover from database
 * @returns {Object} Transformed handover
 */
const transformHandoverFromDB = (dbHandover) => {
    return {
        id: dbHandover.id,
        name: dbHandover.name,
        description: dbHandover.description,
        lead: dbHandover.lead,
        owner: dbHandover.owner,
        targetDate: dbHandover.target_date,
        status: dbHandover.status,
        score: dbHandover.score,
        lastUpdated: formatRelativeTime(dbHandover.updated_at),
        domains: (dbHandover.domains || []).map(transformDomainFromDB)
    };
};

/**
 * Transform database domain to frontend format
 * @param {Object} dbDomain - Domain from database
 * @returns {Object} Transformed domain
 */
const transformDomainFromDB = (dbDomain) => {
    return {
        id: `d${dbDomain.id}`,
        title: dbDomain.title,
        checks: (dbDomain.checks || []).map(transformCheckFromDB)
    };
};

/**
 * Transform database check to frontend format
 * @param {Object} dbCheck - Check from database
 * @returns {Object} Transformed check
 */
const transformCheckFromDB = (dbCheck) => {
    return {
        id: `c${dbCheck.id}`,
        title: dbCheck.title,
        status: dbCheck.status,
        owner: dbCheck.owner,
        blockerReason: dbCheck.blocker_reason,
        requiresApproval: dbCheck.requires_approval,
        approvalStatus: dbCheck.approval_status,
        approvals: (dbCheck.approvals || []).map(transformApprovalFromDB),
        evidence: (dbCheck.evidence || []).map(transformEvidenceFromDB)
    };
};

/**
 * Transform database approval to frontend format
 * @param {Object} dbApproval - Approval from database
 * @returns {Object} Transformed approval
 */
const transformApprovalFromDB = (dbApproval) => {
    return {
        id: `a${dbApproval.id}`,
        approver: dbApproval.approver,
        role: dbApproval.role,
        timestamp: dbApproval.created_at,
        decision: dbApproval.decision,
        comments: dbApproval.comments
    };
};

/**
 * Transform database evidence to frontend format
 * @param {Object} dbEvidence - Evidence from database
 * @returns {Object} Transformed evidence
 */
const transformEvidenceFromDB = (dbEvidence) => {
    return {
        id: `e${dbEvidence.id}`,
        title: dbEvidence.title,
        url: dbEvidence.url,
        type: dbEvidence.type,
        description: dbEvidence.description,
        uploadedBy: dbEvidence.uploaded_by,
        uploadedAt: dbEvidence.created_at
    };
};

/**
 * Format timestamp to relative time
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Relative time string
 */
/**
 * Create handover with domains and checks from template
 * @param {Object} handoverData - Handover data
 * @param {Array} template - Domain template array
 * @returns {Promise<Object>} Created handover with ID
 */
export const createHandoverWithTemplate = async (handoverData, template) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        // 1. Create the handover
        const handover = await createHandover(handoverData);
        console.log(`✓ Created handover: ${handover.name} (ID: ${handover.id})`);

        // 2. Create domains and checks
        for (let domainIndex = 0; domainIndex < template.length; domainIndex++) {
            const domainTemplate = template[domainIndex];

            // Create domain
            const { data: domain, error: domainError } = await supabase
                .from('domains')
                .insert([{
                    handover_id: handover.id,
                    title: domainTemplate.title,
                    sort_order: domainIndex
                }])
                .select()
                .single();

            if (domainError) throw domainError;
            console.log(`  ✓ Created domain: ${domain.title} (ID: ${domain.id})`);

            // Create checks for this domain
            for (let checkIndex = 0; checkIndex < domainTemplate.checks.length; checkIndex++) {
                const checkTemplate = domainTemplate.checks[checkIndex];

                const { error: checkError } = await supabase
                    .from('checks')
                    .insert([{
                        domain_id: domain.id,
                        title: checkTemplate.title,
                        owner: checkTemplate.owner,
                        status: 'Not Ready',
                        requires_approval: checkTemplate.requiresApproval || false,
                        approval_status: checkTemplate.requiresApproval ? 'pending' : null,
                        sort_order: checkIndex
                    }]);

                if (checkError) throw checkError;
            }

            console.log(`    ✓ Created ${domainTemplate.checks.length} checks`);
        }

        console.log(`✅ Workspace created successfully with ${template.length} domains`);
        return handover;
    } catch (error) {
        console.error('Error creating handover with template:', error);
        throw error;
    }
};

const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Never';

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
};
