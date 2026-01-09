import React from 'react';
import { getApprovalBadgeConfig } from '../utils/approvalUtils';
import '../styles/approval.css';

/**
 * ApprovalBadge - Visual indicator for approval status
 * @param {Object} props
 * @param {string} props.approvalStatus - 'pending' | 'approved' | 'rejected' | null
 * @param {boolean} props.requiresApproval - Whether approval is required
 * @param {boolean} props.compact - Use compact display
 */
const ApprovalBadge = ({ approvalStatus, requiresApproval, compact = false }) => {
    if (!requiresApproval) return null;

    const config = getApprovalBadgeConfig(approvalStatus);

    return (
        <span className={`approval-badge ${config.className} ${compact ? 'compact' : ''}`}>
            <span className="approval-icon">{config.icon}</span>
            {!compact && <span className="approval-label">{config.label}</span>}
        </span>
    );
};

export default ApprovalBadge;
