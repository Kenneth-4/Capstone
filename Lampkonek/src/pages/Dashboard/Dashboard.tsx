import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, User, Calendar, BarChart, Settings, LogOut, UserCircle, Moon, CheckSquare, Clock, Activity, UserPlus, TrendingUp, Bell, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import './Dashboard.css';
import { Members } from './Members';
import { Attendance } from './Attendance';
import { Reservation } from './Reservation';
import { Reports } from './Reports';
import { MemberReport } from './MemberReport';
import { Settings as SettingsPage } from './Settings';
import { MyProfile } from './MyProfile';
import { UserProfile } from '../../components/UserProfile';
import { useAuth } from '../../context/AuthContext';


interface DashboardStats {
    totalMembers: number;
    activeMembers: number;
    newMembersThisMonth: number;
    approvedReservations: number;
    pendingReservations: number;
    attendanceThisWeek: number;
}

interface AttendanceChartData {
    name: string;
    present: number;
    absent: number;
    visitor: number;
}

interface MemberStatusChartData {
    name: string;
    value: number;
    color: string;
}

export const Dashboard = () => {
    const navigate = useNavigate();
    const { profile, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('');
    const [reportType, setReportType] = useState('Attendance'); // 'Attendance' | 'Members'
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showAnnouncement, setShowAnnouncement] = useState(true);
    const [allowedTabs, setAllowedTabs] = useState<string[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalMembers: 0,
        activeMembers: 0,
        newMembersThisMonth: 0,
        approvedReservations: 0,
        pendingReservations: 0,
        attendanceThisWeek: 0
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [latestAnnouncement, setLatestAnnouncement] = useState<{ title: string } | null>(null);

    // Chart data state
    const [attendanceData, setAttendanceData] = useState<AttendanceChartData[]>([]);
    const [memberStatusData, setMemberStatusData] = useState<MemberStatusChartData[]>([
        { name: 'Active', value: 0, color: '#10b981' },
        { name: 'Inactive', value: 0, color: '#f43f5e' },
        { name: 'Transferred', value: 0, color: '#9ca3af' },
        { name: 'Visitor', value: 0, color: '#f59e0b' },
    ]);
    const [isLoadingCharts, setIsLoadingCharts] = useState(true);

    // Fetch user's role permissions from database
    useEffect(() => {
        const fetchRolePermissions = async () => {
            if (!profile) return;

            try {
                setIsLoadingPermissions(true);
                const userRole = profile.role || 'Member';

                // Fetch the role's permissions from the database
                const { data: roleData, error } = await supabase
                    .from('roles')
                    .select('permissions')
                    .eq('name', userRole)
                    .single();

                if (error) {
                    console.error('Error fetching role permissions:', error);
                    // Fallback to My Profile only if role not found
                    setAllowedTabs(['My Profile']);
                    return;
                }

                const permissions = roleData?.permissions || [];
                console.log(`User role: ${userRole}, Permissions:`, permissions);

                // Map page names to match navigation items
                // Permissions are stored as page names like 'Dashboard', 'Members', etc.
                const mappedPermissions = permissions.map((p: string) => {
                    if (p === 'Reservations') return 'Reservation';
                    if (p === 'Profile') return 'My Profile';
                    return p;
                });

                const tabs = mappedPermissions.length > 0 ? mappedPermissions : ['My Profile'];

                // Always ensure My Profile is accessible
                if (!tabs.includes('My Profile')) {
                    tabs.push('My Profile');
                }

                setAllowedTabs(tabs);
            } catch (error) {
                console.error('Error in fetchRolePermissions:', error);
                setAllowedTabs(['My Profile']);
            } finally {
                setIsLoadingPermissions(false);
            }
        };

        if (!loading && profile) {
            fetchRolePermissions();
        }
    }, [profile, loading]);

    // Fetch dashboard statistics
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                setIsLoadingStats(true);

                // Fetch total members
                const { count: totalMembers } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // Fetch total members (all members are considered active)
                const { count: activeMembers } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // Fetch new members this month
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);

                const { count: newMembersThisMonth } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true })
                    .gte('created_at', startOfMonth.toISOString());

                // Fetch approved reservations (upcoming)
                const today = new Date().toISOString().split('T')[0];
                const { count: approvedReservations } = await supabase
                    .from('reservations')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'APPROVED')
                    .gte('event_date', today);

                // Fetch pending reservations
                const { count: pendingReservations } = await supabase
                    .from('reservations')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'PENDING');

                // Fetch attendance this week
                const startOfWeek = new Date();
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                startOfWeek.setHours(0, 0, 0, 0);

                const { count: attendanceThisWeek } = await supabase
                    .from('attendance')
                    .select('*', { count: 'exact', head: true })
                    .gte('date', startOfWeek.toISOString().split('T')[0]);

                setStats({
                    totalMembers: totalMembers || 0,
                    activeMembers: activeMembers || 0,
                    newMembersThisMonth: newMembersThisMonth || 0,
                    approvedReservations: approvedReservations || 0,
                    pendingReservations: pendingReservations || 0,
                    attendanceThisWeek: attendanceThisWeek || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                toast.error('Failed to load dashboard statistics');
            } finally {
                setIsLoadingStats(false);
            }
        };

        const fetchLatestAnnouncement = async () => {
            try {
                const { data, error } = await supabase
                    .from('announcements')
                    .select('title')
                    .eq('status', 'Active')
                    .order('date', { ascending: false })
                    .limit(1);

                if (!error && data && data.length > 0) {
                    setLatestAnnouncement(data[0]);
                }
            } catch (error) {
                console.error('Error fetching announcement:', error);
            }
        };

        if (activeTab === 'Dashboard' || activeTab === '') {
            fetchDashboardStats();
            fetchLatestAnnouncement();
        }
    }, [activeTab]);

    // Fetch chart data
    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setIsLoadingCharts(true);

                // Fetch member status
                const { data: profiles, error: statusError } = await supabase
                    .from('profiles')
                    .select('status');

                if (statusError) throw statusError;

                // Count members by status
                const statusCounts: Record<string, number> = {
                    'Active': 0,
                    'Inactive': 0,
                    'Transferred': 0,
                    'Visitor': 0
                };

                profiles?.forEach((profile: any) => {
                    // Default to 'Active' as per recent migration update, or 'Inactive' if preferred.
                    // Let's default to 'Active' to fix the user's issue with seeing 'Inactive'.
                    const status = profile.status || 'Active';
                    statusCounts[status] = (statusCounts[status] || 0) + 1;
                });

                // Define colors for known statuses
                const statusColors: Record<string, string> = {
                    'Active': '#10b981',
                    'Inactive': '#f43f5e',
                    'Transferred': '#9ca3af',
                    'Visitor': '#f59e0b'
                };

                // Convert to chart data format
                const statusData = Object.entries(statusCounts).map(([name, count]) => ({
                    name,
                    value: count,
                    color: statusColors[name] || '#6366f1' // Fallback color
                }));

                setMemberStatusData(statusData);

                // Fetch attendance trends for last 6 months
                const monthsData: AttendanceChartData[] = [];
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                for (let i = 5; i >= 0; i--) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;
                    const monthName = monthNames[date.getMonth()];

                    // Get first and last day of month
                    const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0];
                    const lastDay = new Date(year, month, 0).toISOString().split('T')[0];

                    // Fetch attendance for this month
                    const { data: attendanceRecords, error: attendanceError } = await supabase
                        .from('attendance')
                        .select('status')
                        .gte('date', firstDay)
                        .lte('date', lastDay);

                    if (attendanceError) {
                        console.error('Error fetching attendance:', attendanceError);
                        monthsData.push({ name: monthName, present: 0, absent: 0, visitor: 0 });
                        continue;
                    }

                    // Count by status
                    let present = 0;
                    let absent = 0;
                    let visitor = 0;

                    attendanceRecords?.forEach((record: any) => {
                        if (record.status === 'Present') present++;
                        else if (record.status === 'Absent') absent++;
                        else if (record.status === 'Visitor') visitor++;
                    });

                    monthsData.push({ name: monthName, present, absent, visitor });
                }

                setAttendanceData(monthsData);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            } finally {
                setIsLoadingCharts(false);
            }
        };

        if (activeTab === 'Dashboard' || activeTab === '') {
            fetchChartData();
        }
    }, [activeTab]);

    // Set initial active tab when permissions are loaded
    useEffect(() => {
        if (!isLoadingPermissions && allowedTabs.length > 0) {
            // If currently active tab is not allowed (or empty), redirect to first allowed tab
            if (!activeTab || !allowedTabs.includes(activeTab)) {
                setActiveTab(allowedTabs[0]);
            }
        }
    }, [isLoadingPermissions, allowedTabs, activeTab]);

    const handleLogout = () => {
        setIsLoggingOut(true);
        // Simulate loading delay for better UX
        setTimeout(() => {
            toast.success('You have successfully logged out');
            navigate('/login');
        }, 1500);
    };

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="progress"></div>
            </div>
        );
    }

    const navItems = [
        { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'Attendance', icon: Users, label: 'Attendance' },
        { id: 'Members', icon: User, label: 'Members' },
        { id: 'Reservation', icon: Calendar, label: 'Reservation' },
        { id: 'Reports', icon: BarChart, label: 'Reports' },
        { id: 'Settings', icon: Settings, label: 'Settings' },
        { id: 'My Profile', icon: UserCircle, label: 'My Profile' },
    ];

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
                    {navItems.map((item) => {
                        if (allowedTabs.includes(item.id)) {
                            return (
                                <a
                                    key={item.id}
                                    href="#"
                                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </a>
                            );
                        }
                        return null;
                    })}
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

                            </div>

                            <div className="top-actions">
                                <button className="theme-toggle">
                                    <Moon size={20} />
                                </button>

                                <UserProfile />
                            </div>
                        </header>

                        {/* Announcement Banner */}
                        {showAnnouncement && latestAnnouncement && (
                            <div className="announcement-banner">
                                <div className="announcement-content">
                                    <div className="announcement-icon">
                                        <Bell size={20} />
                                    </div>
                                    <div className="announcement-text">
                                        <span className="announcement-title">New Announcement:</span>
                                        <span>{latestAnnouncement?.title || 'No new announcements.'}</span>
                                    </div>
                                </div>
                                <button className="announcement-close" onClick={() => setShowAnnouncement(false)}>
                                    <X size={18} />
                                </button>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="dashboard-stats-grid">
                            <div className="dashboard-stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Total Members</span>
                                    <span className="stat-value">
                                        {isLoadingStats ? '...' : stats.totalMembers}
                                    </span>
                                    <span className="stat-trend positive">
                                        <TrendingUp size={16} /> {stats.totalMembers > 0 ? '8%' : '0%'}
                                    </span>
                                </div>
                                <div className="stat-icon icon-bg-green">
                                    <Users size={24} />
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Attendance This Week</span>
                                    <span className="stat-value">
                                        {isLoadingStats ? '...' : stats.attendanceThisWeek}
                                    </span>
                                    <span className="stat-trend neutral">
                                        <TrendingUp size={16} /> {stats.attendanceThisWeek > 0 ? '12%' : '0%'}
                                    </span>
                                </div>
                                <div className="stat-icon icon-bg-orange">
                                    <CheckSquare size={24} />
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Approved Reservations</span>
                                    <span className="stat-value">
                                        {isLoadingStats ? '...' : stats.approvedReservations}
                                    </span>
                                    <span className="stat-footer-text">Upcoming for next week</span>
                                </div>
                                <div className="stat-icon icon-bg-blue">
                                    <Calendar size={24} />
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Pending Requests</span>
                                    <span className="stat-value">
                                        {isLoadingStats ? '...' : stats.pendingReservations}
                                    </span>
                                    <span className="stat-footer-text" style={{ color: stats.pendingReservations > 0 ? '#f97316' : '#6b7280' }}>
                                        {stats.pendingReservations > 0 ? 'Action required' : 'All clear'}
                                    </span>
                                </div>
                                <div className="stat-icon icon-bg-peach">
                                    <Clock size={24} />
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">Active Members</span>
                                    <span className="stat-value">
                                        {isLoadingStats ? '...' : stats.activeMembers}
                                    </span>
                                    <span className="stat-trend positive">
                                        <TrendingUp size={16} /> {stats.activeMembers > 0 ? '5%' : '0%'}
                                    </span>
                                </div>
                                <div className="stat-icon icon-bg-indigo">
                                    <Activity size={24} />
                                </div>
                            </div>

                            <div className="dashboard-stat-card">
                                <div className="stat-content">
                                    <span className="stat-label">New Members This Month</span>
                                    <span className="stat-value">
                                        {isLoadingStats ? '...' : stats.newMembersThisMonth}
                                    </span>
                                    <span className="stat-trend positive">
                                        <TrendingUp size={16} /> {stats.newMembersThisMonth > 0 ? '15%' : '0%'}
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
                                        <option>Last 6 Months</option>
                                    </select>
                                </div>
                                {isLoadingCharts ? (
                                    <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                        Loading chart data...
                                    </div>
                                ) : attendanceData.length === 0 ? (
                                    <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                        No attendance data available
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ width: '100%', height: 300 }}>
                                            <ResponsiveContainer>
                                                <LineChart data={attendanceData}>
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
                                    </>
                                )}
                            </div>

                            {/* Pie Chart */}
                            <div className="chart-card">
                                <div className="chart-header">
                                    <h3>Member Status Distribution</h3>
                                    <a href="#" className="chart-link">View Details</a>
                                </div>
                                {isLoadingCharts ? (
                                    <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                        Loading chart data...
                                    </div>
                                ) : (
                                    <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center' }}>
                                        <ResponsiveContainer width="50%">
                                            <PieChart>
                                                <Pie
                                                    data={memberStatusData}
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={0}
                                                    dataKey="value"
                                                >
                                                    {memberStatusData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div style={{ width: '50%', paddingLeft: '1rem' }}>
                                            <table style={{ width: '100%', fontSize: '0.85rem', color: '#4b5563' }}>
                                                <tbody>
                                                    {memberStatusData.map((item, index) => {
                                                        const total = memberStatusData.reduce((sum, d) => sum + d.value, 0);
                                                        const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                                                        return (
                                                            <tr key={index} style={{ height: '2rem' }}>
                                                                <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                    <span className="dot" style={{ background: item.color }}></span>
                                                                    {item.name}
                                                                </td>
                                                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.value}</td>
                                                                <td style={{ textAlign: 'right', color: '#9ca3af', fontSize: '0.75rem' }}>
                                                                    {percentage}%
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};
