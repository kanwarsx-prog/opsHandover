import React, { useState } from 'react';
import { getEvidenceTypeIcon, isValidEvidenceUrl } from '../utils/approvalUtils';
import '../styles/approval.css';

/**
 * EvidenceList - Display and manage evidence attachments
 * @param {Object} props
 * @param {Array} props.evidence - Array of evidence objects
 * @param {Function} props.onEvidenceAdded - Callback when evidence is added
 * @param {Function} props.onEvidenceRemoved - Callback when evidence is removed
 * @param {boolean} props.readOnly - Whether list is read-only
 */
const EvidenceList = ({ evidence = [], onEvidenceAdded, onEvidenceRemoved, readOnly = false }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        type: 'link',
        description: ''
    });
    const [errors, setErrors] = useState({});

    const handleAddEvidence = () => {
        // Validate form
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.url.trim()) newErrors.url = 'URL is required';
        if (!isValidEvidenceUrl(formData.url)) newErrors.url = 'Invalid URL format';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Create new evidence object
        const newEvidence = {
            id: `e${Date.now()}`,
            title: formData.title,
            url: formData.url,
            type: formData.type,
            description: formData.description,
            uploadedBy: 'Current User', // TODO: Get from auth context
            uploadedAt: new Date().toISOString()
        };

        onEvidenceAdded?.(newEvidence);

        // Reset form
        setFormData({ title: '', url: '', type: 'link', description: '' });
        setErrors({});
        setShowAddForm(false);
    };

    const handleRemove = (evidenceId) => {
        if (window.confirm('Are you sure you want to remove this evidence?')) {
            onEvidenceRemoved?.(evidenceId);
        }
    };

    return (
        <div className="evidence-list">
            <div className="evidence-header">
                <h4>Evidence ({evidence.length})</h4>
                {!readOnly && (
                    <button
                        className="btn-add-evidence"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? '✕ Cancel' : '+ Add Evidence'}
                    </button>
                )}
            </div>

            {showAddForm && (
                <div className="evidence-form">
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Audit Report Q4 2025"
                        />
                        {errors.title && <span className="error">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label>URL *</label>
                        <input
                            type="url"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            placeholder="https://..."
                        />
                        {errors.url && <span className="error">{errors.url}</span>}
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="link">Link</option>
                            <option value="document">Document</option>
                            <option value="screenshot">Screenshot</option>
                            <option value="video">Video</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Optional description..."
                            rows="2"
                        />
                    </div>

                    <button className="btn-primary" onClick={handleAddEvidence}>
                        Add Evidence
                    </button>
                </div>
            )}

            {evidence.length === 0 ? (
                <div className="evidence-empty">
                    <p>No evidence attached yet</p>
                </div>
            ) : (
                <div className="evidence-items">
                    {evidence.map((item) => (
                        <div key={item.id} className="evidence-item">
                            <div className="evidence-icon">
                                {getEvidenceTypeIcon(item.type)}
                            </div>
                            <div className="evidence-content">
                                <div className="evidence-title">
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        {item.title}
                                    </a>
                                </div>
                                {item.description && (
                                    <div className="evidence-description">{item.description}</div>
                                )}
                                <div className="evidence-meta">
                                    Added by {item.uploadedBy} • {new Date(item.uploadedAt).toLocaleDateString()}
                                </div>
                            </div>
                            {!readOnly && (
                                <button
                                    className="btn-remove-evidence"
                                    onClick={() => handleRemove(item.id)}
                                    title="Remove evidence"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EvidenceList;
