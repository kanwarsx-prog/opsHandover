import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TemplatePreview from '../components/TemplatePreview';
import { createHandoverWithTemplate } from '../services/handoverService';
import { fetchTemplates } from '../services/templateService';
import '../styles/newHandover.css';

const NewHandover = ({ onBack, onNavigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        goLiveDate: '',
        lead: '',
        description: ''
    });
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [creating, setCreating] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    const [error, setError] = useState(null); // Retained as it's used in handleSubmit and JSX

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoadingTemplates(true);
            const data = await fetchTemplates();
            setTemplates(data);
            // Set default type if templates are loaded and formData.type is empty
            if (data.length > 0 && !formData.type) {
                setFormData(prev => ({ ...prev, type: data[0].id }));
            }
        } catch (error) {
            console.error('Error loading templates:', error);
            setError(error.message || 'Failed to load templates.');
            // Fallback to empty array if templates fail to load
            setTemplates([]);
        } finally {
            setLoadingTemplates(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedTemplate) {
            setError('Please select a template');
            return;
        }

        setCreating(true);
        setError(null);

        try {
            // Create handover with selected template
            const handover = await createHandoverWithTemplate({
                name: formData.name,
                description: formData.description,
                lead: formData.lead,
                owner: formData.lead, // Use lead as owner for now
                targetDate: formData.goLiveDate,
                status: 'Not Ready',
                score: 0
            }, selectedTemplate);

            console.log('✅ Workspace created successfully:', handover);

            // Navigate to the new workspace
            setTimeout(() => {
                onNavigate(handover.id);
            }, 500);

        } catch (err) {
            console.error('Error creating workspace:', err);
            setError(err.message || 'Failed to create workspace. Please try again.');
            setCreating(false);
        }
    };

    return (
        <Layout
            title="Create New Handover"
            onNavigate={onNavigate}
            currentView="create"
        >
            <div className="create-container glass-panel">
                <div className="create-header">
                    <h3>Project Details</h3>
                    <p>Initialize a new operational readiness workspace.</p>
                </div>

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

                <form className="create-form" onSubmit={handleSubmit}>
                    <div className="form-group full-width">
                        <label>Project / Service Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Payments Gateway Migration"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            disabled={creating}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Target Go-Live Date</label>
                            <input
                                type="date"
                                required
                                value={formData.goLiveDate}
                                onChange={e => setFormData({ ...formData, goLiveDate: e.target.value })}
                                disabled={creating}
                            />
                        </div>
                        <div className="form-group">
                            <label>Project Lead</label>
                            <input
                                type="text"
                                placeholder="Who is delivering this?"
                                required
                                value={formData.lead}
                                onChange={e => setFormData({ ...formData, lead: e.target.value })}
                                disabled={creating}
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Description (Optional)</label>
                        <textarea
                            placeholder="Brief description of the project..."
                            rows="3"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            disabled={creating}
                        />
                    </div>

                    {/* Template Selection Section - No longer conditional on 'step' */}
                    <div className="step-content">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <h3 style={{ margin: 0 }}>Select a Template</h3>
                            <button
                                type="button"
                                className="btn-secondary btn-sm"
                                onClick={() => onNavigate('template-library')}
                                style={{ fontSize: '13px' }}
                            >
                                📚 Browse Template Library
                            </button>
                        </div>
                        <p className="step-description">
                            Choose a readiness template that best matches your project type.
                        </p>

                        {loadingTemplates ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                Loading templates...
                            </div>
                        ) : templates.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                <p>No templates available.</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => onNavigate('template-editor')}
                                    style={{ marginTop: '16px' }}
                                >
                                    Create a Template
                                </button>
                            </div>
                        ) : (
                            <div className="template-grid">
                                {templates.map((template) => (
                                    <div
                                        key={template.id}
                                        className={`template-option ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedTemplate(template)}
                                    >
                                        <div className="template-header">
                                            <h4>{template.name}</h4>
                                            {template.category === 'system' && (
                                                <span className="system-badge">System</span>
                                            )}
                                        </div>
                                        <p>{template.description}</p>
                                        <div className="template-stats">
                                            <span>{template.domains?.length || 0} domains</span>
                                            <span>
                                                {template.domains?.reduce((sum, d) => sum + (d.checks?.length || 0), 0) || 0} checks
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedTemplate && (
                            <TemplatePreview template={selectedTemplate} />
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>BAU Owner (Accepter)</label>
                            <input
                                type="text"
                                placeholder="Who will own this in Ops?"
                                required
                                value={formData.owner}
                                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                                disabled={creating}
                            />
                        </div>
                    </div>

                    <div className="form-group full-width">
                        <label>Description & Scope</label>
                        <textarea
                            rows="4"
                            placeholder="Briefly describe what is changing and the scope of this handover..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            disabled={creating}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => onNavigate('dashboard')}
                            disabled={creating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={creating}
                        >
                            {creating ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Workspace...
                                </>
                            ) : (
                                'Create Workspace'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default NewHandover;
