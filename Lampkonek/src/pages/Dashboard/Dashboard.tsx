import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, User, Calendar, BarChart, Settings, LogOut, UserCircle, CheckSquare, Clock, Activity, UserPlus, TrendingUp, Bell, MapPin, ChevronRight, Repeat, Menu, X } from 'lucide-react';
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
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../../components/UserProfile';


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

interface RecentActivity {
    id: string;
    type: 'Member' | 'Reservation' | 'Attendance';
    title: string;
    description: string;
    timestamp: string;
}

interface UpcomingService {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string;
    location: string;
    isRecurring?: boolean;
}

interface RecurringEventConfig {
    key: string;
    title: string;
    dayOfWeek: number;
    time: string;
    endTime: string;
    enabled: boolean;
    venue: string;
}

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

// Helper to format time
const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};



export const Dashboard = () => {
    const navigate = useNavigate();
    const { profile, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('');
    const [reportType, setReportType] = useState('Attendance'); // 'Attendance' | 'Members'
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [allowedTabs, setAllowedTabs] = useState<string[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [upcomingServices, setUpcomingServices] = useState<UpcomingService[]>([]);


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

                // Fetch Recent Activity (New Members & Reservations)
                const { data: recentMembers } = await supabase
                    .from('profiles')
                    .select('id, full_name, created_at')
                    .order('created_at', { ascending: false })
                    .limit(3);

                const { data: recentReservations } = await supabase
                    .from('reservations')
                    .select('id, event_title, created_at, event_type')
                    .order('created_at', { ascending: false })
                    .limit(3);

                const activities: RecentActivity[] = [];

                if (recentMembers) {
                    recentMembers.forEach((m: any) => {
                        activities.push({
                            id: m.id,
                            type: 'Member',
                            title: 'New member registered',
                            description: m.full_name || 'New Member',
                            timestamp: m.created_at
                        });
                    });
                }

                if (recentReservations) {
                    recentReservations.forEach((r: any) => {
                        activities.push({
                            id: r.id,
                            type: 'Reservation',
                            title: 'Venue reserved',
                            description: r.event_title || 'Reservation',
                            timestamp: r.created_at
                        });
                    });
                }

                // Sort by timestamp desc and take top 5
                activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setRecentActivity(activities.slice(0, 5));

                // Fetch Upcoming Services (Approved Reservations)
                const { data: upcoming } = await supabase
                    .from('reservations')
                    .select('*')
                    .eq('status', 'APPROVED')
                    .gte('event_date', today)
                    .order('event_date', { ascending: true });

                // Fetch Recurring Settings
                const { data: recurringData } = await supabase
                    .from('app_settings')
                    .select('value')
                    .eq('key', 'recurring_events')
                    .single();

                let recurringConfigs: RecurringEventConfig[] = [];
                if (recurringData?.value) {
                    recurringConfigs = JSON.parse(recurringData.value);
                } else {
                    // Default fallbacks if not configured
                    recurringConfigs = [
                        { key: 'sunday_service', title: 'Sunday Service', dayOfWeek: 0, time: '09:00', endTime: '11:00', enabled: true, venue: 'Main Sanctuary' },
                        { key: 'prayer_meeting', title: 'Prayer Meeting', dayOfWeek: 1, time: '19:00', endTime: '20:30', enabled: true, venue: 'Prayer Room' },
                        { key: 'bible_study', title: 'Bible Study', dayOfWeek: 5, time: '18:00', endTime: '19:30', enabled: true, venue: 'Community Hall' },
                    ];
                }

                const allServices: UpcomingService[] = [];

                // 1. Add manual approved reservations
                if (upcoming) {
                    upcoming.forEach((u: any) => {
                        allServices.push({
                            id: u.id,
                            title: u.event_title || 'Event',
                            date: u.event_date,
                            time: u.start_time ? `${formatTime(u.start_time)}` : 'TBD',
                            location: u.venue || 'Main Hall',
                            isRecurring: false
                        });
                    });
                }

                // 2. Generate recurring instances for TODAY ONLY
                const d = new Date();
                const dayOfWeek = d.getDay();
                const dateStr = d.toISOString().split('T')[0];

                recurringConfigs
                    .filter(config => config.enabled && config.dayOfWeek === dayOfWeek)
                    .forEach(config => {
                        const exists = allServices.find(s => s.date === dateStr && s.title === config.title);
                        if (!exists) {
                            allServices.push({
                                id: `recurring-${config.key}-${dateStr}`,
                                title: config.title,
                                date: dateStr,
                                time: formatTime(config.time),
                                location: config.venue,
                                isRecurring: true
                            });
                        }
                    });

                // Filter everything to show only TODAY's events
                const servicesToday = allServices.filter(s => s.date === dateStr);

                // Sort by time
                servicesToday.sort((a, b) => a.time.localeCompare(b.time));

                setUpcomingServices(servicesToday);


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
            {/* Mobile Header */}
            <header className="mobile-header">
                <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
                    <Menu size={24} />
                </button>
                <div className="mobile-logo-container">
                    <img src="/logo/lamp.png" alt="Lampkonek" className="mobile-logo" />
                </div>
                <div style={{ width: 40 }}></div> {/* Spacer for alignment */}
            </header>

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo-container">
                        <img src="/logo/lamp.png" alt="Lampkonek" className="sidebar-logo" />
                    </div>
                    <button className="sidebar-close-btn" onClick={() => setIsSidebarOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => {
                        if (allowedTabs.includes(item.id)) {
                            return (
                                <a
                                    key={item.id}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(item.id); // Use item.id for consistency with navItems and activeTab state
                                        setIsSidebarOpen(false); // Close sidebar on mobile
                                    }}
                                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
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

            {/* Sidebar Overlay for mobile */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

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
                    <div className="dashboard-view-content">
                        {/* Top Bar - Header area with page title and user profile */}
                        <header className="top-bar">
                            <div className="page-title">
                                <h1>Dashboard</h1>
                                <p>Welcome back, {profile?.full_name?.split(' ')[0]}!</p>
                            </div>
                            <div className="top-actions">
                                <UserProfile />
                            </div>
                        </header>

                        {/* We use a robust margin-bottom on the top-bar via CSS to ensure 
                            clear visual separation before the stats grid begins. */}

                        {/* Stats Grid - Key performance indicators */}
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
                            {/* ... existing chart code ... */}
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
                                                <LineChart data={attendanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
                                    <div className="pie-chart-container" style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center' }}>
                                        <div className="pie-chart-wrapper" style={{ width: '50%', height: '100%' }}>
                                            <ResponsiveContainer width="100%" height="100%">
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
                                        </div>
                                        <div className="pie-chart-legend" style={{ width: '50%', paddingLeft: '1rem' }}>
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

                        {/* Recent Activity & Upcoming Services */}
                        <div className="tables-section">
                            {/* Recent Activity */}
                            <div className="activity-card">
                                <h3>Recent Activity</h3>
                                <div className="activity-list">
                                    {recentActivity.length === 0 ? (
                                        <div className="empty-state">No recent activity</div>
                                    ) : (
                                        recentActivity.map((item, index) => {
                                            let Icon = Activity;
                                            let iconColor = 'bg-blue-100 text-blue-600';

                                            if (item.type === 'Member') {
                                                Icon = UserPlus;
                                                iconColor = 'bg-green-100 text-green-600';
                                            } else if (item.type === 'Reservation') {
                                                Icon = Calendar;
                                                iconColor = 'bg-purple-100 text-purple-600';
                                            } else if (item.type === 'Attendance') {
                                                Icon = CheckSquare;
                                                iconColor = 'bg-orange-100 text-orange-600';
                                            }

                                            return (
                                                <div key={item.id} className="activity-item">
                                                    <div className="activity-timeline">
                                                        <div className={`activity-icon-wrapper ${iconColor}`}>
                                                            <Icon size={16} />
                                                        </div>
                                                        {index !== recentActivity.length - 1 && <div className="activity-line"></div>}
                                                    </div>
                                                    <div className="activity-content">
                                                        <div className="activity-header">
                                                            <p className="activity-title">{item.title}</p>
                                                            <span className="activity-time">{timeAgo(item.timestamp)}</span>
                                                        </div>
                                                        <p className="activity-subtitle">{item.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Upcoming Services */}
                            <div className="activity-card">
                                <h3>Announcements & Upcoming Services</h3>
                                <div className="services-list">
                                    {latestAnnouncement && (
                                        <div className="announcement-service-item">
                                            <div className="service-date-card announcement-bg">
                                                <Bell size={20} />
                                            </div>
                                            <div className="service-details">
                                                <div className="service-title-group">
                                                    <p className="service-title announcement-title-text">Announcement</p>
                                                    <ChevronRight size={14} className="service-arrow" />
                                                </div>
                                                <p className="service-info">{latestAnnouncement.title}</p>
                                            </div>
                                        </div>
                                    )}
                                    {upcomingServices.length === 0 ? (
                                        <div className="empty-state">No events scheduled for today</div>
                                    ) : (
                                        upcomingServices.map((service) => {
                                            const date = new Date(service.date);
                                            const day = date.getDate();
                                            const month = date.toLocaleString('default', { month: 'short' });
                                            return (
                                                <div key={service.id} className="service-item">
                                                    <div className="service-date-card">
                                                        <span className="service-day">{day}</span>
                                                        <span className="service-month">{month}</span>
                                                    </div>
                                                    <div className="service-details">
                                                        <div className="service-title-group">
                                                            <p className="service-title">
                                                                {service.isRecurring && <Repeat size={14} className="recurring-icon" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: '#6366f1' }} />}
                                                                {service.title}
                                                            </p>
                                                            <ChevronRight size={14} className="service-arrow" />
                                                        </div>
                                                        <div className="service-meta">
                                                            <span className="service-meta-item">
                                                                <Clock size={14} /> {service.time}
                                                            </span>
                                                            <span className="service-meta-item">
                                                                <MapPin size={14} /> {service.location}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
