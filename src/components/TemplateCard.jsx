import React from 'react';
import '../styles/templateCard.css';

const TemplateCard = ({ template, onUse, onClone, onEdit, onDelete, onView }) => {
    const stats = {
        domains: template.domains?.length || 0,
        checks: template.domains?.reduce((sum, d) => sum + (d.checks?.length || 0), 0) || 0,
        approvals: template.domains?.reduce((sum, d) =>
            sum + (d.checks?.filter(c => c.requires_approval || c.requiresApproval)?.length || 0), 0
        ) || 0
    };

    const getCategoryBadge = () => {
        const badges = {
            system: { label: 'System', className: 'system' },
            organization: { label: 'Organization', className: 'org' },
            user: { label: 'Custom', className: 'user' }
        };
        return badges[template.category] || badges.user;
    };

    const badge = getCategoryBadge();

    return (
        <div className="template-card glass-panel" onClick={() => onView && onView(template)}>
            <div className="template-card-header">
                <div className="template-title-area">
                    <h3>{template.name}</h3>
                    <span className={`category-badge ${badge.className}`}>{badge.label}</span>
                </div>
                {template.is_public && <span className="public-badge">📢 Public</span>}
            </div>

            <p className="template-description">{template.description || 'No description provided'}</p>

            <div className="template-stats">
                <div className="stat-item">
                    <span className="stat-value">{stats.domains}</span>
                    <span className="stat-label">Domains</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.checks}</span>
                    <span className="stat-label">Checks</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">{stats.approvals}</span>
                    <span className="stat-label">Approvals</span>
                </div>
            </div>

            <div className="template-actions" onClick={(e) => e.stopPropagation()}>
                <button
                    className="btn-primary btn-sm"
                    onClick={() => onUse(template)}
                    title="Use this template"
                >
                    Use Template
                </button>
                <button
                    className="btn-secondary btn-sm"
                    onClick={() => onClone(template)}
                    title="Clone this template"
                >
                    Clone
                </button>
                {template.category === 'user' && (
                    <>
                        <button
                            className="icon-btn"
                            onClick={() => onEdit(template)}
                            title="Edit template"
                        >
                            ✏️
                        </button>
                        <button
                            className="icon-btn delete-btn"
                            onClick={() => onDelete(template)}
                            title="Delete template"
                        >
                            🗑️
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TemplateCard;
