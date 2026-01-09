import React, { useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import SignOffModal from '../components/SignOffModal';
import AddCheckModal from '../components/AddCheckModal';
import ApprovalPanel from '../components/ApprovalPanel';
import EvidenceList from '../components/EvidenceList';
import ApprovalBadge from '../components/ApprovalBadge';
import { mockHandovers } from '../data/mockData';
import { createCheck, deleteCheck } from '../services/checkService';
import '../styles/workspace.css';

const Workspace = ({ workspaceId, onBack, onNavigate }) => {
    // In a real app, we'd fetch this. We'll use local state to simulate updates.
    const [project, setProject] = useState(
        mockHandovers.find(p => p.id === workspaceId) || mockHandovers[0]
    );

    const [expandedDomains, setExpandedDomains] = useState(
        project.domains?.reduce((acc, d) => ({ ...acc, [d.id]: true }), {}) || {}
    );

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [showSignOff, setShowSignOff] = useState(false);
    const [selectedCheck, setSelectedCheck] = useState(null);
    const [evidenceUrl, setEvidenceUrl] = useState('');
    const [addCheckModal, setAddCheckModal] = useState({ open: false, domainId: null, domainTitle: '' });

    const toggleDomain = (id) => {
        setExpandedDomains(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const openEvidenceModal = (check) => {
        setSelectedCheck(check);
        setEvidenceUrl(check.evidence || ''); // Mock existing evidence
        setModalOpen(true);
    };

    const saveEvidence = () => {
        // In a real app, this would POST to API
        alert(`Saved evidence for: ${selectedCheck.title}`);
        setModalOpen(false);
        setEvidenceUrl('');
    };

    const handleAddCheck = async (checkData) => {
        try {
            // Extract numeric domain ID
            const numericDomainId = parseInt(addCheckModal.domainId.replace('d', ''));

            // Create check in database
            const created = await createCheck(numericDomainId, {
                title: checkData.title,
                owner: checkData.owner,
                status: 'Not Ready',
                requiresApproval: checkData.requiresApproval,
                approvalStatus: checkData.requiresApproval ? 'pending' : null
            });

            // Update local state
            setProject(prev => {
                const newDomains = prev.domains.map(d => {
                    if (d.id === addCheckModal.domainId) {
                        return {
                            ...d,
                            checks: [...d.checks, {
                                id: `c${created.id}`,
                                title: created.title,
                                owner: created.owner,
                                status: created.status,
                                requiresApproval: created.requires_approval,
                                approvalStatus: created.approval_status,
                                approvals: [],
                                evidence: []
                            }]
                        };
                    }
                    return d;
                });
                return { ...prev, domains: newDomains };
            });

            // Close modal
            setAddCheckModal({ open: false, domainId: null, domainTitle: '' });
        } catch (error) {
            console.error('Error adding check:', error);
            alert('Failed to add check. Please try again.');
        }
    };

    const handleDeleteCheck = async (domainId, checkId) => {
        if (!confirm('Are you sure you want to delete this check?')) return;

        try {
            await deleteCheck(checkId);

            // Update local state
            setProject(prev => {
                const newDomains = prev.domains.map(d => {
                    if (d.id === domainId) {
                        return {
                            ...d,
                            checks: d.checks.filter(c => c.id !== checkId)
                        };
                    }
                    return d;
                });
                return { ...prev, domains: newDomains };
            });
        } catch (error) {
            console.error('Error deleting check:', error);
            alert('Failed to delete check. Please try again.');
        }
    };
    const getStatusClass = (status) => {
        switch (status) {
            case 'Ready': return 'status-ready';
            case 'At Risk': return 'status-risk';
            default: return 'status-not-ready';
        }
    }

    // Handle check status toggle (simulation)
    const cycleStatus = (domainId, checkId) => {
        const statuses = ['Not Ready', 'At Risk', 'Ready'];

        setProject(prev => {
            const newDomains = prev.domains.map(d => {
                if (d.id !== domainId) return d;
                return {
                    ...d,
                    checks: d.checks.map(c => {
                        if (c.id !== checkId) return c;
                        const currentIndex = statuses.indexOf(c.status);
                        const nextIndex = (currentIndex + 1) % statuses.length;
                        return { ...c, status: statuses[nextIndex] };
                    })
                };
            });
            return { ...prev, domains: newDomains };
        });
    };

    return (
        <Layout
            title={project.name}
            currentView="dashboard"
            onNavigate={onNavigate}
            actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={onBack}>Exit Workspace</button>
                    <button className="btn-primary" onClick={() => setShowSignOff(true)}>Proceed to Go-Live Decision</button>
                </div>
            }
        >
            <div className="workspace-container">
                {/* Score Header */}
                <div className="score-overview glass-panel">
                    <div className="score-circle">
                        <span className="score-value">{project.score}</span>
                        <span className="score-label">Operational<br />Readiness</span>
                    </div>
                    <div className="project-meta">
                        <div className="meta-row"><strong>Lead:</strong> {project.lead}</div>
                        <div className="meta-row"><strong>Owner:</strong> {project.owner}</div>
                        <div className="meta-row"><strong>Go-Live:</strong> {project.targetDate}</div>
                    </div>
                </div>

                {/* Domains List */}
                <div className="domains-list">
                    {project.domains && project.domains.map(domain => {
                        // Calculate Domain Signals
                        const blockers = domain.checks.filter(c => c.status === 'Not Ready').length;
                        const risks = domain.checks.filter(c => c.status === 'At Risk').length;

                        return (
                            <div key={domain.id} className="domain-section ">
                                <div
                                    className="domain-header glass-panel"
                                    onClick={() => toggleDomain(domain.id)}
                                >
                                    <div className="domain-title-area">
                                        <h3>{domain.title}</h3>
                                        <div className="domain-signals">
                                            {blockers > 0 && <span className="signal-badge danger">● {blockers} blocker{blockers !== 1 && 's'}</span>}
                                            {risks > 0 && <span className="signal-badge warning">● {risks} at risk</span>}
                                        </div>
                                    </div>
                                    <span className={`chevron ${expandedDomains[domain.id] ? 'expanded' : ''}`}>▼</span>
                                </div>

                                {expandedDomains[domain.id] && (
                                    <div className="checks-container">
                                        {domain.checks.map(check => (
                                            <div className="checks-list">
                                                {domain.checks.map(check => (
                                                    <div key={check.id} className={`check-item glass-panel ${check.status === 'Not Ready' ? 'heavy-alert' : ''}`}>
                                                        <div className="check-info">
                                                            <span className="check-title">{check.title}</span>
                                                            <span className="check-owner">{check.owner}</span>
                                                            {check.status === 'Not Ready' && check.blockerReason && (
                                                                <div className="check-reason">
                                                                    ⚠ {check.blockerReason}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="check-actions">
                                                            <button
                                                                className={`status-btn ${getStatusClass(check.status)}`}
                                                                onClick={() => cycleStatus(domain.id, check.id)}
                                                            >
                                                                {check.status}
                                                            </button>
                                                            <button
                                                                className="icon-btn"
                                                                onClick={() => openEvidenceModal(check)}
                                                                title="Link Evidence"
                                                            >
                                                                🔗
                                                            </button>
                                                            <button
                                                                className="icon-btn delete-btn"
                                                                onClick={() => handleDeleteCheck(domain.id, check.id)}
                                                                title="Delete Check"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    className="add-check-btn"
                                                    onClick={() => setAddCheckModal({
                                                        open: true,
                                                        domainId: domain.id,
                                                        domainTitle: domain.title
                                                    })}
                                                >
                                                    + Add Check
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                    })}
                                {(!project.domains || project.domains.length === 0) && (
                                    <div className="empty-state">No readiness domains configured.</div>
                                )}
                            </div>
            </div>

                <Modal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="Attach Evidence"
                >
                    <div className="evidence-form">
                        <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>
                            Provide a link to the supporting document (SharePoint, Confluence, etc.) for:
                            <br /><strong>{selectedCheck?.title}</strong>
                        </p>

                        <div className="form-group">
                            <label>Evidence URL</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="https://"
                                value={evidenceUrl}
                                onChange={(e) => setEvidenceUrl(e.target.value)}
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                            <button className="btn-primary" onClick={saveEvidence}>Save Link</button>
                        </div>
                    </div>
                </Modal>

                <SignOffModal
                    isOpen={showSignOff}
                    onClose={() => setShowSignOff(false)}
                    project={project}
                    onConfirm={(details) => {
                        console.log("Decision Recorded:", details);
                        alert(`Decision Recorded: ${details.decision}`);
                        // In real app, update status in backend
                    }}
                />

                <AddCheckModal
                    isOpen={addCheckModal.open}
                    onClose={() => setAddCheckModal({ open: false, domainId: null, domainTitle: '' })}
                    onAdd={handleAddCheck}
                    domainTitle={addCheckModal.domainTitle}
                />
        </Layout>
    );
};

export default Workspace;
