import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DomainEditor from '../components/DomainEditor';
import DomainLibraryModal from '../components/DomainLibraryModal';
import { createTemplate, updateTemplate, fetchTemplateById } from '../services/templateService';
import '../styles/templateEditor.css';

const TemplateEditor = ({ templateId, onBack, onNavigate, onSave }) => {
    const [template, setTemplate] = useState({
        name: '',
        description: '',
        category: 'user',
        isPublic: false,
        domains: []
    });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showDomainLibrary, setShowDomainLibrary] = useState(false);

    useEffect(() => {
        if (templateId) {
            loadTemplate();
        }
    }, [templateId]);

    const loadTemplate = async () => {
        try {
            setLoading(true);
            const data = await fetchTemplateById(templateId);
            setTemplate({
                name: data.name,
                description: data.description,
                category: data.category,
                isPublic: data.is_public,
                domains: data.domains || []
            });
        } catch (err) {
            console.error('Error loading template:', err);
            setError('Failed to load template');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!template.name.trim()) {
            setError('Template name is required');
            return;
        }

        if (template.domains.length === 0) {
            setError('At least one domain is required');
            return;
        }

        // Validate domains
        for (let i = 0; i < template.domains.length; i++) {
            const domain = template.domains[i];
            if (!domain.title.trim()) {
                setError(`Domain #${i + 1} requires a title`);
                return;
            }
            if (domain.checks.length === 0) {
                setError(`Domain "${domain.title}" must have at least one check`);
                return;
            }
            // Validate checks
            for (let j = 0; j < domain.checks.length; j++) {
                const check = domain.checks[j];
                if (!check.title.trim()) {
                    setError(`Check #${j + 1} in "${domain.title}" requires a title`);
                    return;
                }
            }
        }

        try {
            setSaving(true);
            setError(null);

            if (templateId) {
                await updateTemplate(templateId, {
                    name: template.name,
                    description: template.description,
                    is_public: template.isPublic
                });
            } else {
                await createTemplate(template);
            }

            if (onSave) {
                onSave();
            } else {
                onNavigate('template-library');
            }
        } catch (err) {
            console.error('Error saving template:', err);
            setError(err.message || 'Failed to save template');
        } finally {
            setSaving(false);
        }
    };

    const handleDomainUpdate = (index, updatedDomain) => {
        const newDomains = [...template.domains];
        newDomains[index] = updatedDomain;
        setTemplate({ ...template, domains: newDomains });
    };

    const handleDomainDelete = (index) => {
        if (!confirm('Delete this domain and all its checks?')) return;
        const newDomains = template.domains.filter((_, i) => i !== index);
        setTemplate({ ...template, domains: newDomains });
    };

    const handleAddDomain = () => {
        setTemplate({
            ...template,
            domains: [
                ...template.domains,
                {
                    title: '',
                    description: '',
                    checks: []
                }
            ]
        });
    };

    const handleAddDomainFromLibrary = (domain) => {
        setTemplate({
            ...template,
            domains: [
                ...template.domains,
                domain
            ]
        });
    };

    if (loading) {
        return (
            <Layout title="Template Editor" currentView="template-library" onNavigate={onNavigate}>
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading template...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            title={templateId ? 'Edit Template' : 'Create Template'}
            currentView="template-library"
            onNavigate={onNavigate}
            actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={onBack} disabled={saving}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span className="spinner"></span>
                                Saving...
                            </>
                        ) : (
                            'Save Template'
                        )}
                    </button>
                </div>
            }
        >
            <div className="template-editor-container">
                {error && (
                    <div className="error-banner">
                        <span className="error-icon">⚠️</span>
                        <span className="error-message">{error}</span>
                        <button
                            className="error-dismiss"
                            onClick={() => setError(null)}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Template Metadata */}
                <div className="editor-section glass-panel">
                    <h3>Template Information</h3>

                    <div className="form-group">
                        <label>Template Name *</label>
                        <input
                            type="text"
                            value={template.name}
                            onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                            placeholder="e.g., Cloud Migration Checklist"
                            className="form-input"
                            disabled={saving}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={template.description}
                            onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                            placeholder="Describe what this template is for..."
                            className="form-textarea"
                            rows="3"
                            disabled={saving}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={template.category}
                                onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                                className="form-select"
                                disabled={saving}
                            >
                                <option value="user">Custom</option>
                                <option value="organization">Organization</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={template.isPublic}
                                    onChange={(e) => setTemplate({ ...template, isPublic: e.target.checked })}
                                    disabled={saving}
                                />
                                Make this template public
                            </label>
                        </div>
                    </div>
                </div>

                {/* Domains */}
                <div className="editor-section">
                    <div className="section-header">
                        <h3>Domains & Checks</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                className="btn-secondary btn-sm"
                                onClick={() => setShowDomainLibrary(true)}
                                disabled={saving}
                            >
                                📚 Add from Library
                            </button>
                            <button
                                className="btn-primary btn-sm"
                                onClick={handleAddDomain}
                                disabled={saving}
                            >
                                + Add Domain
                            </button>
                        </div>
                    </div>

                    <div className="domains-list">
                        {template.domains.length === 0 ? (
                            <div className="empty-domains glass-panel">
                                <p>No domains yet. Click "+ Add Domain" to create one or "Add from Library" to reuse an existing domain.</p>
                            </div>
                        ) : (
                            template.domains.map((domain, index) => (
                                <DomainEditor
                                    key={index}
                                    domain={domain}
                                    index={index}
                                    onUpdate={handleDomainUpdate}
                                    onDelete={handleDomainDelete}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Domain Library Modal */}
            <DomainLibraryModal
                isOpen={showDomainLibrary}
                onClose={() => setShowDomainLibrary(false)}
                onSelectDomain={handleAddDomainFromLibrary}
            />
        </Layout>
    );
};

export default TemplateEditor;
