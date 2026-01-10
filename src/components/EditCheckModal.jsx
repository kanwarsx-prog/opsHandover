import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import '../styles/editCheckModal.css';

const EditCheckModal = ({ isOpen, onClose, check, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        owner: '',
        status: 'Not Ready',
        blockerReason: '',
        requiresApproval: false
    });

    const [errors, setErrors] = useState({});

    // Update form data when check prop changes
    useEffect(() => {
        if (check) {
            setFormData({
                title: check.title || '',
                owner: check.owner || '',
                status: check.status || 'Not Ready',
                blockerReason: check.blockerReason || '',
                requiresApproval: check.requiresApproval || false
            });
        }
    }, [check]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Check title is required';
        if (!formData.owner.trim()) newErrors.owner = 'Owner is required';
        if (formData.status === 'Not Ready' && !formData.blockerReason.trim()) {
            newErrors.blockerReason = 'Blocker reason is required for Not Ready status';
        }

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

    const handleStatusChange = (newStatus) => {
        setFormData({
            ...formData,
            status: newStatus,
            // Clear blocker reason if status is not "Not Ready"
            blockerReason: newStatus !== 'Not Ready' ? '' : formData.blockerReason
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="edit-check-modal">
                <div className="modal-header">
                    <h3>Edit Check</h3>
                    <p>Update check details and status</p>
                </div>

                <form onSubmit={handleSubmit} className="edit-check-form">
                    <div className="form-group">
                        <label>Check Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={errors.title ? 'error' : ''}
                            placeholder="e.g., Load Testing Completed"
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label>Owner *</label>
                        <input
                            type="text"
                            value={formData.owner}
                            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                            className={errors.owner ? 'error' : ''}
                            placeholder="e.g., DevOps Team"
                        />
                        {errors.owner && <span className="error-message">{errors.owner}</span>}
                    </div>

                    <div className="form-group">
                        <label>Status *</label>
                        <div className="status-buttons">
                            <button
                                type="button"
                                className={`status-btn ${formData.status === 'Ready' ? 'active status-ready' : ''}`}
                                onClick={() => handleStatusChange('Ready')}
                            >
                                Ready
                            </button>
                            <button
                                type="button"
                                className={`status-btn ${formData.status === 'At Risk' ? 'active status-risk' : ''}`}
                                onClick={() => handleStatusChange('At Risk')}
                            >
                                At Risk
                            </button>
                            <button
                                type="button"
                                className={`status-btn ${formData.status === 'Not Ready' ? 'active status-not-ready' : ''}`}
                                onClick={() => handleStatusChange('Not Ready')}
                            >
                                Not Ready
                            </button>
                        </div>
                    </div>

                    {formData.status === 'Not Ready' && (
                        <div className="form-group">
                            <label>Blocker Reason *</label>
                            <textarea
                                value={formData.blockerReason}
                                onChange={(e) => setFormData({ ...formData, blockerReason: e.target.value })}
                                className={errors.blockerReason ? 'error' : ''}
                                placeholder="Explain why this check is not ready..."
                                rows="3"
                            />
                            {errors.blockerReason && <span className="error-message">{errors.blockerReason}</span>}
                        </div>
                    )}

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.requiresApproval}
                                onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                            />
                            <span>Requires Approval</span>
                        </label>
                        <p className="checkbox-hint">
                            Check this if formal sign-off is needed before marking as ready
                        </p>
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

export default EditCheckModal;
