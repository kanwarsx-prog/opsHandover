import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/addCheckModal.css';

const AddCheckModal = ({ isOpen, onClose, onAdd, domainTitle }) => {
    const [formData, setFormData] = useState({
        title: '',
        owner: '',
        requiresApproval: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);

        // Reset form
        setFormData({
            title: '',
            owner: '',
            requiresApproval: false
        });
    };

    const handleClose = () => {
        // Reset form on close
        setFormData({
            title: '',
            owner: '',
            requiresApproval: false
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <div className="add-check-modal">
                <div className="modal-header">
                    <h3>Add Check to {domainTitle}</h3>
                    <p>Create a new readiness check for this domain</p>
                </div>

                <form onSubmit={handleSubmit} className="add-check-form">
                    <div className="form-group">
                        <label>Check Title *</label>
                        <input
                            type="text"
                            placeholder="e.g., Load Testing Completed"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Owner *</label>
                        <input
                            type="text"
                            placeholder="e.g., DevOps Team"
                            value={formData.owner}
                            onChange={e => setFormData({ ...formData, owner: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.requiresApproval}
                                onChange={e => setFormData({ ...formData, requiresApproval: e.target.checked })}
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
                            Add Check
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddCheckModal;
