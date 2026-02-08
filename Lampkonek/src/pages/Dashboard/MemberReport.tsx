import { useState, useEffect } from 'react';
import {
    Download,
    ChevronDown,
    TrendingUp,
    CheckCircle2
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    Tooltip
} from 'recharts';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './MemberReport.css';

// Interfaces
interface PieData {
    name: string;
    value: number;
    color: string;
    percent: string;
}

interface LineData {
    name: string;
    active: number;
    inactive: number;
    visitor: number;
}

interface MemberListItem {
    name: string;
    status: string;
    ministry: string;
    cluster: string;
    joinDate: string;
}

interface MemberStats {
    totalMembers: number;
    activeMembers: number;
    visitors: number;
    newThisMonth: number;
    totalMinistries: number;
    growthPercent: number;
}

export const MemberReport = () => {
    const [stats, setStats] = useState<MemberStats>({
        totalMembers: 0,
        activeMembers: 0,
        visitors: 0,
        newThisMonth: 0,
        totalMinistries: 0,
        growthPercent: 0
    });
    const [pieData, setPieData] = useState<PieData[]>([]);
    const [lineData, setLineData] = useState<LineData[]>([]);
    const [memberList, setMemberList] = useState<MemberListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [clusterFilter, setClusterFilter] = useState('All Clusters');
    const [availableClusters, setAvailableClusters] = useState<string[]>([]);

    // Fetch all member report data
    useEffect(() => {
        fetchMemberReportData();
    }, []);

    const fetchMemberReportData = async () => {
        try {
            setIsLoading(true);

            // Fetch all profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (profilesError) throw profilesError;

            // Calculate stats
            const totalMembers = profiles?.length || 0;
            const activeMembers = profiles?.filter(p => p.status === 'Active').length || 0;
            const visitors = profiles?.filter(p => p.status === 'Visitor').length || 0;

            // New members this month
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            const newThisMonth = profiles?.filter(p =>
                new Date(p.created_at) >= startOfMonth
            ).length || 0;

            // Count unique ministries (placeholder - would need ministries table)
            const totalMinistries = 7; // Placeholder

            setStats({
                totalMembers,
                activeMembers,
                visitors,
                newThisMonth,
                totalMinistries,
                growthPercent: 1.8 // Placeholder
            });

            // Calculate pie chart data (status distribution)
            const statusCounts: Record<string, number> = {};
            profiles?.forEach(p => {
                const status = p.status || 'Inactive';
                statusCounts[status] = (statusCounts[status] || 0) + 1;
            });

            const colors: Record<string, string> = {
                'Active': '#10b981',
                'Inactive': '#ef4444',
                'Transferred': '#d1d5db',
                'Visitor': '#f59e0b',
                'Deceased': '#6b7280'
            };

            const pieArray: PieData[] = Object.entries(statusCounts).map(([name, value]) => ({
                name,
                value,
                color: colors[name] || '#9ca3af',
                percent: totalMembers > 0 ? `${Math.round((value / totalMembers) * 100)}%` : '0%'
            }));
            setPieData(pieArray);

            // Calculate line chart data (last 6 months)
            const monthsData: LineData[] = [];
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthName = monthNames[date.getMonth()];
                const year = date.getFullYear();
                const month = date.getMonth() + 1;

                // Get first and last day of month
                const firstDay = new Date(year, month - 1, 1).toISOString();
                const lastDay = new Date(year, month, 0).toISOString();

                // Count members by status created in this month
                const monthProfiles = profiles?.filter(p => {
                    const createdDate = new Date(p.created_at);
                    return createdDate >= new Date(firstDay) && createdDate <= new Date(lastDay);
                });

                const active = monthProfiles?.filter(p => p.status === 'Active').length || 0;
                const inactive = monthProfiles?.filter(p => p.status === 'Inactive').length || 0;
                const visitor = monthProfiles?.filter(p => p.status === 'Visitor').length || 0;

                monthsData.push({ name: monthName, active, inactive, visitor });
            }
            setLineData(monthsData);

            // Prepare member list (top 10 most recent)
            const memberListData: MemberListItem[] = profiles?.slice(0, 10).map(p => ({
                name: p.full_name || 'Unknown',
                status: p.status || 'Inactive',
                ministry: 'General', // Placeholder - would need ministries table
                cluster: p.cluster || 'Unassigned',
                joinDate: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : 'N/A'
            })) || [];
            setMemberList(memberListData);

            // Extract unique clusters for filter
            const clusters = Array.from(new Set(profiles?.map(p => p.cluster || 'Unassigned').filter(Boolean)));
            setAvailableClusters(clusters.sort());

        } catch (error) {
            console.error('Error fetching member report data:', error);
            toast.error('Failed to load member report data');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter member list
    const filteredMembers = memberList.filter(m => {
        const clusterMatch = clusterFilter === 'All Clusters' || m.cluster === clusterFilter;
        return clusterMatch;
    });

    return (
        <div className="member-report-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Members Report</h1>
                </div>
            </header>

            <div className="member-report-container">
                {/* Controls */}
                <div className="mr-controls-row">
                    <div className="mr-filters">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Filter by Cluster:</span>
                            <select
                                className="mr-select"
                                value={clusterFilter}
                                onChange={(e) => setClusterFilter(e.target.value)}
                                style={{
                                    minWidth: '150px',
                                    padding: '0.5rem 2rem 0.5rem 0.75rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    color: '#374151',
                                    backgroundColor: 'white',
                                    cursor: 'pointer',
                                    outline: 'none'
                                }}
                            >
                                <option>All Clusters</option>
                                {availableClusters.map(cluster => (
                                    <option key={cluster} value={cluster}>{cluster}</option>
                                ))}
                            </select>
                            {clusterFilter !== 'All Clusters' && (
                                <button
                                    onClick={() => setClusterFilter('All Clusters')}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        fontSize: '0.75rem',
                                        color: '#6b7280',
                                        backgroundColor: '#f3f4f6',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    <button className="export-report-btn">
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="mr-stats-grid">
                    <div className="mr-stat-card">
                        <div>
                            <span className="mr-stat-title">TOTAL MEMBERS</span>
                            <div className="mr-stat-value">{isLoading ? '...' : stats.totalMembers}</div>
                        </div>
                        <div className="mr-stat-meta meta-green">
                            <TrendingUp size={14} /> {stats.growthPercent}% growth
                        </div>
                    </div>
                    <div className="mr-stat-card">
                        <div>
                            <span className="mr-stat-title">ACTIVE</span>
                            <div className="mr-stat-value">{isLoading ? '...' : stats.activeMembers}</div>
                        </div>
                        <div className="mr-stat-meta meta-gray">
                            {stats.totalMembers > 0 ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0}% of total
                        </div>
                    </div>
                    <div className="mr-stat-card">
                        <div>
                            <span className="mr-stat-title">VISITORS</span>
                            <div className="mr-stat-value">{isLoading ? '...' : stats.visitors}</div>
                        </div>
                        <div className="mr-stat-meta" style={{ color: '#3b82f6' }}>
                            {stats.totalMembers > 0 ? Math.round((stats.visitors / stats.totalMembers) * 100) : 0}% of total
                        </div>
                    </div>
                    <div className="mr-stat-card">
                        <div>
                            <span className="mr-stat-title">NEW THIS MONTH</span>
                            <div className="mr-stat-value">{isLoading ? '...' : stats.newThisMonth}</div>
                        </div>
                        <div className="mr-stat-meta meta-green">
                            <TrendingUp size={14} /> 15% growth
                        </div>
                    </div>
                    <div className="mr-stat-card">
                        <div>
                            <span className="mr-stat-title">TOTAL MINISTRIES</span>
                            <div className="mr-stat-value">{isLoading ? '...' : stats.totalMinistries}</div>
                        </div>
                        <div className="mr-stat-meta meta-green">
                            <CheckCircle2 size={14} /> Active
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="mr-charts-grid">
                    {/* Pie Chart */}
                    <div className="mr-chart-card">
                        <div className="mr-chart-header">
                            <span className="mr-chart-title">Member Status Distribution</span>
                            <a href="#" className="mr-link">View Details</a>
                        </div>

                        <div className="mr-pie-content">
                            <div style={{ width: '160px', height: '160px' }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            innerRadius={0}
                                            outerRadius={80}
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mr-legend">
                                {pieData.map((item, index) => (
                                    <div key={index} className="legend-item">
                                        <span className="leg-dot" style={{ backgroundColor: item.color }}></span>
                                        <span>{item.name}</span>
                                        <span className="leg-val">{item.value} ({item.percent})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Line Chart */}
                    <div className="mr-chart-card">
                        <div className="mr-chart-header">
                            <span className="mr-chart-title">Member Status per month</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', backgroundColor: '#f9fafb', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                                <span>This Week</span>
                                <ChevronDown size={14} />
                            </div>
                        </div>

                        <div style={{ width: '100%', height: 220 }}>
                            <ResponsiveContainer>
                                <LineChart data={lineData}>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                                    <Line type="monotone" dataKey="inactive" stroke="#ef4444" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="visitor" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                            <div className="legend-item">
                                <span className="leg-dot" style={{ backgroundColor: '#ef4444' }}></span> Inactive
                            </div>
                            <div className="legend-item">
                                <span className="leg-dot" style={{ backgroundColor: '#10b981' }}></span> Active
                            </div>
                            <div className="legend-item">
                                <span className="leg-dot" style={{ backgroundColor: '#f59e0b' }}></span> Visitor
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Table */}
                <div className="mr-list-section">
                    <div className="mr-list-header">Member Summary List</div>
                    <table className="mr-table">
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>STATUS</th>
                                <th>MINISTRY</th>
                                <th>CLUSTER</th>
                                <th>JOIN DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        Loading...
                                    </td>
                                </tr>
                            ) : filteredMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                        No members found
                                    </td>
                                </tr>
                            ) : (
                                filteredMembers.map((m, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 600 }}>{m.name}</td>
                                        <td>
                                            <span className={`status-pill st-${m.status.toLowerCase()}`}>{m.status}</span>
                                        </td>
                                        <td>{m.ministry}</td>
                                        <td>{m.cluster}</td>
                                        <td>{m.joinDate}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
