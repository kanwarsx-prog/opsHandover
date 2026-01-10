import React from 'react';
import '../styles/checkEditor.css';

const CheckEditor = ({ check, onUpdate, onDelete, index }) => {
    const handleChange = (field, value) => {
        onUpdate(index, { ...check, [field]: value });
    };

    return (
        <div className="check-editor">
            <div className="check-editor-header">
                <span className="check-number">#{index + 1}</span>
                <button
                    type="button"
                    className="btn-icon delete-check"
                    onClick={() => onDelete(index)}
                    title="Delete check"
                >
                    🗑️
                </button>
            </div>

            <div className="check-editor-body">
                <div className="form-group">
                    <label>Check Title *</label>
                    <input
                        type="text"
                        value={check.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="e.g., Security audit completed"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Owner Placeholder</label>
                        <input
                            type="text"
                            value={check.ownerPlaceholder || check.owner_placeholder || ''}
                            onChange={(e) => handleChange('ownerPlaceholder', e.target.value)}
                            placeholder="e.g., Security Team"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={check.requiresApproval || check.requires_approval || false}
                                onChange={(e) => handleChange('requiresApproval', e.target.checked)}
                            />
                            <span>Requires Approval</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckEditor;
