import { supabase } from '../lib/supabaseClient';

/**
 * Analytics Service
 * Handles handover history tracking and metrics aggregation
 */

// ============================================================================
// HISTORY TRACKING
// ============================================================================

/**
 * Record a snapshot of handover metrics
 * @param {number} handoverId - Handover ID
 * @returns {Promise<void>}
 */
export async function recordHandoverSnapshot(handoverId) {
    try {
        // Call the database function to record snapshot
        const { error } = await supabase.rpc('record_handover_snapshot', {
            p_handover_id: handoverId
        });

        if (error) throw error;
    } catch (error) {
        console.error('Error recording handover snapshot:', error);
        throw error;
    }
}

/**
 * Fetch handover history for trend analysis
 * @param {number} handoverId - Handover ID
 * @param {Object} dateRange - Date range filter
 * @returns {Promise<Array>} History records
 */
export async function fetchHandoverHistory(handoverId, dateRange = {}) {
    try {
        let query = supabase
            .from('handover_history')
            .select('*')
            .eq('handover_id', handoverId)
            .order('recorded_at', { ascending: true });

        if (dateRange.start) {
            query = query.gte('recorded_at', dateRange.start);
        }

        if (dateRange.end) {
            query = query.lte('recorded_at', dateRange.end);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching handover history:', error);
        throw error;
    }
}

// ============================================================================
// AGGREGATED METRICS
// ============================================================================

/**
 * Fetch aggregated metrics across all handovers
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Aggregated metrics
 */
export async function fetchAggregatedMetrics(filters = {}) {
    try {
        let query = supabase
            .from('handovers')
            .select(`
                id,
                name,
                type,
                status,
                score,
                target_date,
                created_at,
                domains (
                    id,
                    checks (
                        id,
                        status
                    )
                )
            `);

        // Apply filters
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        if (filters.type) {
            query = query.eq('type', filters.type);
        }

        if (filters.dateFrom) {
            query = query.gte('created_at', filters.dateFrom);
        }

        if (filters.dateTo) {
            query = query.lte('created_at', filters.dateTo);
        }

        const { data: handovers, error } = await query;

        if (error) throw error;

        // Calculate aggregated metrics
        const metrics = {
            totalHandovers: handovers.length,
            byStatus: {},
            byType: {},
            averageScore: 0,
            totalChecks: 0,
            checksByStatus: {
                'Ready': 0,
                'At Risk': 0,
                'Not Ready': 0
            }
        };

        let totalScore = 0;

        handovers.forEach(handover => {
            // Count by status
            metrics.byStatus[handover.status] = (metrics.byStatus[handover.status] || 0) + 1;

            // Count by type
            metrics.byType[handover.type] = (metrics.byType[handover.type] || 0) + 1;

            // Sum scores
            totalScore += handover.score || 0;

            // Count checks by status
            handover.domains?.forEach(domain => {
                domain.checks?.forEach(check => {
                    metrics.totalChecks++;
                    if (check.status) {
                        metrics.checksByStatus[check.status]++;
                    }
                });
            });
        });

        metrics.averageScore = handovers.length > 0 ? Math.round(totalScore / handovers.length) : 0;

        return metrics;
    } catch (error) {
        console.error('Error fetching aggregated metrics:', error);
        throw error;
    }
}

/**
 * Fetch trend data for multiple handovers
 * @param {Array<number>} handoverIds - Array of handover IDs
 * @param {Object} dateRange - Date range
 * @returns {Promise<Object>} Trend data by handover
 */
export async function fetchTrendData(handoverIds, dateRange = {}) {
    try {
        let query = supabase
            .from('handover_history')
            .select('*')
            .in('handover_id', handoverIds)
            .order('recorded_at', { ascending: true });

        if (dateRange.start) {
            query = query.gte('recorded_at', dateRange.start);
        }

        if (dateRange.end) {
            query = query.lte('recorded_at', dateRange.end);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Group by handover ID
        const trendsByHandover = {};
        data.forEach(record => {
            if (!trendsByHandover[record.handover_id]) {
                trendsByHandover[record.handover_id] = [];
            }
            trendsByHandover[record.handover_id].push(record);
        });

        return trendsByHandover;
    } catch (error) {
        console.error('Error fetching trend data:', error);
        throw error;
    }
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

/**
 * Export analytics data to CSV
 * @param {Object} filters - Filter options
 * @param {string} format - Export format (csv, json)
 * @returns {Promise<string>} Exported data
 */
export async function exportAnalytics(filters = {}, format = 'csv') {
    try {
        const metrics = await fetchAggregatedMetrics(filters);

        if (format === 'json') {
            return JSON.stringify(metrics, null, 2);
        }

        // CSV format
        let csv = 'Metric,Value\n';
        csv += `Total Handovers,${metrics.totalHandovers}\n`;
        csv += `Average Score,${metrics.averageScore}\n`;
        csv += `Total Checks,${metrics.totalChecks}\n`;
        csv += '\nStatus Breakdown\n';
        Object.entries(metrics.byStatus).forEach(([status, count]) => {
            csv += `${status},${count}\n`;
        });
        csv += '\nType Breakdown\n';
        Object.entries(metrics.byType).forEach(([type, count]) => {
            csv += `${type},${count}\n`;
        });
        csv += '\nCheck Status\n';
        Object.entries(metrics.checksByStatus).forEach(([status, count]) => {
            csv += `${status},${count}\n`;
        });

        return csv;
    } catch (error) {
        console.error('Error exporting analytics:', error);
        throw error;
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate average time to ready
 * @param {Object} filters - Filter options
 * @returns {Promise<number>} Average days to ready
 */
export async function calculateAverageTimeToReady(filters = {}) {
    try {
        let query = supabase
            .from('handovers')
            .select('created_at, target_date, status')
            .eq('status', 'Ready');

        if (filters.type) {
            query = query.eq('type', filters.type);
        }

        const { data, error } = await query;

        if (error) throw error;

        if (!data || data.length === 0) return 0;

        const totalDays = data.reduce((sum, handover) => {
            const created = new Date(handover.created_at);
            const target = new Date(handover.target_date);
            const days = Math.floor((target - created) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0);

        return Math.round(totalDays / data.length);
    } catch (error) {
        console.error('Error calculating average time to ready:', error);
        return 0;
    }
}

/**
 * Get top blockers across all handovers
 * @param {number} limit - Number of top blockers to return
 * @returns {Promise<Array>} Top blockers
 */
export async function getTopBlockers(limit = 5) {
    try {
        const { data, error } = await supabase
            .from('checks')
            .select(`
                id,
                title,
                blocker_reason,
                domain_id,
                domains (
                    handover_id,
                    handovers (
                        name
                    )
                )
            `)
            .eq('status', 'Not Ready')
            .not('blocker_reason', 'is', null)
            .limit(limit);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('Error getting top blockers:', error);
        return [];
    }
}
