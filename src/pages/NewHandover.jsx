import React, { useState } from 'react';
import Layout from '../components/Layout';
import TemplatePreview from '../components/TemplatePreview';
import { createHandoverWithTemplate } from '../services/handoverService';
import { getTemplate } from '../data/domainTemplates';
import '../styles/newHandover.css';

const NewHandover = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'cloud',
        targetDate: '',
        lead: '',
        owner: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Get the template for the selected type
            const template = getTemplate(formData.type);

            // Create handover with template
            const handover = await createHandoverWithTemplate({
                name: formData.name,
                description: formData.description,
                lead: formData.lead,
                owner: formData.owner,
                targetDate: formData.targetDate,
                status: 'Not Ready',
                score: 0
            }, template);

            console.log('✅ Workspace created successfully:', handover);

            // Navigate to the new workspace
            setTimeout(() => {
                onNavigate(handover.id);
            }, 500);

        } catch (err) {
            console.error('Error creating workspace:', err);
            setError(err.message || 'Failed to create workspace. Please try again.');
            setLoading(false);
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
                            disabled={loading}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Handover Type</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                disabled={loading}
                            >
                                <option value="cloud">Cloud / Infrastructure</option>
                                <option value="product">SaaS Product Feature</option>
                                <option value="legacy">Legacy Decommission</option>
                                <option value="human">Process / People Change</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Target Go-Live Date</label>
                            <input
                                type="date"
                                required
                                value={formData.targetDate}
                                onChange={e => setFormData({ ...formData, targetDate: e.target.value })}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Project Lead</label>
                            <input
                                type="text"
                                placeholder="Who is delivering this?"
                                required
                                value={formData.lead}
                                onChange={e => setFormData({ ...formData, lead: e.target.value })}
                                disabled={loading}
                            />
                        </div>
                        <div className="form-group">
                            <label>BAU Owner (Accepter)</label>
                            <input
                                type="text"
                                placeholder="Who will own this in Ops?"
                                required
                                value={formData.owner}
                                onChange={e => setFormData({ ...formData, owner: e.target.value })}
                                disabled={loading}
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
                            disabled={loading}
                        />
                    </div>

                    <TemplatePreview handoverType={formData.type} />

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => onNavigate('dashboard')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
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
