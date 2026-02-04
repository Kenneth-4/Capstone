import {
    Search,
    Download,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Moon,
    Settings
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
import './Reports.css';

// Mock Data for Charts
const trendData = [
    { name: 'Mon', present: 60, visitor: 30, absent: 20 },
    { name: 'Tue', present: 120, visitor: 45, absent: 30 },
    { name: 'Wed', present: 110, visitor: 40, absent: 35 },
    { name: 'Thu', present: 150, visitor: 55, absent: 25 },
    { name: 'Fri', present: 190, visitor: 40, absent: 40 },
    { name: 'Sat', present: 170, visitor: 60, absent: 30 },
    { name: 'Sun', present: 220, visitor: 80, absent: 50 },
];

const clusterData = [
    { name: 'A', value: 140, total: 200 },
    { name: 'B', value: 240, total: 300 },
    { name: 'C', value: 200, total: 280 },
    { name: 'D', value: 180, total: 240 },
    { name: 'E', value: 80, total: 120 },
    { name: 'F', value: 160, total: 200 },
];

const logsData = [
    { date: '2024-11-17', event: 'Sunday Worship', present: 245, absent: 30, total: 275, rate: 89 },
    { date: '2024-11-16', event: 'Prayer Meeting', present: 68, absent: 12, total: 80, rate: 85 },
    { date: '2024-11-15', event: 'Youth Service', present: 92, absent: 8, total: 100, rate: 92 },
    { date: '2024-11-14', event: 'Bible Study', present: 54, absent: 6, total: 60, rate: 90 },
    { date: '2024-11-10', event: 'Sunday Worship', present: 238, absent: 37, total: 275, rate: 87 },
];

export const Reports = () => {
    return (
        <div className="reports-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Attendance Report</h1>
                    <p>Monitor and analyze ministry engagement levels.</p>
                </div>

                <div className="reports-header-controls">
                    <div className="report-search">
                        <Search size={16} />
                        <input type="text" placeholder="Search..." />
                    </div>

                    <button className="date-picker-btn">
                        <Calendar size={16} />
                        <span>Dec 2024</span>
                        <ChevronDown size={14} />
                    </button>

                    <button className="export-report-btn">
                        <Download size={16} />
                        <span>Export</span>
                    </button>

                    <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }}></div>

                    <div className="top-actions" style={{ marginLeft: 0 }}>
                        {/* Reusing top-actions layout but embedded primarily for profile/settings if desired, or keep main header separate? 
                            The image shows profile in top right corner separate from controls row for report.
                            Let's follow standard dashboard header logic: Profile is always at top right. 
                            The Report Specific controls (Search, Date, Export) are IN THE HEADER ROW? 
                            Looking at image: Yes, "Attendance Report" on left, Controls on Right. Profile is likely ABOVE this level or handled by standard layout.
                            However, in our Dashboard.tsx, the header is part of the page content.
                         */}
                        <button className="theme-toggle">
                            <Moon size={20} />
                        </button>
                        <Settings size={20} style={{ color: '#6b7280', cursor: 'pointer' }} />
                    </div>
                </div>
            </header>

            <div className="reports-container">
                {/* Stats Grid */}
                <div className="reports-stats-grid">
                    <div className="report-stat-card">
                        <div>
                            <span className="r-stat-label">Total Attendance</span>
                            <div className="r-stat-main">
                                <span className="r-stat-value">1,849</span>
                                <span className="r-stat-change change-pos">↑ 12%</span>
                            </div>
                        </div>
                        <span className="r-stat-sub">vs last month</span>
                    </div>

                    <div className="report-stat-card">
                        <div>
                            <span className="r-stat-label">Average Per Event</span>
                            <div className="r-stat-main">
                                <span className="r-stat-value">246</span>
                            </div>
                        </div>
                        <span className="r-stat-sub">Across 8 events</span>
                    </div>

                    <div className="report-stat-card">
                        <div>
                            <span className="r-stat-label">Attendance Rate</span>
                            <div className="r-stat-main">
                                <span className="r-stat-value">89%</span>
                                <span className="r-stat-change change-pos">↑ 3%</span>
                            </div>
                        </div>
                        <span className="r-stat-sub">vs last month</span>
                    </div>

                    <div className="report-stat-card">
                        <div>
                            <span className="r-stat-label">Total Events</span>
                            <div className="r-stat-main">
                                <span className="r-stat-value">16</span>
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
                            <span className="time-badge">This Week</span>
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
                                <p>246 <span className="r-chart-subtitle">Total Leaders</span></p>
                            </div>
                            <span className="time-badge">This Week</span>
                        </div>

                        <div style={{ width: '100%', height: 180, marginTop: '1.5rem' }}>
                            <ResponsiveContainer>
                                <BarChart data={clusterData}>
                                    <Bar dataKey="total" stackId="a" fill="#e0e7ff" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="value" stackId="a" fill="#6366f1" radius={[0, 0, 4, 4]} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
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
                                <th>Total Members</th>
                                <th>Attendance Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logsData.map((log, index) => (
                                <tr key={index}>
                                    <td style={{ color: '#6b7280' }}>{log.date}</td>
                                    <td style={{ fontWeight: 600 }}>{log.event}</td>
                                    <td className="text-green">{log.present}</td>
                                    <td className="text-red">{log.absent}</td>
                                    <td>{log.total}</td>
                                    <td>
                                        <div className="rate-bar-container">
                                            <div className="progress-track">
                                                <div className="progress-fill" style={{ width: `${log.rate}%` }}></div>
                                            </div>
                                            <span className="rate-text">{log.rate}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="logs-pagination">
                        <span>Showing 5 of 24 events</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="p-btn-small" style={{ borderRadius: '50%', width: '24px', height: '24px' }}><ChevronLeft size={14} /></button>
                            <button className="p-btn-small active" style={{ borderRadius: '50%', width: '24px', height: '24px' }}>1</button>
                            <button className="p-btn-small" style={{ borderRadius: '50%', width: '24px', height: '24px' }}>2</button>
                            <button className="p-btn-small" style={{ borderRadius: '50%', width: '24px', height: '24px' }}>3</button>
                            <button className="p-btn-small" style={{ borderRadius: '50%', width: '24px', height: '24px' }}><ChevronRight size={14} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
