import React from 'react';
import '../styles/templatePreview.css';

const TemplatePreview = ({ template }) => {
    if (!template) return null;

    // Calculate total checks from template domains
    const totalChecks = template.domains?.reduce((sum, domain) => sum + (domain.checks?.length || 0), 0) || 0;

    return (
        <div className="template-preview glass-panel">
            <div className="preview-header">
                <h4>📋 Template Preview: {template.name}</h4>
                <div className="preview-stats">
                    <span className="stat">
                        <strong>{template.domains?.length || 0}</strong> domains
                    </span>
                    <span className="stat-separator">•</span>
                    <span className="stat">
                        <strong>{totalChecks}</strong> checks
                    </span>
                </div>
            </div>

            <div className="preview-content">
                <p className="preview-description">
                    Your workspace will be pre-populated with these readiness domains:
                </p>

                <ul className="domain-list">
                    {template.domains?.map((domain, index) => (
                        <li key={index} className="domain-item">
                            <div className="domain-icon">✓</div>
                            <div className="domain-info">
                                <span className="domain-title">{domain.title}</span>
                                <span className="domain-checks">{domain.checks?.length || 0} checks</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <p className="preview-note">
                    💡 You can customize domains and checks after creation
                </p>
            </div>
        </div>
    );
};

export default TemplatePreview;

