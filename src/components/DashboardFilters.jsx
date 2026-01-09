import React, { useState } from 'react';
import '../styles/dashboardFilters.css';

const DashboardFilters = ({ onFilterChange, onClearFilters }) => {
    const [filters, setFilters] = useState({
        status: '',
        type: '',
        dateFrom: '',
        dateTo: '',
        search: '',
        sortBy: 'created_at',
        sortOrder: 'desc'
    });

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClear = () => {
        const clearedFilters = {
            status: '',
            type: '',
            dateFrom: '',
            dateTo: '',
            search: '',
            sortBy: 'created_at',
            sortOrder: 'desc'
        };
        setFilters(clearedFilters);
        onClearFilters();
    };

    const hasActiveFilters = Object.values(filters).some(v =>
        v && v !== 'created_at' && v !== 'desc'
    );

    return (
        <div className="dashboard-filters glass-panel">
            <div className="filters-header">
                <h4>Filters</h4>
                {hasActiveFilters && (
                    <button className="btn-text" onClick={handleClear}>
                        Clear All
                    </button>
                )}
            </div>

            <div className="filters-grid">
                {/* Search */}
                <div className="filter-group full-width">
                    <label>Search</label>
                    <input
                        type="text"
                        placeholder="Search handovers..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="filter-input"
                    />
                </div>

                {/* Status Filter */}
                <div className="filter-group">
                    <label>Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Statuses</option>
                        <option value="Ready">Ready</option>
                        <option value="At Risk">At Risk</option>
                        <option value="Not Ready">Not Ready</option>
                    </select>
                </div>

                {/* Type Filter */}
                <div className="filter-group">
                    <label>Type</label>
                    <select
                        value={filters.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Types</option>
                        <option value="cloud">Cloud / Infrastructure</option>
                        <option value="product">SaaS Product</option>
                        <option value="legacy">Legacy Decommission</option>
                        <option value="human">Process / People</option>
                    </select>
                </div>

                {/* Date From */}
                <div className="filter-group">
                    <label>From Date</label>
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        className="filter-input"
                    />
                </div>

                {/* Date To */}
                <div className="filter-group">
                    <label>To Date</label>
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        className="filter-input"
                    />
                </div>

                {/* Sort By */}
                <div className="filter-group">
                    <label>Sort By</label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="filter-select"
                    >
                        <option value="created_at">Date Created</option>
                        <option value="name">Name</option>
                        <option value="score">Score</option>
                        <option value="target_date">Target Date</option>
                        <option value="status">Status</option>
                    </select>
                </div>

                {/* Sort Order */}
                <div className="filter-group">
                    <label>Order</label>
                    <select
                        value={filters.sortOrder}
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                        className="filter-select"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default DashboardFilters;
