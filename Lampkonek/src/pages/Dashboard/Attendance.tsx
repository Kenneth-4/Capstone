import {
    Plus,
    Search,
    ClipboardList,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { TakeAttendanceModal } from './TakeAttendanceModal';
import { AttendanceChecklistModal } from './AttendanceChecklistModal';
import { AddAttendanceModal } from './AddAttendanceModal';
import { initializeRecurringEvents } from '../../utils/initializeRecurringEvents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import './Attendance.css';
import { UserProfile } from '../../components/UserProfile';
import { useAuth } from '../../context/AuthContext';

interface AttendanceRecord {
    id: string;
    user_id: string;
    date: string;
    event: string;
    status: string;
    cluster: string;
    profiles?: {
        full_name: string;
        cluster: string;
        avatar_url?: string;
    };
    remarks?: string;
}

// Helper to generate consistent colors based on string

export const Attendance = () => {
    const { profile } = useAuth();
    const [isTakeAttendanceOpen, setIsTakeAttendanceOpen] = useState(false);
    const [isChecklistOpen, setIsChecklistOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addModalMode, setAddModalMode] = useState<'Onsite' | 'Online'>('Onsite');
    const hasRunAutomation = useState(false);

    // State for data
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('All Events');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [eventsList, setEventsList] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'All' | 'Onsite' | 'Online'>('Onsite');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Initialize recurring events if they don't exist
                await initializeRecurringEvents();

                // Fetch approved reservation events
                const { data: reservationsData } = await supabase
                    .from('reservations')
                    .select('event_title')
                    .eq('status', 'APPROVED');

                // Fetch recurring events
                const { data: settingsData } = await supabase
                    .from('app_settings')
                    .select('value')
                    .eq('key', 'recurring_events')
                    .single();

                let allEventTitles: string[] = [];

                if (reservationsData) {
                    allEventTitles = reservationsData.map((item: any) => item.event_title);
                }

                if (settingsData?.value) {
                    const recurringEvents: any[] = JSON.parse(settingsData.value);
                    const recurringTitles = recurringEvents
                        .filter(e => e.enabled)
                        .map(e => e.title);
                    allEventTitles = [...allEventTitles, ...recurringTitles];
                }

                const uniqueTitles = Array.from(new Set(allEventTitles));
                setEventsList(uniqueTitles);
            } catch (error) {
                console.error('Error fetching event filters:', error);
            }
        };
        fetchEvents();
        if (!hasRunAutomation[0]) {
            runAutomations();
            hasRunAutomation[1](true);
        }
    }, []);

    const runAutomations = async () => {
        await processAutomaticAbsences();
        await processMemberStatus();
    };

    // Automatic Absence Marking Logic
    const processAutomaticAbsences = async () => {
        try {
            const { data: settingsData } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'recurring_events')
                .single();

            if (!settingsData?.value) return;
            const recurringEvents: any[] = JSON.parse(settingsData.value);
            const enabledEvents = recurringEvents.filter(e => e.enabled);
            if (enabledEvents.length === 0) return;

            const { data: members } = await supabase.from('profiles').select('id');
            if (!members || members.length === 0) return;
            const allMemberIds = new Set(members.map(m => m.id));

            const today = new Date();
            const currentHours = today.getHours();
            const currentMinutes = today.getMinutes();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < 7; i++) {
                const checkDate = new Date(today);
                checkDate.setDate(today.getDate() - i);
                const dayOfWeek = checkDate.getDay();
                const dateStr = checkDate.toISOString().split('T')[0];
                const eventsForDay = enabledEvents.filter(e => e.dayOfWeek === dayOfWeek);

                for (const event of eventsForDay) {
                    if (i === 0) {
                        const [endHour, endMinute] = event.endTime.split(':').map(Number);
                        if (currentHours < endHour || (currentHours === endHour && currentMinutes < endMinute)) {
                            continue;
                        }
                    }
                    const { data: existingRecords } = await supabase
                        .from('attendance')
                        .select('user_id')
                        .eq('date', dateStr)
                        .eq('event', event.title);

                    const presentUserIds = new Set(existingRecords?.map(r => r.user_id) || []);
                    const absentRecords: any[] = [];
                    allMemberIds.forEach(id => {
                        if (!presentUserIds.has(id)) {
                            absentRecords.push({
                                user_id: id,
                                date: dateStr,
                                event: event.title,
                                status: 'Absent',
                                remarks: 'Auto-marked by System'
                            });
                        }
                    });

                    if (absentRecords.length > 0) {
                        await supabase.from('attendance').upsert(absentRecords, { onConflict: 'user_id,date,event' });
                    }
                }
            }
            fetchAttendance();
        } catch (error) {
            console.error('Error processing automatic absences:', error);
        }
    };

    const processMemberStatus = async () => {
        try {
            const { data: settingsData } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'recurring_events')
                .single();

            if (!settingsData?.value) return;
            const recurringEvents: any[] = JSON.parse(settingsData.value);
            const enabledEvents = recurringEvents.filter(e => e.enabled);
            if (enabledEvents.length === 0) return;

            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const currentHours = today.getHours();
            const currentMinutes = today.getMinutes();

            let expectedEventCount = 0;
            const eventTitles = new Set();

            for (let d = new Date(startOfMonth); d <= today; d.setDate(d.getDate() + 1)) {
                const dayOfWeek = d.getDay();
                const isToday = d.toDateString() === today.toDateString();
                const daysEvents = enabledEvents.filter(e => e.dayOfWeek === dayOfWeek);

                for (const event of daysEvents) {
                    if (isToday) {
                        const [endHour, endMinute] = event.endTime.split(':').map(Number);
                        if (currentHours < endHour || (currentHours === endHour && currentMinutes < endMinute)) {
                            continue;
                        }
                    }
                    expectedEventCount++;
                    eventTitles.add(event.title);
                }
            }

            if (expectedEventCount === 0) return;

            const { data: members } = await supabase.from('profiles').select('id, status');
            if (!members) return;

            const { data: attendance } = await supabase
                .from('attendance')
                .select('user_id')
                .eq('status', 'Present')
                .gte('date', startOfMonth.toISOString().split('T')[0])
                .lte('date', today.toISOString().split('T')[0])
                .in('event', Array.from(eventTitles));

            const attendanceMap = new Map();
            if (attendance) {
                attendance.forEach((rec: any) => {
                    const current = attendanceMap.get(rec.user_id) || 0;
                    attendanceMap.set(rec.user_id, current + 1);
                });
            }

            for (const member of members) {
                const presentCount = attendanceMap.get(member.id) || 0;
                let newStatus = member.status;
                if (presentCount === expectedEventCount) newStatus = 'Active';
                else if (presentCount === 0) newStatus = 'Inactive';
                else newStatus = 'Semi Active';

                if (member.status === 'Deceased' || member.status === 'Transferred') continue;
                if (newStatus !== member.status) {
                    await supabase.from('profiles').update({ status: newStatus }).eq('id', member.id);
                }
            }
        } catch (error) {
            console.error('Error processing member status:', error);
        }
    };

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('attendance')
                .select(`*, profiles:user_id (*)`)
                .order('date', { ascending: false });

            if (selectedEvent !== 'All Events') {
                query = query.eq('event', selectedEvent);
            }

            if (dateFrom) {
                query = query.gte('date', dateFrom);
            }
            if (dateTo) {
                query = query.lte('date', dateTo);
            }

            const { data, error } = await query;
            if (error) throw error;

            if (data) {
                const mappedData = data.map((record: any) => ({
                    ...record,
                    profiles: Array.isArray(record.profiles) ? record.profiles[0] : record.profiles,
                    cluster: (Array.isArray(record.profiles) ? record.profiles[0]?.cluster : record.profiles?.cluster) || 'Unassigned',
                }));
                setAttendanceRecords(mappedData);
            }
        } catch (error: any) {
            console.error('Error fetching attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedEvent, dateFrom, dateTo, isChecklistOpen, isAddModalOpen]);

    // Computed Logic for Pagination & Filtering
    const filteredRecords = attendanceRecords.filter(item => {
        if (!item.profiles) return false;
        // Search Filter
        const matchesSearch = item.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase());

        // Tab Filter
        let matchesTab = true;
        const isOnline = item.event.toLowerCase().includes('online') || item.remarks === 'Online';

        if (activeTab === 'Onsite') {
            matchesTab = !isOnline;
        } else if (activeTab === 'Online') {
            matchesTab = isOnline;
        }

        return matchesSearch && matchesTab;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Reset to page 1 when search or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab, selectedEvent, dateFrom, dateTo]);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) pages.push('...');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push('...');

            // Always show last page
            if (!pages.includes(totalPages)) pages.push(totalPages);
        }
        return pages;
    };

    // Chart Data Preparation
    const monthlyAttendanceData = useMemo(() => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const data = months.map(m => ({ name: m, attendance: 0 }));

        attendanceRecords.forEach(record => {
            if (record.status === 'Present') {
                const date = new Date(record.date);
                if (!isNaN(date.getTime())) {
                    const monthIndex = date.getMonth();
                    data[monthIndex].attendance += 1;
                }
            }
        });
        return data;
    }, [attendanceRecords]);

    const onsiteVsOnlineData = useMemo(() => {
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        const data = months.map(m => ({ name: m, Onsite: 0, Online: 0 }));

        attendanceRecords.forEach(record => {
            if (record.status === 'Present') {
                const date = new Date(record.date);
                if (!isNaN(date.getTime())) {
                    const monthIndex = date.getMonth();
                    const isOnline = record.event.toLowerCase().includes('online') || record.remarks === 'Online';
                    if (isOnline) {
                        data[monthIndex].Online += 1;
                    } else {
                        data[monthIndex].Onsite += 1;
                    }
                }
            }
        });
        return data;
    }, [attendanceRecords]);

    // Counts for Tabs
    const counts = useMemo(() => {
        const all = attendanceRecords.length;
        const online = attendanceRecords.filter(r =>
            r.event.toLowerCase().includes('online') || r.remarks === 'Online'
        ).length;
        const onsite = all - online;
        return { all, online, onsite };
    }, [attendanceRecords]);


    {/* 
    
    const handleExport = () => {
        const headers = ["Name", "Status", "Cluster", "Event", "Date", "Remarks"];
        const csvData = filteredRecords.map(record => [
            record.profiles?.full_name || 'Unknown',
            record.status,
            record.cluster,
            record.event,
            new Date(record.date).toLocaleDateString(),
            record.remarks || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'attendance_report.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
        
    const handlePrint = () => {
        window.print();
    };   


    */}


    return (
        <div className="attendance-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Attendance</h1>
                </div>

                <div className="top-actions">
                    <UserProfile />
                </div>
            </header>
            <div className="header-actions-row">
                <div style={{ flex: 1 }}></div> {/* Spacer */}
                <div className="action-buttons-group">
                    {profile?.role !== 'Member' && profile?.role !== 'Visitor' && (
                        <>
                            <button className="btn-secondary" onClick={() => { setAddModalMode('Onsite'); setIsAddModalOpen(true); }}>
                                <Plus size={16} /> Add Attendance
                            </button>
                            <button className="btn-primary" onClick={() => setIsChecklistOpen(true)}>
                                <ClipboardList size={16} /> Take Attendance
                            </button>
                            {/* 
                            
                            <button className="btn-primary export-btn" onClick={handleExport}>
                                <Download size={16} /> Export
                            </button>
                            <button className="btn-secondary print-btn" onClick={handlePrint}>
                                <Printer size={16} /> Print
                            </button>
                            
                            */}

                        </>
                    )}
                </div>
            </div>

            {/* Filters Bar */}
            {profile?.role !== 'Member' && profile?.role !== 'Visitor' && (
                <div className="attendance-filters-bar">
                    <div className="search-wrapper">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filters-right">
                        <div className="date-filter">
                            <label>Date From:</label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                placeholder="mm/dd/yyyy"
                            />
                        </div>
                        <div className="date-filter">
                            <label>To:</label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                placeholder="mm/dd/yyyy"
                            />
                        </div>
                        <div className="event-filter">
                            <label>Event</label>
                            <select
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                            >
                                <option>All Events</option>
                                {eventsList.map((event, index) => (
                                    <option key={index} value={event}>{event}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className={`attendance-grid ${profile?.role === 'Member' || profile?.role === 'Visitor' ? 'full-width' : ''}`}>
                {/* LEFT COLUMN: Table */}
                <div className="attendance-left-panel">
                    <div className="table-card">
                        {/* Tabs */}
                        <div className="tabs-header">
                            <button
                                className={`tab-btn ${activeTab === 'All' ? 'active' : ''}`}
                                onClick={() => setActiveTab('All')}
                            >
                                All ({counts.all})
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'Onsite' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Onsite')}
                            >
                                Onsite ({counts.onsite})
                            </button>
                            <button
                                className={`tab-btn ${activeTab === 'Online' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Online')}
                            >
                                Online ({counts.online})
                            </button>
                        </div>

                        {/* Table */}
                        <div className="table-responsive">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>NAME</th>
                                        <th>STATUS</th>
                                        <th>CLUSTER</th>
                                        <th>EVENT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((item) => {
                                        const fullName = item.profiles?.full_name || 'Unknown';
                                        return (
                                            <tr key={item.id}>
                                                <td style={{ fontWeight: 500 }}>{fullName}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span className={`status-dot-indicator ${item.status === 'Present' ? 'present' : 'absent'}`}></span>
                                                        <span className="status-text">{item.status.toUpperCase()}</span>
                                                    </div>
                                                </td>
                                                <td>{item.cluster}</td>
                                                <td>{item.event}</td>
                                            </tr>
                                        );
                                    })}
                                    {currentItems.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                                No records found.
                                            </td>
                                        </tr>
                                    )}
                                    {loading && (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                                Loading...
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination UI */}
                        <div className="pagination-container">
                            <div className="pagination-info">
                                Showing {filteredRecords.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredRecords.length)} of {filteredRecords.length} entries
                            </div>

                            <div className="pagination-controls">
                                <div className="per-page-wrapper">
                                    <span>Per Page</span>
                                    <select
                                        className="per-page-select"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>

                                <div className="pagination-pages">
                                    <button
                                        className="page-btn"
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    {getPageNumbers().map((page, index) => (
                                        typeof page === 'number' ? (
                                            <button
                                                key={index}
                                                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                                onClick={() => paginate(page)}
                                            >
                                                {page}
                                            </button>
                                        ) : (
                                            <span key={index} className="pagination-ellipsis">{page}</span>
                                        )
                                    ))}

                                    <button
                                        className="page-btn"
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Legend / Footer */}
                        <div className="table-legend-footer">
                            <div className="legend-item">
                                <span className="status-dot-indicator present"></span>
                                <span>Present: {currentItems.filter(i => i.status === 'Present').length}</span>
                            </div>
                            <div className="legend-item">
                                <span className="status-dot-indicator absent"></span>
                                <span>Absent: {currentItems.filter(i => i.status === 'Absent').length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Charts */}
                {profile?.role !== 'Member' && profile?.role !== 'Visitor' && (
                    <div className="attendance-right-panel">
                        {/* Monthly Attendance Chart */}
                        <div className="chart-card">
                            <h3>Monthly Attendance</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <BarChart data={monthlyAttendanceData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} interval={0} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                                        <RechartsTooltip cursor={{ fill: 'transparent' }} />
                                        <Bar dataKey="attendance" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Onsite vs Online Chart */}
                        <div className="chart-card">
                            <h3>Onsite vs Online</h3>
                            <div style={{ width: '100%', height: 200 }}>
                                <ResponsiveContainer>
                                    <LineChart data={onsiteVsOnlineData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} interval={0} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                                        <RechartsTooltip />
                                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                        <Line type="monotone" dataKey="Online" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                                        <Line type="monotone" dataKey="Onsite" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <TakeAttendanceModal isOpen={isTakeAttendanceOpen} onClose={() => setIsTakeAttendanceOpen(false)} />
            <AttendanceChecklistModal isOpen={isChecklistOpen} onClose={() => setIsChecklistOpen(false)} />
            <AddAttendanceModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                initialMode={addModalMode}
            />
        </div>
    );
};
