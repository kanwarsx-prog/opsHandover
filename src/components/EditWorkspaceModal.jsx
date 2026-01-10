import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import '../styles/editWorkspaceModal.css';

const EditWorkspaceModal = ({ isOpen, onClose, workspace, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        lead: '',
        owner: '',
        targetDate: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    // Update form data when workspace prop changes
    useEffect(() => {
        if (workspace) {
            setFormData({
                name: workspace.name || '',
                lead: workspace.lead || '',
                owner: workspace.owner || '',
                targetDate: workspace.targetDate || '',
                description: workspace.description || ''
            });
        }
    }, [workspace]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Project name is required';
        if (!formData.lead.trim()) newErrors.lead = 'Lead is required';
        if (!formData.owner.trim()) newErrors.owner = 'Owner is required';
        if (!formData.targetDate) newErrors.targetDate = 'Target date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
            onClose();
        }
    };

    const handleClose = () => {
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="edit-workspace-modal">
                <div className="modal-header">
                    <h3>Edit Workspace Details</h3>
                    <p>Update project information and metadata</p>
                </div>

                <form onSubmit={handleSubmit} className="edit-workspace-form">
                    <div className="form-group">
                        <label>Project Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={errors.name ? 'error' : ''}
                            placeholder="e.g., SAP Migration 2.0"
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Lead *</label>
                            <input
                                type="text"
                                value={formData.lead}
                                onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                                className={errors.lead ? 'error' : ''}
                                placeholder="e.g., Alex Chen"
                            />
                            {errors.lead && <span className="error-message">{errors.lead}</span>}
                        </div>

                        <div className="form-group">
                            <label>Owner *</label>
                            <input
                                type="text"
                                value={formData.owner}
                                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                                className={errors.owner ? 'error' : ''}
                                placeholder="e.g., Sarah Jones"
                            />
                            {errors.owner && <span className="error-message">{errors.owner}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Target Date *</label>
                        <input
                            type="date"
                            value={formData.targetDate}
                            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                            className={errors.targetDate ? 'error' : ''}
                        />
                        {errors.targetDate && <span className="error-message">{errors.targetDate}</span>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Optional project description..."
                            rows="3"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditWorkspaceModal;
