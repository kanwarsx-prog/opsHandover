import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DashboardFilters from '../components/DashboardFilters';
import { fetchHandovers } from '../services/handoverService';
import '../styles/dashboard.css';

const Dashboard = ({ onNavigate }) => {
    const [handovers, setHandovers] = useState([]);
    const [filteredHandovers, setFilteredHandovers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        loadHandovers();
    }, []);

    useEffect(() => {
        setFilteredHandovers(handovers);
    }, [handovers]);

    const loadHandovers = async () => {
        try {
            setLoading(true);
            const data = await fetchHandovers();
            setHandovers(data);
        } catch (err) {
            console.error('Error loading handovers:', err);
            setError('Failed to load handovers');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filters) => {
        let filtered = [...handovers];

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(h =>
                h.name.toLowerCase().includes(searchLower) ||
                h.description?.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (filters.status) {
            filtered = filtered.filter(h => h.status === filters.status);
        }

        // Apply type filter
        if (filters.type) {
            filtered = filtered.filter(h => h.type === filters.type);
        }

        // Apply date filters
        if (filters.dateFrom) {
            filtered = filtered.filter(h => new Date(h.created_at) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            filtered = filtered.filter(h => new Date(h.created_at) <= new Date(filters.dateTo));
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal = a[filters.sortBy];
            let bVal = b[filters.sortBy];

            // Handle string comparison
            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal?.toLowerCase() || '';
            }

            if (filters.sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        setFilteredHandovers(filtered);
    };

    const handleClearFilters = () => {
        setFilteredHandovers(handovers);
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
            title="Handovers"
            currentView="dashboard"
            onNavigate={onNavigate}
            actions={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        className="btn-secondary"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? '✕ Hide Filters' : '🔍 Filters'}
                    </button>
                    <button className="btn-primary" onClick={() => onNavigate('create')}>
                        + New Handover
                    </button>
                </div>
            }
        >
            {showFilters && (
                <DashboardFilters
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                    Loading handovers...
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-danger)' }}>
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="handover-grid">
                    {filteredHandovers.map(project => {
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

                    {filteredHandovers.length === 0 && handovers.length > 0 && (
                        <div style={{
                            gridColumn: '1 / -1',
                            textAlign: 'center',
                            padding: '40px',
                            color: 'var(--text-dim)'
                        }}>
                            No handovers match your filters. Try adjusting your search criteria.
                        </div>
                    )}

                    {handovers.length === 0 && ({/* "Add New" visual */ }
                        < div
                        className="handover-card glass-panel add-card"
                    onClick={() => onNavigate('create')}
                    style={{ cursor: 'pointer' }}
                    >
                    <div className="add-icon">+</div>
                    <span>Create New Workspace</span>
                </div>
                </div>
    )
}
        </Layout >
    );
};

export default Dashboard;
