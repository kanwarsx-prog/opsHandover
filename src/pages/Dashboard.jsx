import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { fetchHandovers } from '../services/handoverService';
import '../styles/dashboard.css';

const Dashboard = ({ onNavigate, currentView }) => {
    const [handovers, setHandovers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadHandovers();
    }, []);

    const loadHandovers = async () => {
        try {
            setLoading(true);
            const data = await fetchHandovers();
            setHandovers(data);
            setError(null);
        } catch (err) {
            console.error('Error loading handovers:', err);
            setError('Failed to load handovers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Ready': return 'var(--color-success)';
            case 'At Risk': return 'var(--color-warning)';
            default: return 'var(--color-danger)';
        }
    };

    const calculateGaps = (project) => {
        if (!project.domains) return 0;
        let gaps = 0;
        project.domains.forEach(d => {
            d.checks.forEach(c => {
                if (c.status === 'Not Ready' || c.status === 'At Risk') {
                    gaps++;
                }
            });
        });
        return gaps;
    };

    return (
        <Layout
            title="Handovers Overview"
            actions={<button className="btn-primary" onClick={() => onNavigate('create')}>+ New Handover</button>}
            currentView={currentView}
            onNavigate={onNavigate}
        >
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <div className="loading-spinner">Loading handovers...</div>
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: 'var(--color-danger)', marginBottom: '16px' }}>{error}</div>
                    <button className="btn-secondary" onClick={loadHandovers}>Retry</button>
                </div>
            )}

            {!loading && !error && (
                <div className="handover-grid">
                    {handovers.map(project => {
                        const gaps = calculateGaps(project);

                        let riskMessage;
                        let riskClass = 'text-warning';

                        if (gaps > 0) {
                            riskMessage = `⚠ ${gaps} critical gaps unresolved`;
                        } else if (project.status === 'Not Ready') {
                            riskMessage = "❌ Go-live blocked by policy condition";
                            riskClass = "text-danger";
                        } else if (project.status === 'At Risk') {
                            riskMessage = "⚠ Risky go-live (conditional approval)";
                        } else {
                            riskMessage = "✓ All critical checks complete";
                            riskClass = "text-success";
                        }

                        return (
                            <div
                                key={project.id}
                                className="handover-card glass-panel"
                                onClick={() => onNavigate(project.id)}
                            >
                                <div className="card-header">
                                    <span className="status-pill large" style={{ borderColor: getStatusColor(project.status), color: getStatusColor(project.status) }}>
                                        {project.status}
                                    </span>
                                    <span className="score-badge muted">{project.score}%</span>
                                </div>

                                <h3 className="project-title">{project.name}</h3>

                                <div className="risk-indicator">
                                    <span className={`risk-text ${riskClass}`}>{riskMessage}</span>
                                </div>

                                <div className="card-meta">
                                    <div className="meta-item">
                                        <span className="label">Target</span>
                                        <span className="value">{project.targetDate}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="label">Last Updated</span>
                                        <span className="value">{project.lastUpdated || 'Recently'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* "Add New" visual */}
                    <div
                        className="handover-card glass-panel add-card"
                        onClick={() => onNavigate('create')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="add-icon">+</div>
                        <span>Create New Workspace</span>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Dashboard;
