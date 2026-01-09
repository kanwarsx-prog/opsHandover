import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MetricsDashboard from '../components/MetricsDashboard';
import HandoverTrendChart from '../components/HandoverTrendChart';
import DashboardFilters from '../components/DashboardFilters';
import { fetchHandovers } from '../services/handoverService';
import '../styles/analytics.css';

const Analytics = ({ onNavigate }) => {
    const [handovers, setHandovers] = useState([]);
    const [filteredHandovers, setFilteredHandovers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        type: 'all',
        dateFrom: '',
        dateTo: '',
        sortBy: 'dateCreated',
        sortOrder: 'desc'
    });

    useEffect(() => {
        loadHandovers();
    }, []);

    const loadHandovers = async () => {
        try {
            setLoading(true);
            const data = await fetchHandovers();
            setHandovers(data);
            setFilteredHandovers(data);
        } catch (error) {
            console.error('Error loading handovers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const applyFilters = (currentFilters) => {
        let filtered = [...handovers];

        // Search filter
        if (currentFilters.search) {
            const searchLower = currentFilters.search.toLowerCase();
            filtered = filtered.filter(h =>
                h.name?.toLowerCase().includes(searchLower) ||
                h.description?.toLowerCase().includes(searchLower) ||
                h.lead?.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (currentFilters.status !== 'all') {
            filtered = filtered.filter(h => h.status === currentFilters.status);
        }

        // Type filter
        if (currentFilters.type !== 'all') {
            filtered = filtered.filter(h => h.type === currentFilters.type);
        }

        // Date range filter
        if (currentFilters.dateFrom) {
            const fromDate = new Date(currentFilters.dateFrom);
            filtered = filtered.filter(h => new Date(h.createdAt) >= fromDate);
        }
        if (currentFilters.dateTo) {
            const toDate = new Date(currentFilters.dateTo);
            filtered = filtered.filter(h => new Date(h.createdAt) <= toDate);
        }

        // Sorting
        filtered.sort((a, b) => {
            let compareA, compareB;

            switch (currentFilters.sortBy) {
                case 'name':
                    compareA = a.name?.toLowerCase() || '';
                    compareB = b.name?.toLowerCase() || '';
                    break;
                case 'status':
                    compareA = a.status || '';
                    compareB = b.status || '';
                    break;
                case 'score':
                    compareA = a.score || 0;
                    compareB = b.score || 0;
                    break;
                case 'dateCreated':
                default:
                    compareA = new Date(a.createdAt || 0);
                    compareB = new Date(b.createdAt || 0);
                    break;
            }

            if (compareA < compareB) return currentFilters.sortOrder === 'asc' ? -1 : 1;
            if (compareA > compareB) return currentFilters.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredHandovers(filtered);
    };

    if (loading) {
        return (
            <Layout title="Analytics" onNavigate={onNavigate} currentView="analytics">
                <div className="analytics-loading">
                    <div className="spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Analytics" onNavigate={onNavigate} currentView="analytics">
            <div className="analytics-container">
                <div className="analytics-header">
                    <div className="header-content">
                        <h2>📊 Analytics Dashboard</h2>
                        <p className="header-subtitle">
                            Comprehensive insights into handover metrics and trends
                        </p>
                    </div>
                    <button
                        className="btn-secondary filter-toggle"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <span>{showFilters ? '✕' : '🔍'}</span>
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {showFilters && (
                    <DashboardFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                )}

                {filteredHandovers.length === 0 ? (
                    <div className="analytics-empty glass-panel">
                        <div className="empty-icon">📊</div>
                        <h3>No Data Available</h3>
                        <p>
                            {handovers.length === 0
                                ? 'Create your first handover to see analytics.'
                                : 'No handovers match your current filters.'}
                        </p>
                        {handovers.length === 0 && (
                            <button
                                className="btn-primary"
                                onClick={() => onNavigate('create')}
                            >
                                + Create Handover
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <MetricsDashboard handovers={filteredHandovers} />
                        <HandoverTrendChart handovers={filteredHandovers} />
                    </>
                )}
            </div>
        </Layout>
    );
};

export default Analytics;
