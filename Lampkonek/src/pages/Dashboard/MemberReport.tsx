import {
    Download,
    ChevronDown,
    Settings,
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
import './MemberReport.css';

// Mock Data
const pieData = [
    { name: 'Active', value: 12, color: '#10b981', percent: '28.6%' },
    { name: 'Inactive', value: 22, color: '#ef4444', percent: '42.9%' },
    { name: 'Transferred', value: 12, color: '#d1d5db', percent: '28.6%' },
    { name: 'Visitor', value: 12, color: '#f59e0b', percent: '28.6%' },
    { name: 'Deceased', value: 7, color: '#6b7280', percent: '14.3%' },
];

const lineData = [
    { name: 'JAN', active: 10, inactive: 20, visitor: 15 },
    { name: 'FEB', active: 30, inactive: 15, visitor: 10 },
    { name: 'MAR', active: 15, inactive: 40, visitor: 35 },
    { name: 'APR', active: 20, inactive: 50, visitor: 10 },
    { name: 'MAY', active: 55, inactive: 10, visitor: 15 },
    { name: 'JUN', active: 15, inactive: 50, visitor: 50 },
];

const memberList = [
    { name: 'Maria Santos', status: 'Active', ministry: 'Worship Team', cluster: 'Cluster A', joinDate: '2023-01-15' },
    { name: 'Juan Dela Cruz', status: 'Active', ministry: 'Youth Ministry', cluster: 'Cluster B', joinDate: '2022-06-20' },
];

export const MemberReport = () => {
    return (
        <div className="member-report-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Members Report</h1>
                    <p>Detailed analytics and member distribution</p>
                </div>

                <div className="top-actions">
                    {/* The image shows profile here, consistent with others */}
                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">Ministry Leader</span>
                            <span className="user-role">ADMIN</span>
                        </div>
                        <div className="avatar" style={{ backgroundColor: '#ffedd5', color: '#9a3412' }}>
                            <span style={{ fontSize: '12px' }}>ML</span>
                        </div>
                        <Settings size={20} style={{ color: '#9ca3af', marginLeft: '0.5rem', cursor: 'pointer' }} />
                    </div>
                </div>
            </header>

            <div className="member-report-container">
                {/* Controls */}
                <div className="mr-controls-row">
                    <div className="mr-filters">
                        <select className="mr-select">
                            <option>All Status</option>
                        </select>
                        <select className="mr-select">
                            <option>All Ministries</option>
                        </select>
                        <select className="mr-select">
                            <option>All Clusters</option>
                        </select>
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
                            <div className="mr-stat-value">275</div>
                        </div>
                        <div className="mr-stat-meta meta-green">
                            <TrendingUp size={14} /> 1.8% growth
                        </div>
                    </div>
                    <div className="mr-stat-card">
                        <div>
                            <span className="mr-stat-title">ACTIVE</span>
                            <div className="mr-stat-value">185</div>
                        </div>
                        <div className="mr-stat-meta meta-gray">
                            67% of total
                        </div>
                    </div>
                    <div className="mr-stat-card">
                        <div>
                            <span className="mr-stat-title">VISITORS</span>
                            <div className="mr-stat-value">42</div>
                        </div>
                        <div className="mr-stat-meta" style={{ color: '#3b82f6' }}>
                            15% of total
                        </div>
                    </div>
                    <div className="mr-stat-card">
                        <div>
                            <span className="mr-stat-title">NEW THIS MONTH</span>
                            <div className="mr-stat-value">12</div>
                        </div>
                        <div className="mr-stat-meta meta-green">
                            <TrendingUp size={14} /> 15% growth
                        </div>
                    </div>
                    <div className="mr-stat-card">
                        <div>
                            <span className="mr-stat-title">TOTAL MINISTRIES</span>
                            <div className="mr-stat-value">7</div>
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
                            {memberList.map((m, i) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{m.name}</td>
                                    <td>
                                        <span className="status-pill st-active">{m.status}</span>
                                    </td>
                                    <td>{m.ministry}</td>
                                    <td>{m.cluster}</td>
                                    <td>{m.joinDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
