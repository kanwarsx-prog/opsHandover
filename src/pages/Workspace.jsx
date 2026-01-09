import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import SignOffModal from '../components/SignOffModal';
import AddCheckModal from '../components/AddCheckModal';
import ApprovalPanel from '../components/ApprovalPanel';
import EvidenceList from '../components/EvidenceList';
import ApprovalBadge from '../components/ApprovalBadge';
import { fetchHandoverById } from '../services/handoverService';
import { createCheck, deleteCheck } from '../services/checkService';
import '../styles/workspace.css';

const Workspace = ({ workspaceId, onBack, onNavigate }) => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [expandedDomains, setExpandedDomains] = useState({});

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [showSignOff, setShowSignOff] = useState(false);
    const [selectedCheck, setSelectedCheck] = useState(null);
    const [evidenceUrl, setEvidenceUrl] = useState('');
    const [addCheckModal, setAddCheckModal] = useState({ open: false, domainId: null, domainTitle: '' });

    // Fetch handover data from Supabase
    useEffect(() => {
        const loadHandover = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchHandoverById(workspaceId);
                setProject(data);

                // Initialize expanded domains
                if (data?.domains) {
                    const expanded = data.domains.reduce((acc, d) => ({ ...acc, [d.id]: true }), {});
                    setExpandedDomains(expanded);
                }
            } catch (err) {
                console.error('Error loading handover:', err);
                setError('Failed to load workspace');
            } finally {
                setLoading(false);
            }
        };

        if (workspaceId) {
            loadHandover();
        }
    }, [workspaceId]);

    const toggleDomain = (id) => {
        setExpandedDomains(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const openEvidenceModal = (check) => {
        setSelectedCheck(check);
        setModalOpen(true);
    };

    const handleEvidenceAdded = (evidence) => {
        setProject(prev => {
            const newDomains = prev.domains.map(d => ({
                ...d,
                checks: d.checks.map(c => {
                    if (c.id === selectedCheck.id) {
                        return {
                            ...c,
                            evidence: [...(c.evidence || []), evidence]
                        };
                    }
                    return c;
                })
            }));
            return { ...prev, domains: newDomains };
        });
    };

    const handleEvidenceRemoved = (evidenceId) => {
        setProject(prev => {
            const newDomains = prev.domains.map(d => ({
                ...d,
                checks: d.checks.map(c => {
                    if (c.id === selectedCheck.id) {
                        return {
                            ...c,
                            evidence: (c.evidence || []).filter(e => e.id !== evidenceId)
                        };
                    }
                    return c;
                })
            }));
            return { ...prev, domains: newDomains };
        });
    };

    const handleApprovalAdded = (approval) => {
        setProject(prev => {
            const newDomains = prev.domains.map(d => ({
                ...d,
                checks: d.checks.map(c => {
                    if (c.id === selectedCheck.id) {
                        return {
                            ...c,
                            approvals: [...(c.approvals || []), approval],
                            approvalStatus: approval.decision
                        };
                    }
                    return c;
                })
            }));
            return { ...prev, domains: newDomains };
        });
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

    const handleAddCheck = async (checkData) => {
        try {
            const numericDomainId = parseInt(addCheckModal.domainId.replace('d', ''));

            const created = await createCheck(numericDomainId, {
                title: checkData.title,
                owner: checkData.owner,
                status: 'Not Ready',
                requiresApproval: checkData.requiresApproval
            });

            setProject(prev => {
                const newDomains = prev.domains.map(d => {
                    if (d.id === addCheckModal.domainId) {
                        return {
                            ...d,
                            checks: [...d.checks, {
                                id: `c${created.id}`,
                                title: created.title,
                                owner: created.owner,
                                status: created.status
                            }]
                        };
                    }
                    return d;
                });
                return { ...prev, domains: newDomains };
            });

            setAddCheckModal({ open: false, domainId: null, domainTitle: '' });
        } catch (error) {
            console.error('Error adding check:', error);
            alert('Failed to add check');
        }
    };

    const handleDeleteCheck = async (domainId, checkId) => {
        if (!confirm('Delete this check?')) return;

        try {
            await deleteCheck(checkId);

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
            alert('Failed to delete check');
        }
    };

    return (
        <Layout
            title={project?.name || 'Loading...'}
            currentView="dashboard"
            onNavigate={onNavigate}
            actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" onClick={onBack}>← Back to Dashboard</button>
                    {project && (
                        <button className="btn-primary" onClick={() => setShowSignOff(true)}>
                            Proceed to Go-Live Decision
                        </button>
                    )}
                </div>
            }
        >
            {loading && (
                <div className="workspace-container">
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Loading workspace...
                    </div>
                </div>
            )}

            {error && (
                <div className="workspace-container">
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-danger)' }}>
                        {error}
                    </div>
                </div>
            )}

            {!loading && !error && project && (
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
                                            <div className="checks-list">
                                                {domain.checks.map(check => (
                                                    <div key={check.id} className={`check-item glass-panel ${check.status === 'Not Ready' ? 'heavy-alert' : ''}`}>
                                                        <div className="check-info">
                                                            <div className="check-title-row">
                                                                <span className="check-title">{check.title}</span>
                                                                <div className="check-badges">
                                                                    {check.requiresApproval && (
                                                                        <ApprovalBadge
                                                                            approvalStatus={check.approvalStatus}
                                                                            requiresApproval={check.requiresApproval}
                                                                        />
                                                                    )}
                                                                    {check.evidence && check.evidence.length > 0 && (
                                                                        <span className="evidence-count">
                                                                            📎 {check.evidence.length}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
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
                                                                title="Link Evidence"
                                                                onClick={() => openEvidenceModal(check)}
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
            )}

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={`Check Details: ${selectedCheck?.title || ''}`}
            >
                {selectedCheck && (
                    <div className="check-details-modal">
                        <ApprovalPanel
                            check={selectedCheck}
                            onApprovalAdded={handleApprovalAdded}
                            canApprove={true}
                        />

                        <EvidenceList
                            check={selectedCheck}
                            onEvidenceAdded={handleEvidenceAdded}
                            onEvidenceRemoved={handleEvidenceRemoved}
                        />
                    </div>
                )}
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
