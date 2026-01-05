import React, { useState } from 'react';
import '../styles/modal.css';
import '../styles/signoff.css';

const SignOffModal = ({ isOpen, onClose, project, onConfirm }) => {
    if (!isOpen) return null;

    const [decision, setDecision] = useState(null);
    const [justification, setJustification] = useState('');
    const [riskAcknowledged, setRiskAcknowledged] = useState(false);

    // Derived State
    const blockers = project.domains.flatMap(d => d.checks).filter(c => c.status === 'Not Ready');
    const risks = project.domains.flatMap(d => d.checks).filter(c => c.status === 'At Risk');
    const readyCount = project.domains.flatMap(d => d.checks).filter(c => c.status === 'Ready').length;

    const hasBlockers = blockers.length > 0;

    // Decision Logic
    const canGoLive = !hasBlockers;

    const handleConfirm = () => {
        onConfirm({
            decision,
            justification,
            timestamp: new Date().toISOString()
        });
        onClose();
    };

    const isSubmitDisabled = () => {
        if (!decision) return true;
        if (decision === 'GO_LIVE_RISK') {
            return !justification || !riskAcknowledged;
        }
        if (decision === 'NOT_READY') {
            return !justification;
        }
        return false;
    };

    const getButtonLabel = () => {
        switch (decision) {
            case 'GO_LIVE': return 'Confirm Go-Live';
            case 'GO_LIVE_RISK': return 'Confirm Go-Live with Risks';
            case 'NOT_READY': return 'Record Not Ready Decision';
            default: return 'Confirm Decision';
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content signoff-modal glass-panel">

                {/* 4.1 Context Header */}
                <div className="signoff-header">
                    <h2>Go-Live Decision: {project.name}</h2>
                    <div className="signoff-meta">
                        <span>Target: <strong>{project.targetDate}</strong></span>
                        <span>Requested By: <strong>{project.lead}</strong></span>
                        <span>BAU Owner: <strong>{project.owner}</strong></span>
                    </div>
                </div>

                <div className="signoff-scroll-body">

                    {/* 4.2 Readiness Snapshot */}
                    <div className="readiness-snapshot">
                        <div className="snapshot-score">
                            <div className="score-big">{project.score}</div>
                            <div className="score-sub">Operational<br />Readiness</div>
                        </div>
                        <div className="snapshot-stats">
                            <div className={`stat-box ${hasBlockers ? 'danger' : ''}`}>
                                <span className="stat-label">Blockers</span>
                                <span className="stat-value">{blockers.length}</span>
                            </div>
                            <div className="stat-box warning">
                                <span className="stat-label">Risks</span>
                                <span className="stat-value">{risks.length}</span>
                            </div>
                            <div className="stat-box success">
                                <span className="stat-label">Ready</span>
                                <span className="stat-value">{readyCount}</span>
                            </div>
                        </div>
                    </div>
                    <p className="snapshot-disclaimer">
                        This snapshot reflects operational readiness at the time of decision.
                    </p>

                    {/* 4.3 Blocking Issues & Risks */}
                    <div className="exceptions-section">
                        {blockers.length > 0 && (
                            <div className="exception-group danger">
                                <h4>🔴 Blockers</h4>
                                {blockers.map(b => (
                                    <div key={b.id} className="exception-item">
                                        <span className="ex-title">{b.title}</span>
                                        <span className="ex-reason">⚠ {b.blockerReason || 'Critical gap unresolved'}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {risks.length > 0 && (
                            <div className="exception-group warning">
                                <h4>🟡 Accepted Risks</h4>
                                {risks.map(r => (
                                    <div key={r.id} className="exception-item">
                                        <span className="ex-title">{r.title}</span>
                                        <span className="ex-meta">Owner: {r.owner}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 4.4 Decision Selection */}
                    <div className="decision-section">
                        <h3>Select Decision</h3>

                        <label className={`decision-option ${!canGoLive ? 'disabled' : ''} ${decision === 'GO_LIVE' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="decision"
                                value="GO_LIVE"
                                disabled={!canGoLive}
                                onChange={(e) => setDecision(e.target.value)}
                            />
                            <div className="decision-content">
                                <span className="decision-title">✅ Ready to Go Live</span>
                                <span className="decision-desc">Full operational confidence. No blockers.</span>
                                {!canGoLive && <span className="disabled-reason">Unavailable while blockers exist</span>}
                            </div>
                        </label>

                        <label className={`decision-option ${decision === 'GO_LIVE_RISK' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="decision"
                                value="GO_LIVE_RISK"
                                onChange={(e) => setDecision(e.target.value)}
                            />
                            <div className="decision-content">
                                <span className="decision-title">⚠ Go Live with Known Risks</span>
                                <span className="decision-desc">Go-live proceeds despite identified risks. Accountability is accepted by Operations.</span>
                            </div>
                        </label>

                        <label className={`decision-option ${decision === 'NOT_READY' ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                name="decision"
                                value="NOT_READY"
                                onChange={(e) => setDecision(e.target.value)}
                            />
                            <div className="decision-content">
                                <span className="decision-title">❌ Not Ready to Go Live</span>
                                <span className="decision-desc">Current state does not meet operational standards. Go-live postponed.</span>
                            </div>
                        </label>
                    </div>

                    {/* Justification & Acknowledgement */}
                    {decision === 'GO_LIVE_RISK' && (
                        <div className="conditional-fields fade-in">
                            <label>Risk Justification (Mandatory)</label>
                            <textarea
                                placeholder="Why is it safe to proceed? What mitigations are in place?"
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                            />
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={riskAcknowledged}
                                    onChange={(e) => setRiskAcknowledged(e.target.checked)}
                                />
                                I acknowledge that Operations accepts responsibility for the listed risks.
                            </label>
                        </div>
                    )}

                    {decision === 'NOT_READY' && (
                        <div className="conditional-fields fade-in">
                            <label>Deferral Rationale (Mandatory)</label>
                            <textarea
                                placeholder="What criteria must be met before next review?"
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                {/* 4.6 Confirmation Action */}
                <div className="modal-actions signoff-actions">
                    <div className="legal-statement">
                        This decision records operational acceptance at this point in time.
                    </div>

                    <div className="actions-column">
                        <div className="signer-identity">
                            Signing as: <strong>{project.owner} (BAU Owner)</strong>
                        </div>

                        <div className="action-buttons-row">
                            <div className="cancel-wrapper">
                                <span className="cancel-hint">No decision will be recorded.</span>
                                <button className="btn-secondary" onClick={onClose}>Cancel</button>
                            </div>

                            <button
                                className={`btn-primary ${decision === 'NOT_READY' ? 'btn-danger' : ''}`}
                                disabled={isSubmitDisabled()}
                                onClick={handleConfirm}
                            >
                                {getButtonLabel()}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignOffModal;
