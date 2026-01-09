import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
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
        if (!template.name.trim()) {
            alert('Please enter a template name');
            return;
        }

        if (template.domains.length === 0) {
            alert('Please add at least one domain');
            return;
        }

        try {
            setSaving(true);
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
                onNavigate('templates');
            }
        } catch (err) {
            console.error('Error saving template:', err);
            alert('Failed to save template');
        } finally {
            setSaving(false);
        }
    };

    const addDomain = () => {
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

    const updateDomain = (index, field, value) => {
        const newDomains = [...template.domains];
        newDomains[index] = {
            ...newDomains[index],
            [field]: value
        };
        setTemplate({ ...template, domains: newDomains });
    };

    const deleteDomain = (index) => {
        if (!confirm('Delete this domain and all its checks?')) return;
        const newDomains = template.domains.filter((_, i) => i !== index);
        setTemplate({ ...template, domains: newDomains });
    };

    const moveDomain = (index, direction) => {
        const newDomains = [...template.domains];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newDomains.length) return;

        [newDomains[index], newDomains[newIndex]] = [newDomains[newIndex], newDomains[index]];
        setTemplate({ ...template, domains: newDomains });
    };

    const addCheck = (domainIndex) => {
        const newDomains = [...template.domains];
        newDomains[domainIndex].checks = [
            ...newDomains[domainIndex].checks,
            {
                title: '',
                ownerPlaceholder: '',
                requiresApproval: false
            }
        ];
        setTemplate({ ...template, domains: newDomains });
    };

    const updateCheck = (domainIndex, checkIndex, field, value) => {
        const newDomains = [...template.domains];
        newDomains[domainIndex].checks[checkIndex] = {
            ...newDomains[domainIndex].checks[checkIndex],
            [field]: value
        };
        setTemplate({ ...template, domains: newDomains });
    };

    const deleteCheck = (domainIndex, checkIndex) => {
        const newDomains = [...template.domains];
        newDomains[domainIndex].checks = newDomains[domainIndex].checks.filter((_, i) => i !== checkIndex);
        setTemplate({ ...template, domains: newDomains });
    };

    const moveCheck = (domainIndex, checkIndex, direction) => {
        const newDomains = [...template.domains];
        const checks = newDomains[domainIndex].checks;
        const newIndex = direction === 'up' ? checkIndex - 1 : checkIndex + 1;
        if (newIndex < 0 || newIndex >= checks.length) return;

        [checks[checkIndex], checks[newIndex]] = [checks[newIndex], checks[checkIndex]];
        setTemplate({ ...template, domains: newDomains });
    };

    if (loading) {
        return (
            <Layout title="Template Editor" currentView="templates" onNavigate={onNavigate}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    Loading template...
                </div>
            </Layout>
        );
    }

    return (
        <Layout
            title={templateId ? 'Edit Template' : 'Create Template'}
            currentView="templates"
            onNavigate={onNavigate}
            actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={onBack}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Template'}
                    </button>
                </div>
            }
        >
            <div className="template-editor-container">
                {error && <div className="error-message">{error}</div>}

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
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                value={template.category}
                                onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                                className="form-select"
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
                        <button className="btn-primary btn-sm" onClick={addDomain}>
                            + Add Domain
                        </button>
                    </div>

                    {template.domains.map((domain, domainIndex) => (
                        <div key={domainIndex} className="domain-editor glass-panel">
                            <div className="domain-header">
                                <div className="domain-controls">
                                    <button
                                        className="icon-btn"
                                        onClick={() => moveDomain(domainIndex, 'up')}
                                        disabled={domainIndex === 0}
                                        title="Move up"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="icon-btn"
                                        onClick={() => moveDomain(domainIndex, 'down')}
                                        disabled={domainIndex === template.domains.length - 1}
                                        title="Move down"
                                    >
                                        ↓
                                    </button>
                                    <span className="domain-number">Domain {domainIndex + 1}</span>
                                </div>
                                <button
                                    className="icon-btn delete-btn"
                                    onClick={() => deleteDomain(domainIndex)}
                                    title="Delete domain"
                                >
                                    🗑️
                                </button>
                            </div>

                            <div className="form-group">
                                <label>Domain Title *</label>
                                <input
                                    type="text"
                                    value={domain.title}
                                    onChange={(e) => updateDomain(domainIndex, 'title', e.target.value)}
                                    placeholder="e.g., Technology & Infrastructure"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={domain.description}
                                    onChange={(e) => updateDomain(domainIndex, 'description', e.target.value)}
                                    placeholder="Brief description of this domain"
                                    className="form-input"
                                />
                            </div>

                            {/* Checks */}
                            <div className="checks-section">
                                <div className="checks-header">
                                    <h4>Checks</h4>
                                    <button
                                        className="btn-secondary btn-sm"
                                        onClick={() => addCheck(domainIndex)}
                                    >
                                        + Add Check
                                    </button>
                                </div>

                                {domain.checks.map((check, checkIndex) => (
                                    <div key={checkIndex} className="check-editor">
                                        <div className="check-controls">
                                            <button
                                                className="icon-btn-sm"
                                                onClick={() => moveCheck(domainIndex, checkIndex, 'up')}
                                                disabled={checkIndex === 0}
                                            >
                                                ↑
                                            </button>
                                            <button
                                                className="icon-btn-sm"
                                                onClick={() => moveCheck(domainIndex, checkIndex, 'down')}
                                                disabled={checkIndex === domain.checks.length - 1}
                                            >
                                                ↓
                                            </button>
                                            <span className="check-number">{checkIndex + 1}.</span>
                                        </div>

                                        <div className="check-fields">
                                            <input
                                                type="text"
                                                value={check.title}
                                                onChange={(e) => updateCheck(domainIndex, checkIndex, 'title', e.target.value)}
                                                placeholder="Check title"
                                                className="form-input"
                                            />
                                            <input
                                                type="text"
                                                value={check.ownerPlaceholder}
                                                onChange={(e) => updateCheck(domainIndex, checkIndex, 'ownerPlaceholder', e.target.value)}
                                                placeholder="Owner (e.g., DevOps Team)"
                                                className="form-input"
                                            />
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={check.requiresApproval}
                                                    onChange={(e) => updateCheck(domainIndex, checkIndex, 'requiresApproval', e.target.checked)}
                                                />
                                                Requires Approval
                                            </label>
                                        </div>

                                        <button
                                            className="icon-btn-sm delete-btn"
                                            onClick={() => deleteCheck(domainIndex, checkIndex)}
                                            title="Delete check"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                {domain.checks.length === 0 && (
                                    <div className="empty-checks">
                                        No checks yet. Click "Add Check" to create one.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {template.domains.length === 0 && (
                        <div className="empty-domains glass-panel">
                            <p>No domains yet. Click "Add Domain" to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default TemplateEditor;
