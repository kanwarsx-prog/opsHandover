import React, { useState } from 'react';
import { formatApprovalTimestamp, getLatestApproval } from '../utils/approvalUtils';
import ApprovalBadge from './ApprovalBadge';
import '../styles/approval.css';

/**
 * ApprovalPanel - Display and manage approvals for a check
 * @param {Object} props
 * @param {Object} props.check - The check object
 * @param {Function} props.onApprovalAdded - Callback when approval is added
 * @param {boolean} props.canApprove - Whether current user can approve
 */
const ApprovalPanel = ({ check, onApprovalAdded, canApprove = false }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        decision: 'approved',
        comments: ''
    });

    if (!check.requiresApproval) {
        return (
            <div className="approval-panel">
                <p className="no-approval-required">This check does not require formal approval</p>
            </div>
        );
    }

    const handleAddApproval = () => {
        if (!formData.comments.trim()) {
            alert('Please provide comments for your approval decision');
            return;
        }

        const newApproval = {
            id: `a${Date.now()}`,
            approver: 'Current User', // TODO: Get from auth context
            role: 'Current Role', // TODO: Get from auth context
            timestamp: new Date().toISOString(),
            decision: formData.decision,
            comments: formData.comments
        };

        onApprovalAdded?.(newApproval);

        // Reset form
        setFormData({ decision: 'approved', comments: '' });
        setShowAddForm(false);
    };

    const latestApproval = getLatestApproval(check.approvals);

    return (
        <div className="approval-panel">
            <div className="approval-header">
                <h4>Approvals</h4>
                <ApprovalBadge
                    approvalStatus={check.approvalStatus}
                    requiresApproval={check.requiresApproval}
                />
            </div>

            {canApprove && check.approvalStatus !== 'approved' && (
                <div className="approval-actions">
                    {!showAddForm ? (
                        <button
                            className="btn-request-approval"
                            onClick={() => setShowAddForm(true)}
                        >
                            {check.approvalStatus === 'rejected' ? 'Re-submit for Approval' : 'Add Approval'}
                        </button>
                    ) : (
                        <div className="approval-form">
                            <div className="form-group">
                                <label>Decision</label>
                                <div className="approval-decision-buttons">
                                    <button
                                        className={`btn-decision ${formData.decision === 'approved' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, decision: 'approved' })}
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        className={`btn-decision ${formData.decision === 'rejected' ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, decision: 'rejected' })}
                                    >
                                        ✕ Reject
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Comments *</label>
                                <textarea
                                    value={formData.comments}
                                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                                    placeholder="Provide rationale for your decision..."
                                    rows="3"
                                />
                            </div>

                            <div className="form-actions">
                                <button className="btn-primary" onClick={handleAddApproval}>
                                    Submit {formData.decision === 'approved' ? 'Approval' : 'Rejection'}
                                </button>
                                <button className="btn-secondary" onClick={() => setShowAddForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {check.approvals && check.approvals.length > 0 ? (
                <div className="approval-timeline">
                    {check.approvals
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                        .map((approval) => (
                            <div
                                key={approval.id}
                                className={`approval-entry ${approval.decision} ${approval.id === latestApproval?.id ? 'latest' : ''}`}
                            >
                                <div className="approval-decision-indicator">
                                    {approval.decision === 'approved' ? '✓' : '✕'}
                                </div>
                                <div className="approval-details">
                                    <div className="approval-meta">
                                        <strong>{approval.approver}</strong>
                                        <span className="approval-role">{approval.role}</span>
                                        <span className="approval-time">
                                            {formatApprovalTimestamp(approval.timestamp)}
                                        </span>
                                    </div>
                                    <div className="approval-decision-label">
                                        {approval.decision === 'approved' ? 'Approved' : 'Rejected'}
                                    </div>
                                    {approval.comments && (
                                        <div className="approval-comments">
                                            "{approval.comments}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            ) : (
                <div className="approval-empty">
                    <p>No approvals recorded yet</p>
                    {check.approvalStatus === 'pending' && (
                        <p className="approval-pending-note">Awaiting approval from authorized personnel</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ApprovalPanel;
