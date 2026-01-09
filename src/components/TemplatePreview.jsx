import React from 'react';
import { getTemplateSummary } from '../data/domainTemplates';
import '../styles/templatePreview.css';

const TemplatePreview = ({ handoverType }) => {
    const summary = getTemplateSummary(handoverType);

    return (
        <div className="template-preview glass-panel">
            <div className="preview-header">
                <h4>📋 Workspace Template</h4>
                <div className="preview-stats">
                    <span className="stat">
                        <strong>{summary.domainCount}</strong> domains
                    </span>
                    <span className="stat-separator">•</span>
                    <span className="stat">
                        <strong>{summary.checkCount}</strong> checks
                    </span>
                </div>
            </div>

            <div className="preview-content">
                <p className="preview-description">
                    Your workspace will be pre-populated with these readiness domains:
                </p>

                <ul className="domain-list">
                    {summary.domains.map((domain, index) => (
                        <li key={index} className="domain-item">
                            <div className="domain-icon">✓</div>
                            <div className="domain-info">
                                <span className="domain-title">{domain.title}</span>
                                <span className="domain-checks">{domain.checkCount} checks</span>
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
