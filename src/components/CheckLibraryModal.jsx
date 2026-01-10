import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { fetchCheckLibrary } from '../services/templateService';
import '../styles/checkLibraryModal.css';

const CheckLibraryModal = ({ isOpen, onClose, onSelectChecks }) => {
    const [checks, setChecks] = useState([]);
    const [filteredChecks, setFilteredChecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChecks, setSelectedChecks] = useState(new Set());

    useEffect(() => {
        if (isOpen) {
            loadChecks();
            setSelectedChecks(new Set());
        }
    }, [isOpen]);

    useEffect(() => {
        // Filter checks based on search query
        if (searchQuery.trim() === '') {
            setFilteredChecks(checks);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = checks.filter(check =>
                check.title.toLowerCase().includes(query) ||
                check.sourceDomain.toLowerCase().includes(query) ||
                check.sourceTemplate.toLowerCase().includes(query)
            );
            setFilteredChecks(filtered);
        }
    }, [searchQuery, checks]);

    const loadChecks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCheckLibrary();
            setChecks(data);
            setFilteredChecks(data);
        } catch (err) {
            console.error('Error loading check library:', err);
            setError('Failed to load check library');
        } finally {
            setLoading(false);
        }
    };

    const toggleCheckSelection = (checkId) => {
        const newSelected = new Set(selectedChecks);
        if (newSelected.has(checkId)) {
            newSelected.delete(checkId);
        } else {
            newSelected.add(checkId);
        }
        setSelectedChecks(newSelected);
    };

    const handleAddChecks = () => {
        const checksToAdd = filteredChecks
            .filter(check => selectedChecks.has(check.id))
            .map(check => ({
                title: check.title,
                ownerPlaceholder: check.ownerPlaceholder,
                requiresApproval: check.requiresApproval
            }));

        onSelectChecks(checksToAdd);
        handleClose();
    };

    const handleClose = () => {
        setSearchQuery('');
        setSelectedChecks(new Set());
        onClose();
    };

    const getCategoryBadge = (category) => {
        const badges = {
            system: { label: 'System', className: 'system' },
            organization: { label: 'Organization', className: 'org' },
            user: { label: 'Custom', className: 'user' }
        };
        return badges[category] || badges.user;
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Check Library">
            <div className="check-library-modal">
                {/* Search Bar */}
                <div className="library-search">
                    <input
                        type="text"
                        placeholder="Search checks by title, domain, or template..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Selection Summary */}
                {selectedChecks.size > 0 && (
                    <div className="selection-summary">
                        <span>{selectedChecks.size} check(s) selected</span>
                        <button
                            className="btn-link"
                            onClick={() => setSelectedChecks(new Set())}
                        >
                            Clear Selection
                        </button>
                    </div>
                )}

                {/* Check List */}
                <div className="check-library-list">
                    {loading ? (
                        <div className="loading-state">
                            <p>Loading checks...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button className="btn-secondary" onClick={loadChecks}>
                                Retry
                            </button>
                        </div>
                    ) : filteredChecks.length === 0 ? (
                        <div className="empty-state">
                            <p>No checks found</p>
                        </div>
                    ) : (
                        filteredChecks.map(check => {
                            const badge = getCategoryBadge(check.templateCategory);
                            const isSelected = selectedChecks.has(check.id);

                            return (
                                <div
                                    key={check.id}
                                    className={`check-library-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => toggleCheckSelection(check.id)}
                                >
                                    <div className="check-item-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => { }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="check-item-content">
                                        <div className="check-item-header">
                                            <h4>{check.title}</h4>
                                            {check.requiresApproval && (
                                                <span className="approval-badge">Requires Approval</span>
                                            )}
                                        </div>
                                        <div className="check-item-meta">
                                            <span className="meta-item">
                                                📁 {check.sourceDomain}
                                            </span>
                                            <span className="meta-item">
                                                📚 {check.sourceTemplate}
                                            </span>
                                            <span className={`category-badge ${badge.className}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                        {check.ownerPlaceholder && (
                                            <div className="check-item-owner">
                                                Owner: {check.ownerPlaceholder}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Actions */}
                <div className="library-actions">
                    <button className="btn-secondary" onClick={handleClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleAddChecks}
                        disabled={selectedChecks.size === 0}
                    >
                        Add {selectedChecks.size > 0 ? `${selectedChecks.size} ` : ''}Selected Check{selectedChecks.size !== 1 ? 's' : ''}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CheckLibraryModal;
