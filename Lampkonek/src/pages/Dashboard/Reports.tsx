import { useState, useEffect } from 'react';
import {
    Filter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { UserProfile } from '../../components/UserProfile';
import './Reports.css';

// Interfaces
interface TrendData {
    name: string;
    present: number;
    visitor: number;
    absent: number;
}

interface ClusterData {
    name: string;
    value: number;
    total: number;
}

interface AttendanceLog {
    date: string;
    event: string;
    present: number;
    absent: number;
    total: number;
    rate: number;
}

interface ReportStats {
    totalAttendance: number;
    averagePerEvent: number;
    attendanceRate: number;
    totalEvents: number;
    changePercent: number;
}

export const Reports = () => {
    const [stats, setStats] = useState<ReportStats>({
        totalAttendance: 0,
        averagePerEvent: 0,
        attendanceRate: 0,
        totalEvents: 0,
        changePercent: 0
    });
    const [trendData, setTrendData] = useState<TrendData[]>([]);
    const [clusterData, setClusterData] = useState<ClusterData[]>([]);
    const [logsData, setLogsData] = useState<AttendanceLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFilter, setDateFilter] = useState('This Week');
    const itemsPerPage = 5;

    // Fetch all report data
    useEffect(() => {
        fetchReportData();
    }, [dateFilter]); // Refetch when date filter changes

    // Helper function to get date range based on filter
    const getDateRange = () => {
        const now = new Date();
        let startDate = new Date();

        switch (dateFilter) {
            case 'Today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case 'This Week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - now.getDay());
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'This Month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'Last 7 Days':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                break;
            case 'Last 30 Days':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 30);
                break;
            case 'Last 3 Months':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 3);
                break;
            case 'Last 6 Months':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 6);
                break;
            case 'This Year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
        }

        return startDate.toISOString().split('T')[0];
    };

    const fetchReportData = async () => {
        try {
            setIsLoading(true);

            // Calculate date filter once for all queries
            const filterStartDate = getDateRange();

            // Fetch attendance data for this week's trend
            const weekData: TrendData[] = [];
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const dayName = dayNames[date.getDay()];

                const { data: attendanceRecords } = await supabase
                    .from('attendance')
                    .select('status')
                    .eq('date', dateStr);

                let present = 0, absent = 0, visitor = 0;
                attendanceRecords?.forEach((record: any) => {
                    if (record.status === 'Present') present++;
                    else if (record.status === 'Absent') absent++;
                    else if (record.status === 'Visitor') visitor++;
                });

                weekData.push({ name: dayName, present, absent, visitor });
            }
            setTrendData(weekData);

            // Fetch cluster attendance data
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, cluster');

            const clusterCounts: Record<string, { total: number; attended: number }> = {};
            profiles?.forEach((profile: any) => {
                const cluster = profile.cluster || 'Unassigned';
                if (!clusterCounts[cluster]) {
                    clusterCounts[cluster] = { total: 0, attended: 0 };
                }
                clusterCounts[cluster].total++;
            });

            // Get attendance by cluster using date filter
            const { data: attendanceByCluster } = await supabase
                .from('attendance')
                .select('user_id, status')
                .gte('date', filterStartDate)
                .eq('status', 'Present');

            // Create member_id to cluster mapping
            const memberClusterMap: Record<string, string> = {};
            profiles?.forEach((profile: any) => {
                if (profile.id && profile.cluster) {
                    memberClusterMap[profile.id] = profile.cluster;
                }
            });

            // Count unique members per cluster who attended
            const attendedByCluster: Record<string, Set<string>> = {};
            attendanceByCluster?.forEach((record: any) => {
                const cluster = memberClusterMap[record.user_id] || 'Unassigned';
                if (!attendedByCluster[cluster]) {
                    attendedByCluster[cluster] = new Set();
                }
                attendedByCluster[cluster].add(record.user_id);
            });

            // Update cluster counts with actual attendance
            Object.keys(attendedByCluster).forEach(cluster => {
                if (clusterCounts[cluster]) {
                    clusterCounts[cluster].attended = attendedByCluster[cluster].size;
                }
            });

            const clusterArray: ClusterData[] = Object.entries(clusterCounts).map(([name, counts]) => ({
                name: name.replace('Cluster ', ''),
                value: counts.attended,
                total: counts.total
            }));
            setClusterData(clusterArray);

            // Fetch detailed attendance logs with date filter
            const { data: attendanceLogs } = await supabase
                .from('attendance')
                .select('date, status, event')
                .gte('date', filterStartDate)
                .order('date', { ascending: false })
                .limit(500); // Increased limit to capture more data

            // Group by date and event
            const logsByDate: Record<string, { date: string; event: string; present: number; absent: number; visitor: number }> = {};

            attendanceLogs?.forEach((log: any) => {
                const eventName = log.event || 'Service';
                const key = `${log.date}-${eventName}`;

                if (!logsByDate[key]) {
                    logsByDate[key] = {
                        date: log.date,
                        event: eventName,
                        present: 0,
                        absent: 0,
                        visitor: 0
                    };
                }
                if (log.status === 'Present') logsByDate[key].present++;
                else if (log.status === 'Absent') logsByDate[key].absent++;
                else if (log.status === 'Visitor') logsByDate[key].visitor++;
            });

            const logsArray: AttendanceLog[] = Object.values(logsByDate).map(log => {
                const total = log.present + log.absent + log.visitor;
                const rate = total > 0 ? Math.round((log.present / total) * 100) : 0;
                return {
                    date: log.date,
                    event: log.event,
                    present: log.present,
                    absent: log.absent,
                    total,
                    rate
                };
            }).slice(0, 20);

            setLogsData(logsArray);

            // Calculate stats
            const totalAttendance = logsArray.reduce((sum, log) => sum + log.present, 0);
            const totalEvents = logsArray.length;
            const averagePerEvent = totalEvents > 0 ? Math.round(totalAttendance / totalEvents) : 0;
            const totalRate = logsArray.reduce((sum, log) => sum + log.rate, 0);
            const attendanceRate = totalEvents > 0 ? Math.round(totalRate / totalEvents) : 0;

            setStats({
                totalAttendance,
                averagePerEvent,
                attendanceRate,
                totalEvents,
                changePercent: 12 // Placeholder - would need historical data
            });

        } catch (error) {
            console.error('Error fetching report data:', error);
            toast.error('Failed to load report data');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter logs by search term
    const filteredLogs = logsData.filter(log =>
        log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.date.includes(searchTerm)
    );

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="reports-content dashboard-view-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title hide-mobile">
                    <h1>Attendance Report</h1>
                    <p>View historical data and growth trends.</p>
                </div>
                <div className="top-actions">
                    <UserProfile />
                </div>
            </header>
            <div className="reports-header-controls">
                <div className="filter-group">
                    <Filter size={16} className="filter-icon" />
                    <select
                        className="date-filter-select"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                        <option>Last 6 Months</option>
                        <option>This Year</option>
                    </select>
                </div>


            </div>

            <div className="reports-container">
                {/* Stats Grid */}
                <div className="reports-stats-grid">
                    <div className="report-stat-card">
                        <div>
                            <span className="r-stat-label">Total Attendance</span>
                            <div className="r-stat-main">
                                <span className="r-stat-value">{isLoading ? '...' : stats.totalAttendance.toLocaleString()}</span>
                                <span className="r-stat-change change-pos">↑ {stats.changePercent}%</span>
                            </div>
                        </div>
                        <span className="r-stat-sub">vs last month</span>
                    </div>

                    <div className="report-stat-card">
                        <div>
                            <span className="r-stat-label">Average Per Event</span>
                            <div className="r-stat-main">
                                <span className="r-stat-value">{isLoading ? '...' : stats.averagePerEvent}</span>
                            </div>
                        </div>
                        <span className="r-stat-sub">Across {stats.totalEvents} events</span>
                    </div>

                    <div className="report-stat-card">
                        <div>
                            <span className="r-stat-label">Attendance Rate</span>
                            <div className="r-stat-main">
                                <span className="r-stat-value">{isLoading ? '...' : `${stats.attendanceRate}%`}</span>
                                <span className="r-stat-change change-pos">↑ 3%</span>
                            </div>
                        </div>
                        <span className="r-stat-sub">vs last month</span>
                    </div>

                    <div className="report-stat-card">
                        <div>
                            <span className="r-stat-label">Total Events</span>
                            <div className="r-stat-main">
                                <span className="r-stat-value">{isLoading ? '...' : stats.totalEvents}</span>
                            </div>
                        </div>
                        <span className="r-stat-sub">This period</span>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="reports-charts-grid">
                    {/* Line Chart */}
                    <div className="report-chart-card">
                        <div className="r-chart-header">
                            <div className="r-chart-title">
                                <h3>Attendance Trend</h3>
                            </div>

                        </div>

                        <div style={{ width: '100%', height: 200 }}>
                            <ResponsiveContainer>
                                <LineChart data={trendData}>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="present" stroke="#6366f1" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="visitor" stroke="#10b981" strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="chart-filters">
                            <div className="chart-filter-item">
                                <span className="c-dot" style={{ backgroundColor: '#6366f1' }}></span> Present
                            </div>
                            <div className="chart-filter-item">
                                <span className="c-dot" style={{ backgroundColor: '#10b981' }}></span> Visitor
                            </div>
                            <div className="chart-filter-item">
                                <span className="c-dot" style={{ backgroundColor: '#ef4444' }}></span> Absent
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="report-chart-card">
                        <div className="r-chart-header">
                            <div className="r-chart-title">
                                <h3>Attendance per Cluster</h3>
                                {!isLoading && clusterData.length > 0 && (
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                        {clusterData.reduce((sum, c) => sum + c.value, 0)} attended out of {clusterData.reduce((sum, c) => sum + c.total, 0)} members
                                    </p>
                                )}
                            </div>
                            <span className="time-badge">{dateFilter}</span>
                        </div>

                        {isLoading ? (
                            <div style={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                Loading cluster data...
                            </div>
                        ) : clusterData.length === 0 ? (
                            <div style={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                No cluster data available
                            </div>
                        ) : (
                            <>
                                <div style={{ width: '100%', height: 200, marginTop: '1.5rem' }}>
                                    <ResponsiveContainer>
                                        <BarChart data={clusterData}>
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                                    fontSize: '0.875rem'
                                                }}
                                                formatter={(value: any, name?: string) => {
                                                    if (name === 'total') return [value, 'Total Members'];
                                                    if (name === 'value') return [value, 'Attended'];
                                                    return [value, name || ''];
                                                }}
                                            />
                                            <Bar dataKey="total" stackId="a" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="value" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '2rem',
                                    marginTop: '1rem',
                                    paddingTop: '1rem',
                                    borderTop: '1px solid #f3f4f6'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: '#6366f1',
                                            borderRadius: '2px'
                                        }}></div>
                                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Attended</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            backgroundColor: '#e0e7ff',
                                            borderRadius: '2px'
                                        }}></div>
                                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Members</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Detailed Logs Table */}
                <div className="detailed-logs-section">
                    <div className="logs-header">
                        <h3>Detailed Attendance Logs</h3>
                        <a href="#" className="view-all-link">View all logs</a>
                    </div>

                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Event</th>
                                <th>Present</th>
                                <th>Absent</th>
                                <th className="hide-tablet">Total Members</th>
                                <th>Attendance Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        {isLoading ? 'Loading...' : 'No attendance records found'}
                                    </td>
                                </tr>
                            ) : (
                                paginatedLogs.map((log, index) => (
                                    <tr key={index}>
                                        <td data-label="Date" style={{ color: '#6b7280' }}>{log.date}</td>
                                        <td data-label="Event" style={{ fontWeight: 600 }}>{log.event}</td>
                                        <td data-label="Present" className="text-green">{log.present}</td>
                                        <td data-label="Absent" className="text-red">{log.absent}</td>
                                        <td data-label="Total" className="hide-tablet">{log.total}</td>
                                        <td data-label="Rate">
                                            <div className="rate-bar-container">
                                                <div className="progress-track">
                                                    <div className="progress-fill" style={{ width: `${log.rate}%` }}></div>
                                                </div>
                                                <span className="rate-text">{log.rate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="logs-pagination">
                        <span>Showing {paginatedLogs.length} of {filteredLogs.length} events</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="p-btn-small"
                                style={{ borderRadius: '50%', width: '24px', height: '24px' }}
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft size={14} />
                            </button>
                            {[...Array(Math.min(3, totalPages))].map((_, i) => (
                                <button
                                    key={i}
                                    className={`p-btn-small ${currentPage === i + 1 ? 'active' : ''}`}
                                    style={{ borderRadius: '50%', width: '24px', height: '24px' }}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="p-btn-small"
                                style={{ borderRadius: '50%', width: '24px', height: '24px' }}
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
