import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TemplateCard from '../components/TemplateCard';
import Modal from '../components/Modal';
import {
    fetchTemplates,
    deleteTemplate,
    cloneTemplate,
    exportTemplate,
    importTemplate
} from '../services/templateService';
import '../styles/templateLibrary.css';

const TemplateLibrary = ({ onBack, onNavigate, onUseTemplate }) => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        search: ''
    });
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        loadTemplates();
    }, [filters]);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchTemplates(filters);
            setTemplates(data);
        } catch (err) {
            console.error('Error loading templates:', err);
            setError('Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleUseTemplate = (template) => {
        if (onUseTemplate) {
            onUseTemplate(template);
        } else {
            // Navigate to new handover with template
            onNavigate('create', { templateId: template.id });
        }
    };

    const handleClone = async (template) => {
        try {
            const newName = prompt(`Clone "${template.name}" as:`, `${template.name} (Copy)`);
            if (!newName) return;

            await cloneTemplate(template.id, newName);
            await loadTemplates();
            alert('Template cloned successfully!');
        } catch (err) {
            console.error('Error cloning template:', err);
            alert('Failed to clone template');
        }
    };

    const handleDelete = async (template) => {
        if (!confirm(`Delete template "${template.name}"? This cannot be undone.`)) {
            return;
        }

        try {
            await deleteTemplate(template.id);
            await loadTemplates();
            alert('Template deleted successfully');
        } catch (err) {
            console.error('Error deleting template:', err);
            alert('Failed to delete template');
        }
    };

    const handleExport = async (template) => {
        try {
            const data = await exportTemplate(template.id);
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${template.name.replace(/\s+/g, '_')}_template.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Error exporting template:', err);
            alert('Failed to export template');
        }
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);
            await importTemplate(data);
            await loadTemplates();
            alert('Template imported successfully!');
        } catch (err) {
            console.error('Error importing template:', err);
            alert('Failed to import template. Please check the file format.');
        }
    };

    const handleViewTemplate = (template) => {
        setSelectedTemplate(template);
        setShowPreview(true);
    };

    return (
        <Layout
            title="Template Library"
            currentView="templates"
            onNavigate={onNavigate}
            actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={onBack}>
                        ← Back
                    </button>
                    <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                        📥 Import
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <button className="btn-primary" onClick={() => onNavigate('template-editor')}>
                        + Create Template
                    </button>
                </div>
            }
        >
            <div className="template-library-container">
                {/* Filters */}
                <div className="filters-bar glass-panel">
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="search-input"
                    />
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="category-filter"
                    >
                        <option value="">All Categories</option>
                        <option value="system">System Templates</option>
                        <option value="organization">Organization Templates</option>
                        <option value="user">My Templates</option>
                    </select>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <p>Loading templates...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="error-state">
                        <p>{error}</p>
                        <button className="btn-secondary" onClick={loadTemplates}>
                            Retry
                        </button>
                    </div>
                )}

                {/* Templates Grid */}
                {!loading && !error && (
                    <div className="templates-grid">
                        {templates.map(template => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                onUse={handleUseTemplate}
                                onClone={handleClone}
                                onEdit={(t) => onNavigate('template-editor', { templateId: t.id })}
                                onDelete={handleDelete}
                                onView={handleViewTemplate}
                            />
                        ))}

                        {templates.length === 0 && (
                            <div className="empty-state">
                                <p>No templates found</p>
                                <button className="btn-primary" onClick={() => onNavigate('template-editor')}>
                                    Create Your First Template
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Template Preview Modal */}
            {showPreview && selectedTemplate && (
                <Modal
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    title={selectedTemplate.name}
                >
                    <div className="template-preview">
                        <p className="template-preview-description">
                            {selectedTemplate.description}
                        </p>

                        <div className="template-preview-domains">
                            {selectedTemplate.domains?.map((domain, idx) => (
                                <div key={idx} className="preview-domain">
                                    <h4>{domain.title}</h4>
                                    <p className="domain-description">{domain.description}</p>
                                    <ul className="preview-checks">
                                        {domain.checks?.map((check, checkIdx) => (
                                            <li key={checkIdx}>
                                                {check.title}
                                                {check.requires_approval && (
                                                    <span className="approval-badge">Requires Approval</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="preview-actions">
                            <button className="btn-primary" onClick={() => {
                                setShowPreview(false);
                                handleUseTemplate(selectedTemplate);
                            }}>
                                Use This Template
                            </button>
                            <button className="btn-secondary" onClick={() => handleExport(selectedTemplate)}>
                                📤 Export
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </Layout>
    );
};

export default TemplateLibrary;
