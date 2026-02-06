import { useState } from 'react';
import { LayoutDashboard, Users, User, Calendar, BarChart, Settings, LogOut, UserCircle, Moon, CheckSquare, Clock, Activity, UserPlus, TrendingUp, Bell, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Dashboard.css';
import { Members } from './Members';
import { Attendance } from './Attendance';
import { Reservation } from './Reservation';
import { Reports } from './Reports';
import { MemberReport } from './MemberReport';
import { Settings as SettingsPage } from './Settings';
import { MyProfile } from './MyProfile';

const AttendanceData = [
    { name: 'Jan', present: 10, absent: 40, visitor: 5 },
    { name: 'Feb', present: 25, absent: 20, visitor: 30 },
    { name: 'Mar', present: 30, absent: 35, visitor: 15 },
    { name: 'Apr', present: 15, absent: 45, visitor: 30 },
    { name: 'May', present: 25, absent: 50, visitor: 20 },
    { name: 'Jun', present: 50, absent: 25, visitor: 5 },
];

const MemberStatusData = [
    { name: 'Active', value: 12, color: '#10b981' },
    { name: 'Inactive', value: 22, color: '#f43f5e' },
    { name: 'Transferred', value: 12, color: '#9ca3af' },
    { name: 'Visitor', value: 12, color: '#f59e0b' },
];

export const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [reportType, setReportType] = useState('Attendance'); // 'Attendance' | 'Members'
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showAnnouncement, setShowAnnouncement] = useState(true);

    const handleLogout = () => {
        setIsLoggingOut(true);
        // Simulate loading delay for better UX
        setTimeout(() => {
            toast.success('You have successfully logged out');
            navigate('/login');
        }, 1500);
    };

    return (
        <div className="dashboard-container">
            {isLoggingOut && (
                <div className="logout-progress-bar">
                    <div className="progress"></div>
                </div>
            )}
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-circle">
                        {/* Placeholder for Lamp Logo */}
                        <span style={{ color: '#10b981', fontSize: '24px' }}>⚡</span>
                    </div>
                    <h2 className="sidebar-title">LAMPKONEK</h2>
                </div>

                <nav className="sidebar-nav">
                    <a href="#" className={`nav-item ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('Dashboard')}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'Attendance' ? 'active' : ''}`} onClick={() => setActiveTab('Attendance')}>
                        <Users size={20} />
                        <span>Attendance</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'Members' ? 'active' : ''}`} onClick={() => setActiveTab('Members')}>
                        <User size={20} />
                        <span>Members</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'Reservation' ? 'active' : ''}`} onClick={() => setActiveTab('Reservation')}>
                        <Calendar size={20} />
                        <span>Reservation</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'Reports' ? 'active' : ''}`} onClick={() => setActiveTab('Reports')}>
                        <BarChart size={20} />
                        <span>Reports</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`} onClick={() => setActiveTab('Settings')}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'My Profile' ? 'active' : ''}`} onClick={() => setActiveTab('My Profile')}>
                        <UserCircle size={20} />
                        <span>My Profile</span>
                    </a>
                </nav>

                <div className="logout-section">
                    <button className="logout-btn" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {activeTab === 'Members' ? (
                    <Members />
                ) : activeTab === 'Attendance' ? (
                    <Attendance />
                ) : activeTab === 'Reservation' ? (
                    <Reservation />
                ) : activeTab === 'Reports' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        {/* Report Type Switcher - Optional style, can be placed in header or here */}
                        <div style={{ padding: '0 2rem', marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setReportType('Attendance')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    backgroundColor: reportType === 'Attendance' ? '#6366f1' : 'white',
                                    color: reportType === 'Attendance' ? 'white' : '#4b5563',
                                    border: '1px solid #e5e7eb',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Attendance Report
                            </button>
                            <button
                                onClick={() => setReportType('Members')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    backgroundColor: reportType === 'Members' ? '#6366f1' : 'white',
                                    color: reportType === 'Members' ? 'white' : '#4b5563',
                                    border: '1px solid #e5e7eb',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '0.9rem'
                                }}
                            >
                                Members Report
                            </button>
                        </div>
                        {reportType === 'Attendance' ? <Reports /> : <MemberReport />}
                    </div>
                ) : activeTab === 'Settings' ? (
                    <SettingsPage />
                ) : activeTab === 'My Profile' ? (
                    <MyProfile />
                ) : (
                    <>
                        {/* Top Bar */}
                        <header className="top-bar">
                            <div className="page-title">
                                <h1>Dashboard</h1>
                                <p>Welcome back, Ministry Leader</p>
                            </div>

                            <div className="top-actions">
                                <button className="theme-toggle">
                                    <Moon size={20} />
                                </button>

                                <div className="user-profile">
                                    <div className="user-info">
                                        <span className="user-name">Ministry Leader</span>
                                        <span className="user-role">ADMIN</span>
                                    </div>
                                    <div className="avatar">
                                        <User size={20} />
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Announcement Banner */}
                        {showAnnouncement && (
                            <div className="announcement-banner">
                                <div className="announcement-content">
                                    <div className="announcement-icon">
                                        <Bell size={20} />
                                    </div>
                                    <div className="announcement-text">
                                        <span className="announcement-title">New Announcement:</span>
                                        <span>Upcoming Ministry Leaders Meeting scheduled for this Friday at 5:00 PM.</span>
                                    </div>
                                </div>
                                <button className="announcement-close" onClick={() => setShowAnnouncement(false)}>
                                    <X size={18} />
                                </button>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Total Members</span>
                                    <span className="stat-value">8</span>
                                    <span className="stat-trend positive">
                                        <TrendingUp size={16} /> 8%
                                    </span>
                                </div>
                                <div className="stat-icon icon-bg-green">
                                    <Users size={24} />
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Attendance This Week</span>
                                    <span className="stat-value">245</span>
                                    <span className="stat-trend neutral">
                                        <TrendingUp size={16} /> 12%
                                    </span>
                                </div>
                                <div className="stat-icon icon-bg-orange">
                                    <CheckSquare size={24} />
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Approved Reservations</span>
                                    <span className="stat-value">3</span>
                                    <span className="stat-footer-text">Upcoming for next week</span>
                                </div>
                                <div className="stat-icon icon-bg-blue">
                                    <Calendar size={24} />
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Pending Requests</span>
                                    <span className="stat-value">2</span>
                                    <span className="stat-footer-text" style={{ color: '#f97316' }}>Action required</span>
                                </div>
                                <div className="stat-icon icon-bg-peach">
                                    <Clock size={24} />
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Active Members</span>
                                    <span className="stat-value">5</span>
                                    <span className="stat-trend positive">
                                        <TrendingUp size={16} /> 5%
                                    </span>
                                </div>
                                <div className="stat-icon icon-bg-indigo">
                                    <Activity size={24} />
                                </div>
                            </div>

                            <div className="stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">New Members This Month</span>
                                    <span className="stat-value">12</span>
                                    <span className="stat-trend positive">
                                        <TrendingUp size={16} /> 15%
                                    </span>
                                </div>
                                <div className="stat-icon icon-bg-purple">
                                    <UserPlus size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="charts-section">
                            {/* Line Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Attendance Trends</h3>
                                    <select className="time-select">
                                        <option>This Week</option>
                                        <option>Last Week</option>
                                        <option>This Month</option>
                                    </select>
                                </div>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={AttendanceData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                            <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="absent" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="visitor" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="chart-legend">
                                    <div className="legend-item"><span className="dot" style={{ background: '#10b981' }}></span> Present</div>
                                    <div className="legend-item"><span className="dot" style={{ background: '#f43f5e' }}></span> Absent</div>
                                    <div className="legend-item"><span className="dot" style={{ background: '#f59e0b' }}></span> Visitor</div>
                                </div>
                            </div>

                            {/* Pie Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Member Status Distribution</h3>
                                    <a href="#" className="chart-link">View Details</a>
                                </div>
                                <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center' }}>
                                    <ResponsiveContainer width="50%">
                                        <PieChart>
                                            <Pie
                                                data={MemberStatusData}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={0}
                                                dataKey="value"
                                            >
                                                {MemberStatusData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div style={{ width: '50%', paddingLeft: '1rem' }}>
                                        <table style={{ width: '100%', fontSize: '0.85rem', color: '#4b5563' }}>
                                            <tbody>
                                                {MemberStatusData.map((item, index) => (
                                                    <tr key={index} style={{ height: '2rem' }}>
                                                        <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <span className="dot" style={{ background: item.color }}></span>
                                                            {item.name}
                                                        </td>
                                                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.value}</td>
                                                        <td style={{ textAlign: 'right', color: '#9ca3af', fontSize: '0.75rem' }}>
                                                            {Math.round((item.value / 58) * 100)}%
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
