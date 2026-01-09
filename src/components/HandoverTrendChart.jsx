import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../styles/handoverTrendChart.css';

const HandoverTrendChart = ({ handovers = [] }) => {
    // Process handovers into trend data
    const trendData = React.useMemo(() => {
        if (handovers.length === 0) return [];

        // Group handovers by month
        const monthlyData = {};

        handovers.forEach(h => {
            const date = new Date(h.createdAt || Date.now());
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthLabel,
                    total: 0,
                    ready: 0,
                    atRisk: 0,
                    notReady: 0
                };
            }

            monthlyData[monthKey].total++;
            if (h.status === 'Ready') monthlyData[monthKey].ready++;
            else if (h.status === 'At Risk') monthlyData[monthKey].atRisk++;
            else monthlyData[monthKey].notReady++;
        });

        // Convert to array and sort by date
        return Object.keys(monthlyData)
            .sort()
            .map(key => monthlyData[key]);
    }, [handovers]);

    if (trendData.length === 0) {
        return (
            <div className="trend-chart-empty glass-panel">
                <p>No trend data available yet. Create some handovers to see trends!</p>
            </div>
        );
    }

    return (
        <div className="trend-chart-container glass-panel">
            <div className="chart-header">
                <h3>Handover Trends Over Time</h3>
                <p className="chart-subtitle">Monthly handover creation and status trends</p>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis
                        dataKey="month"
                        stroke="var(--text-primary)"
                        style={{ fontSize: '0.875rem' }}
                    />
                    <YAxis
                        stroke="var(--text-primary)"
                        style={{ fontSize: '0.875rem' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            padding: '12px'
                        }}
                        labelStyle={{
                            color: 'var(--text-primary)',
                            fontWeight: 600,
                            marginBottom: '8px'
                        }}
                    />
                    <Legend
                        wrapperStyle={{
                            paddingTop: '20px'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="var(--primary)"
                        strokeWidth={2}
                        name="Total Handovers"
                        dot={{ fill: 'var(--primary)', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="ready"
                        stroke="var(--success)"
                        strokeWidth={2}
                        name="Ready"
                        dot={{ fill: 'var(--success)', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="atRisk"
                        stroke="var(--warning)"
                        strokeWidth={2}
                        name="At Risk"
                        dot={{ fill: 'var(--warning)', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="notReady"
                        stroke="var(--danger)"
                        strokeWidth={2}
                        name="Not Ready"
                        dot={{ fill: 'var(--danger)', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HandoverTrendChart;
