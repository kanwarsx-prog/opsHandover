import React from 'react';
import {
    PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { saveAs } from 'file-saver';
import '../styles/metricsDashboard.css';

const MetricsDashboard = ({
    handovers = [],
    dateRange = null,
    onReadinessRangeClick,
    onStatusClick,
    onApprovalClick
}) => {
    // Calculate metrics
    const metrics = React.useMemo(() => {
        const total = handovers.length;
        const ready = handovers.filter(h => h.status === 'Ready').length;
        const atRisk = handovers.filter(h => h.status === 'At Risk').length;
        const notReady = handovers.filter(h => h.status === 'Not Ready').length;

        const avgScore = total > 0
            ? (handovers.reduce((sum, h) => sum + (h.score || 0), 0) / total).toFixed(1)
            : 0;

        return {
            total,
            ready,
            atRisk,
            notReady,
            avgScore,
            readyPercentage: total > 0 ? ((ready / total) * 100).toFixed(1) : 0
        };
    }, [handovers]);

    // Status distribution data for pie chart
    const statusData = [
        { name: 'Ready', value: metrics.ready, color: 'var(--success)' },
        { name: 'At Risk', value: metrics.atRisk, color: 'var(--warning)' },
        { name: 'Not Ready', value: metrics.notReady, color: 'var(--danger)' }
    ].filter(item => item.value > 0);

    // Score distribution data for bar chart
    const scoreDistribution = React.useMemo(() => {
        const ranges = [
            { range: '0-20', min: 0, max: 20, count: 0 },
            { range: '21-40', min: 21, max: 40, count: 0 },
            { range: '41-60', min: 41, max: 60, count: 0 },
            { range: '61-80', min: 61, max: 80, count: 0 },
            { range: '81-100', min: 81, max: 100, count: 0 }
        ];

        handovers.forEach(h => {
            const score = h.score || 0;
            const range = ranges.find(r => score >= r.min && score <= r.max);
            if (range) range.count++;
        });

        return ranges;
    }, [handovers]);

    // Export to CSV
    const handleExportCSV = () => {
        const headers = ['Name', 'Status', 'Score', 'Type', 'Lead', 'Target Date', 'Created At'];
        const rows = handovers.map(h => [
            h.name,
            h.status,
            h.score || 0,
            h.type || 'N/A',
            h.lead || 'N/A',
            h.targetDate || 'N/A',
            h.createdAt ? new Date(h.createdAt).toLocaleDateString() : 'N/A'
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `handovers-export-${new Date().toISOString().split('T')[0]}.csv`);
    };

    return (
        <div className="metrics-dashboard">
            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card glass-panel">
                    <div className="kpi-icon">📊</div>
                    <div className="kpi-content">
                        <div className="kpi-value">{metrics.total}</div>
                        <div className="kpi-label">Total Handovers</div>
                    </div>
                </div>

                <div className="kpi-card glass-panel success">
                    <div className="kpi-icon">✅</div>
                    <div className="kpi-content">
                        <div className="kpi-value">{metrics.ready}</div>
                        <div className="kpi-label">Ready</div>
                        <div className="kpi-subtitle">{metrics.readyPercentage}% of total</div>
                    </div>
                </div>

                <div className="kpi-card glass-panel warning">
                    <div className="kpi-icon">⚠️</div>
                    <div className="kpi-content">
                        <div className="kpi-value">{metrics.atRisk}</div>
                        <div className="kpi-label">At Risk</div>
                    </div>
                </div>

                <div className="kpi-card glass-panel">
                    <div className="kpi-icon">📈</div>
                    <div className="kpi-content">
                        <div className="kpi-value">{metrics.avgScore}%</div>
                        <div className="kpi-label">Average Score</div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Status Distribution Pie Chart */}
                <div className="chart-container glass-panel">
                    <div className="chart-header">
                        <h3>Status Distribution</h3>
                        <p className="chart-subtitle">Current handover status breakdown</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                onClick={(data) => onStatusClick && onStatusClick(data.name)}
                                cursor="pointer"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Score Distribution Bar Chart */}
                <div className="chart-container glass-panel">
                    <div className="chart-header">
                        <h3>Score Distribution</h3>
                        <p className="chart-subtitle">Handovers by readiness score range</p>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={scoreDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="range" stroke="var(--text-primary)" />
                            <YAxis stroke="var(--text-primary)" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar
                                dataKey="count"
                                fill="var(--primary)"
                                radius={[8, 8, 0, 0]}
                                onClick={(data) => onReadinessRangeClick && onReadinessRangeClick(data.min, data.max)}
                                cursor="pointer"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Export Controls */}
            <div className="export-controls">
                <button className="btn-secondary" onClick={handleExportCSV}>
                    <span>📥</span>
                    Export to CSV
                </button>
            </div>
        </div>
    );
};

export default MetricsDashboard;
