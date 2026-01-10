/**
 * Utility functions for filtering handovers in analytics drill-down
 */

/**
 * Filter handovers by readiness score range
 * @param {Array} handovers - Array of handover objects
 * @param {number} min - Minimum score (inclusive)
 * @param {number} max - Maximum score (inclusive)
 * @returns {Array} Filtered handovers
 */
export const filterByReadinessRange = (handovers, min, max) => {
    return handovers.filter(h => h.score >= min && h.score <= max);
};

/**
 * Filter handovers by status
 * @param {Array} handovers - Array of handover objects
 * @param {string} status - Status to filter by ('Ready', 'At Risk', 'Not Ready')
 * @returns {Array} Filtered handovers
 */
export const filterByStatus = (handovers, status) => {
    return handovers.filter(h => h.status === status);
};

/**
 * Filter handovers by approval status
 * @param {Array} handovers - Array of handover objects
 * @param {string} approvalStatus - 'pending', 'approved', 'rejected', or 'none'
 * @returns {Array} Filtered handovers
 */
export const filterByApprovalStatus = (handovers, approvalStatus) => {
    return handovers.filter(h => {
        // Get all checks from all domains
        const allChecks = h.domains?.flatMap(d => d.checks) || [];

        if (approvalStatus === 'none') {
            // No checks require approval
            return !allChecks.some(c => c.requiresApproval);
        }

        // Has checks with matching approval status
        return allChecks.some(c =>
            c.requiresApproval && c.approvalStatus === approvalStatus
        );
    });
};

/**
 * Filter handovers by budget adherence
 * @param {Array} handovers - Array of handover objects
 * @param {boolean} isBudgeted - true for budgeted, false for non-budgeted
 * @returns {Array} Filtered handovers
 */
export const filterByBudgetStatus = (handovers, isBudgeted) => {
    return handovers.filter(h => {
        const allChecks = h.domains?.flatMap(d => d.checks) || [];

        if (isBudgeted) {
            // All checks are budgeted
            return allChecks.length > 0 && allChecks.every(c => c.isBudgeted);
        } else {
            // Has at least one non-budgeted check
            return allChecks.some(c => !c.isBudgeted);
        }
    });
};

/**
 * Get readiness range label
 * @param {number} min - Minimum score
 * @param {number} max - Maximum score
 * @returns {string} Range label
 */
export const getReadinessRangeLabel = (min, max) => {
    if (max === 100) return `${min}-${max} (Excellent)`;
    if (min >= 81) return `${min}-${max} (Good)`;
    if (min >= 61) return `${min}-${max} (Fair)`;
    if (min >= 41) return `${min}-${max} (Poor)`;
    return `${min}-${max} (Critical)`;
};

/**
 * Get status label with emoji
 * @param {string} status - Status string
 * @returns {string} Formatted status label
 */
export const getStatusLabel = (status) => {
    const labels = {
        'Ready': '✅ Ready',
        'At Risk': '⚠️ At Risk',
        'Not Ready': '❌ Not Ready'
    };
    return labels[status] || status;
};

/**
 * Get approval status label
 * @param {string} approvalStatus - Approval status
 * @returns {string} Formatted approval label
 */
export const getApprovalStatusLabel = (approvalStatus) => {
    const labels = {
        'pending': '⏳ Pending Approval',
        'approved': '✅ Approved',
        'rejected': '❌ Rejected',
        'none': '➖ No Approval Required'
    };
    return labels[approvalStatus] || approvalStatus;
};
