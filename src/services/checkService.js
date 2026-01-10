import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * Update check status
 * @param {string} checkId - Check ID (with 'c' prefix)
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated check
 */
export const updateCheckStatus = async (checkId, status) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        // Remove 'c' prefix to get numeric ID
        const numericId = parseInt(checkId.replace('c', ''));

        const { data, error } = await supabase
            .from('checks')
            .update({ status })
            .eq('id', numericId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating check status:', error);
        throw error;
    }
};

/**
 * Add approval to a check
 * @param {string} checkId - Check ID (with 'c' prefix)
 * @param {Object} approval - Approval data
 * @returns {Promise<Object>} Created approval
 */
export const addApproval = async (checkId, approval) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        const numericId = parseInt(checkId.replace('c', ''));

        // Insert approval
        const { data: approvalData, error: approvalError } = await supabase
            .from('approvals')
            .insert([{
                check_id: numericId,
                approver: approval.approver,
                role: approval.role,
                decision: approval.decision,
                comments: approval.comments
            }])
            .select()
            .single();

        if (approvalError) throw approvalError;

        // Update check approval status
        const newApprovalStatus = approval.decision === 'approved' ? 'approved' : 'rejected';
        const { error: updateError } = await supabase
            .from('checks')
            .update({ approval_status: newApprovalStatus })
            .eq('id', numericId);

        if (updateError) throw updateError;

        return {
            id: `a${approvalData.id}`,
            approver: approvalData.approver,
            role: approvalData.role,
            timestamp: approvalData.created_at,
            decision: approvalData.decision,
            comments: approvalData.comments
        };
    } catch (error) {
        console.error('Error adding approval:', error);
        throw error;
    }
};

/**
 * Add evidence to a check
 * @param {string} checkId - Check ID (with 'c' prefix)
 * @param {Object} evidence - Evidence data
 * @returns {Promise<Object>} Created evidence
 */
export const addEvidence = async (checkId, evidence) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        const numericId = parseInt(checkId.replace('c', ''));

        const { data, error } = await supabase
            .from('evidence')
            .insert([{
                check_id: numericId,
                title: evidence.title,
                url: evidence.url,
                type: evidence.type,
                description: evidence.description || null,
                uploaded_by: evidence.uploadedBy
            }])
            .select()
            .single();

        if (error) throw error;

        return {
            id: `e${data.id}`,
            title: data.title,
            url: data.url,
            type: data.type,
            description: data.description,
            uploadedBy: data.uploaded_by,
            uploadedAt: data.created_at
        };
    } catch (error) {
        console.error('Error adding evidence:', error);
        throw error;
    }
};

/**
 * Remove evidence
 * @param {string} evidenceId - Evidence ID (with 'e' prefix)
 * @returns {Promise<void>}
 */
export const removeEvidence = async (evidenceId) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        const numericId = parseInt(evidenceId.replace('e', ''));

        const { error } = await supabase
            .from('evidence')
            .delete()
            .eq('id', numericId);

        if (error) throw error;
    } catch (error) {
        console.error('Error removing evidence:', error);
        throw error;
    }
};

/**
 * Create a new domain
 * @param {number} handoverId - Handover ID
 * @param {Object} domainData - Domain data
 * @returns {Promise<Object>} Created domain
 */
export const createDomain = async (handoverId, domainData) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        const { data, error } = await supabase
            .from('domains')
            .insert([{
                handover_id: handoverId,
                title: domainData.title,
                sort_order: domainData.sortOrder || 0
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating domain:', error);
        throw error;
    }
};

/**
 * Create a new check
 * @param {number} domainId - Domain ID
 * @param {Object} checkData - Check data
 * @returns {Promise<Object>} Created check
 */
export const createCheck = async (domainId, checkData) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        const { data, error } = await supabase
            .from('checks')
            .insert([{
                domain_id: domainId,
                title: checkData.title,
                status: checkData.status || 'Not Ready',
                owner: checkData.owner,
                blocker_reason: checkData.blockerReason || null,
                requires_approval: checkData.requiresApproval || false,
                approval_status: checkData.approvalStatus || null,
                sort_order: checkData.sortOrder || 0
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating check:', error);
        throw error;
    }
};

/**
 * Delete a check
 * @param {string} checkId - Check ID (e.g., 'c123')
 * @returns {Promise<void>}
 */
export const deleteCheck = async (checkId) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        const numericId = parseInt(checkId.replace('c', ''));

        const { error } = await supabase
            .from('checks')
            .delete()
            .eq('id', numericId);

        if (error) throw error;

        console.log(`✓ Deleted check ID: ${checkId}`);
    } catch (error) {
        console.error('Error deleting check:', error);
        throw error;
    }
};

/**
 * Update a check
 * @param {string} checkId - Check ID (with 'c' prefix)
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated check
 */
export const updateCheck = async (checkId, updates) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
    }

    try {
        const numericId = parseInt(checkId.replace('c', ''));

        const dbUpdates = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.owner !== undefined) dbUpdates.owner = updates.owner;
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.blockerReason !== undefined) dbUpdates.blocker_reason = updates.blockerReason;
        if (updates.requiresApproval !== undefined) dbUpdates.requires_approval = updates.requiresApproval;

        const { data, error } = await supabase
            .from('checks')
            .update(dbUpdates)
            .eq('id', numericId)
            .select()
            .single();

        if (error) throw error;

        console.log(`✓ Updated check ID: ${checkId}`);
        return {
            id: `c${data.id}`,
            title: data.title,
            status: data.status,
            owner: data.owner,
            blockerReason: data.blocker_reason,
            requiresApproval: data.requires_approval,
            approvalStatus: data.approval_status
        };
    } catch (error) {
        console.error('Error updating check:', error);
        throw error;
    }
};
