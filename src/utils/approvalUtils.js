/**
 * Utility functions for approval and evidence management
 */

/**
 * Determine if a check can be marked Ready based on approval requirements
 * @param {Object} check - The check object
 * @returns {boolean} - True if check can be marked Ready
 */
export const canMarkReady = (check) => {
    if (!check.requiresApproval) return true;
    return check.approvalStatus === 'approved';
};

/**
 * Get the latest approval decision from approvals array
 * @param {Array} approvals - Array of approval objects
 * @returns {Object|null} - Latest approval or null
 */
export const getLatestApproval = (approvals) => {
    if (!approvals || approvals.length === 0) return null;
    return approvals.sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    )[0];
};

/**
 * Calculate approval status from approvals array
 * @param {Array} approvals - Array of approval objects
 * @param {boolean} requiresApproval - Whether approval is required
 * @returns {string|null} - 'pending' | 'approved' | 'rejected' | null
 */
export const calculateApprovalStatus = (approvals, requiresApproval) => {
    if (!requiresApproval) return null;
    const latest = getLatestApproval(approvals);
    if (!latest) return 'pending';
    return latest.decision === 'approved' ? 'approved' : 'rejected';
};

/**
 * Validate if check has required evidence
 * @param {Array} evidence - Array of evidence objects
 * @param {number} minRequired - Minimum number of evidence items required
 * @returns {boolean} - True if evidence requirement is met
 */
export const hasRequiredEvidence = (evidence, minRequired = 1) => {
    return evidence && evidence.length >= minRequired;
};

/**
 * Get approval status badge configuration
 * @param {string} approvalStatus - The approval status
 * @returns {Object} - Badge configuration with label, color, icon
 */
export const getApprovalBadgeConfig = (approvalStatus) => {
    const configs = {
        pending: {
            label: 'Pending Approval',
            color: 'warning',
            icon: '🟡',
            className: 'approval-badge-pending'
        },
        approved: {
            label: 'Approved',
            color: 'success',
            icon: '🟢',
            className: 'approval-badge-approved'
        },
        rejected: {
            label: 'Rejected',
            color: 'danger',
            icon: '🔴',
            className: 'approval-badge-rejected'
        }
    };

    return configs[approvalStatus] || {
        label: 'No Approval Required',
        color: 'neutral',
        icon: '⚪',
        className: 'approval-badge-none'
    };
};

/**
 * Format timestamp for display
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Formatted date string
 */
export const formatApprovalTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }
};

/**
 * Get evidence type icon
 * @param {string} type - Evidence type (document, link, screenshot)
 * @returns {string} - Icon emoji
 */
export const getEvidenceTypeIcon = (type) => {
    const icons = {
        document: '📄',
        link: '🔗',
        screenshot: '📸',
        video: '🎥'
    };
    return icons[type] || '📎';
};

/**
 * Validate evidence URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidEvidenceUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Check if user can approve a check
 * @param {Object} check - The check object
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 * @returns {boolean} - True if user can approve
 */
export const canUserApprove = (check, userId, userRole) => {
    // For MVP, allow check owner and admins to approve
    // In production, this would check against approval matrix
    if (!check.requiresApproval) return false;

    // Simple logic: owner can approve, or specific roles
    const approverRoles = ['admin', 'audit', 'compliance', 'security'];
    return check.owner === userId || approverRoles.includes(userRole?.toLowerCase());
};
