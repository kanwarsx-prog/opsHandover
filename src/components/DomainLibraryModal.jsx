import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { fetchDomainLibrary, fetchChecksForDomain } from '../services/templateService';
import '../styles/domainLibraryModal.css';

const DomainLibraryModal = ({ isOpen, onClose, onSelectDomain }) => {
    const [domains, setDomains] = useState([]);
    const [filteredDomains, setFilteredDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [previewChecks, setPreviewChecks] = useState([]);
    const [loadingPreview, setLoadingPreview] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadDomains();
        }
    }, [isOpen]);

    useEffect(() => {
        // Filter domains based on search query
        if (searchQuery.trim() === '') {
            setFilteredDomains(domains);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = domains.filter(domain =>
                domain.title.toLowerCase().includes(query) ||
                domain.description?.toLowerCase().includes(query) ||
                domain.sourceTemplate.toLowerCase().includes(query)
            );
            setFilteredDomains(filtered);
        }
    }, [searchQuery, domains]);

    const loadDomains = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchDomainLibrary();
            setDomains(data);
            setFilteredDomains(data);
        } catch (err) {
            console.error('Error loading domain library:', err);
            setError('Failed to load domain library');
        } finally {
            setLoading(false);
        }
    };

    const handleDomainClick = async (domain) => {
        setSelectedDomain(domain);
        setLoadingPreview(true);
        try {
            const checks = await fetchChecksForDomain(domain.id);
            setPreviewChecks(checks);
        } catch (err) {
            console.error('Error loading domain checks:', err);
            setPreviewChecks([]);
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleAddDomain = (includeChecks) => {
        if (!selectedDomain) return;

        const domainToAdd = {
            title: selectedDomain.title,
            description: selectedDomain.description,
            checks: includeChecks ? previewChecks.map(check => ({
                title: check.title,
                ownerPlaceholder: check.owner_placeholder,
                requiresApproval: check.requires_approval
            })) : []
        };

        onSelectDomain(domainToAdd);
        handleClose();
    };

    const handleClose = () => {
        setSearchQuery('');
        setSelectedDomain(null);
        setPreviewChecks([]);
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
        <Modal isOpen={isOpen} onClose={handleClose} title="Domain Library">
            <div className="domain-library-modal">
                {/* Search Bar */}
                <div className="library-search">
                    <input
                        type="text"
                        placeholder="Search domains by title, description, or template..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Content Area */}
                <div className="library-content">
                    {/* Domain List */}
                    <div className="library-list">
                        {loading ? (
                            <div className="loading-state">
                                <p>Loading domains...</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <p>{error}</p>
                                <button className="btn-secondary" onClick={loadDomains}>
                                    Retry
                                </button>
                            </div>
                        ) : filteredDomains.length === 0 ? (
                            <div className="empty-state">
                                <p>No domains found</p>
                            </div>
                        ) : (
                            filteredDomains.map(domain => {
                                const badge = getCategoryBadge(domain.templateCategory);
                                return (
                                    <div
                                        key={domain.id}
                                        className={`library-item ${selectedDomain?.id === domain.id ? 'selected' : ''}`}
                                        onClick={() => handleDomainClick(domain)}
                                    >
                                        <div className="library-item-header">
                                            <h4>{domain.title}</h4>
                                            <span className={`category-badge ${badge.className}`}>
                                                {badge.label}
                                            </span>
                                        </div>
                                        <p className="library-item-description">
                                            {domain.description || 'No description'}
                                        </p>
                                        <div className="library-item-meta">
                                            <span className="meta-item">
                                                📋 {domain.checkCount} checks
                                            </span>
                                            <span className="meta-item">
                                                📚 {domain.sourceTemplate}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Preview Panel */}
                    <div className="library-preview">
                        {selectedDomain ? (
                            <>
                                <div className="preview-header">
                                    <h3>{selectedDomain.title}</h3>
                                    <p className="preview-description">
                                        {selectedDomain.description || 'No description'}
                                    </p>
                                </div>

                                <div className="preview-checks">
                                    <h4>Checks ({previewChecks.length})</h4>
                                    {loadingPreview ? (
                                        <p className="loading-text">Loading checks...</p>
                                    ) : previewChecks.length === 0 ? (
                                        <p className="empty-text">No checks in this domain</p>
                                    ) : (
                                        <ul className="checks-list">
                                            {previewChecks.map((check, idx) => (
                                                <li key={idx} className="check-item">
                                                    <span className="check-title">{check.title}</span>
                                                    {check.requires_approval && (
                                                        <span className="approval-badge">Requires Approval</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="preview-actions">
                                    <button
                                        className="btn-primary"
                                        onClick={() => handleAddDomain(true)}
                                        disabled={loadingPreview}
                                    >
                                        Add Domain with All Checks
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => handleAddDomain(false)}
                                        disabled={loadingPreview}
                                    >
                                        Add Domain Only
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="preview-empty">
                                <p>Select a domain to preview its checks</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DomainLibraryModal;
