import React, { useState } from 'react';
import CheckEditor from './CheckEditor';
import CheckLibraryModal from './CheckLibraryModal';
import '../styles/domainEditor.css';

const DomainEditor = ({ domain, index, onUpdate, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showCheckLibrary, setShowCheckLibrary] = useState(false);
    const [checks, setChecks] = useState(domain.checks || []);

    const handleDomainChange = (field, value) => {
        onUpdate(index, { ...domain, [field]: value, checks });
    };

    const handleCheckUpdate = (checkIndex, updatedCheck) => {
        const newChecks = [...checks];
        newChecks[checkIndex] = updatedCheck;
        setChecks(newChecks);
        onUpdate(index, { ...domain, checks: newChecks });
    };

    const handleCheckDelete = (checkIndex) => {
        const newChecks = checks.filter((_, i) => i !== checkIndex);
        setChecks(newChecks);
        onUpdate(index, { ...domain, checks: newChecks });
    };

    const handleAddCheck = () => {
        const newCheck = {
            title: '',
            ownerPlaceholder: '',
            requiresApproval: false
        };
        const newChecks = [...checks, newCheck];
        setChecks(newChecks);
        onUpdate(index, { ...domain, checks: newChecks });
    };

    const handleAddChecksFromLibrary = (selectedChecks) => {
        const newChecks = [...checks, ...selectedChecks];
        setChecks(newChecks);
        onUpdate(index, { ...domain, checks: newChecks });
    };

    return (
        <div className="domain-editor">
            <div className="domain-editor-header">
                <div className="domain-header-left">
                    <button
                        type="button"
                        className="btn-icon expand-toggle"
                        onClick={() => setIsExpanded(!isExpanded)}
                        title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? '▼' : '▶'}
                    </button>
                    <span className="domain-number">Domain #{index + 1}</span>
                    <span className="check-count">{checks.length} checks</span>
                </div>
                <button
                    type="button"
                    className="btn-icon delete-domain"
                    onClick={() => onDelete(index)}
                    title="Delete domain"
                >
                    🗑️
                </button>
            </div>

            {isExpanded && (
                <div className="domain-editor-body">
                    <div className="form-group">
                        <label>Domain Title *</label>
                        <input
                            type="text"
                            value={domain.title || ''}
                            onChange={(e) => handleDomainChange('title', e.target.value)}
                            placeholder="e.g., Security & Compliance"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={domain.description || ''}
                            onChange={(e) => handleDomainChange('description', e.target.value)}
                            placeholder="Brief description of this domain..."
                            rows="2"
                        />
                    </div>

                    <div className="checks-section">
                        <div className="checks-header">
                            <h4>Checks</h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    type="button"
                                    className="btn-secondary btn-sm"
                                    onClick={() => setShowCheckLibrary(true)}
                                >
                                    📚 Add from Library
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary btn-sm"
                                    onClick={handleAddCheck}
                                >
                                    + Add Check
                                </button>
                            </div>
                        </div>

                        <div className="checks-list">
                            {checks.length === 0 ? (
                                <div className="empty-state">
                                    <p>No checks yet. Click "+ Add Check" to create one or "Add from Library" to reuse an existing check.</p>
                                </div>
                            ) : (
                                checks.map((check, checkIndex) => (
                                    <CheckEditor
                                        key={checkIndex}
                                        check={check}
                                        index={checkIndex}
                                        onUpdate={handleCheckUpdate}
                                        onDelete={handleCheckDelete}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Check Library Modal */}
            <CheckLibraryModal
                isOpen={showCheckLibrary}
                onClose={() => setShowCheckLibrary(false)}
                onSelectChecks={handleAddChecksFromLibrary}
            />
        </div>
    );
};

export default DomainEditor;
