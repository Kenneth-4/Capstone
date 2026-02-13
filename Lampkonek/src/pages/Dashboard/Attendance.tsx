import {
    Download,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,

    Moon,
    CheckSquare,
    Info,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { TakeAttendanceModal } from './TakeAttendanceModal';
import { AttendanceChecklistModal } from './AttendanceChecklistModal';
import { AddAttendanceModal } from './AddAttendanceModal';
import { UserProfile } from '../../components/UserProfile';
import './Attendance.css';

interface AttendanceRecord {
    id: string; // or number depending on DB
    user_id: string;
    date: string;
    event: string;
    status: string;
    cluster: string; // derived from profile
    profiles?: {
        full_name: string;
        cluster: string;
        avatar_url?: string;
    };
    remarks?: string;
}

// Helper to generate consistent colors based on string
const getAvatarColor = (name: string) => {
    const colors = ['avatar-purple', 'avatar-orange', 'avatar-blue', 'avatar-pink', 'avatar-green'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

export const Attendance = () => {
    const [isTakeAttendanceOpen, setIsTakeAttendanceOpen] = useState(false); // Likely unused based on analysis, but keeping for safety
    const [isChecklistOpen, setIsChecklistOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const hasRunAutomation = useState(false); // Using state ref to prevent re-runs in same mount


    // State for data
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('All Events');
    const [selectedDate, setSelectedDate] = useState('');
    const [eventsList, setEventsList] = useState<string[]>([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await supabase
                    .from('reservations')
                    .select('event_title')
                    .eq('status', 'APPROVED');

                if (data) {
                    const titles = Array.from(new Set(data.map((item: any) => item.event_title)));
                    setEventsList(titles);
                }
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
            // 1. Get Recurring Settings
            const { data: settingsData } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'recurring_events')
                .single();

            if (!settingsData?.value) return;
            const recurringEvents: any[] = JSON.parse(settingsData.value);
            const enabledEvents = recurringEvents.filter(e => e.enabled);
            if (enabledEvents.length === 0) return;

            // 2. Get All Members
            const { data: members } = await supabase
                .from('profiles')
                .select('id');

            if (!members || members.length === 0) return;
            const allMemberIds = new Set(members.map(m => m.id));

            // 3. Check Last 7 Days (INCLUDING today if event has ended)
            const today = new Date();
            const currentHours = today.getHours();
            const currentMinutes = today.getMinutes();
            today.setHours(0, 0, 0, 0);

            for (let i = 0; i < 7; i++) {
                const checkDate = new Date(today);
                checkDate.setDate(today.getDate() - i);
                const dayOfWeek = checkDate.getDay();
                const dateStr = checkDate.toISOString().split('T')[0];

                // Find events for this day
                const eventsForDay = enabledEvents.filter(e => e.dayOfWeek === dayOfWeek);

                for (const event of eventsForDay) {
                    // Specific check for Today: Only process if event has ended
                    if (i === 0) {
                        const [endHour, endMinute] = event.endTime.split(':').map(Number);
                        if (currentHours < endHour || (currentHours === endHour && currentMinutes < endMinute)) {
                            continue; // Event hasn't ended yet
                        }
                    }
                    // Check attendance for this specific date and event
                    const { data: existingRecords } = await supabase
                        .from('attendance')
                        .select('user_id')
                        .eq('date', dateStr)
                        .eq('event', event.title);

                    const presentUserIds = new Set(existingRecords?.map(r => r.user_id) || []);

                    // Identify absent members
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

                    // Bulk Insert Absences
                    if (absentRecords.length > 0) {
                        const { error } = await supabase
                            .from('attendance')
                            .insert(absentRecords);

                        if (error) {
                            console.error(`Error auto-marking absences for ${event.title} on ${dateStr}:`, error);
                        } else {
                            console.log(`Auto-marked ${absentRecords.length} absences for ${event.title} on ${dateStr}`);
                        }
                    }
                }
            }
            // Refresh list if we added anything (optional, but good for UX if looking at past dates)
            fetchAttendance();

        } catch (error) {
            console.error('Error processing automatic absences:', error);
        }
    };

    // Automatic Status Tagging Logic
    const processMemberStatus = async () => {
        try {
            // 1. Get Recurring Settings
            const { data: settingsData } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'recurring_events')
                .single();

            if (!settingsData?.value) return;
            const recurringEvents: any[] = JSON.parse(settingsData.value);
            const enabledEvents = recurringEvents.filter(e => e.enabled);
            if (enabledEvents.length === 0) return;

            // 2. Define Time Range (Start of Month to Now)
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const currentHours = today.getHours();
            const currentMinutes = today.getMinutes();

            // 3. Calculate Expected Attendance Events (Occurrences So Far)
            let expectedEventCount = 0;
            const eventTitles = new Set();

            // Loop through each day from start of month to today
            for (let d = new Date(startOfMonth); d <= today; d.setDate(d.getDate() + 1)) {
                const dayOfWeek = d.getDay();
                const isToday = d.toDateString() === today.toDateString();

                // Check matches for this day
                const daysEvents = enabledEvents.filter(e => e.dayOfWeek === dayOfWeek);

                for (const event of daysEvents) {
                    // If it's today, check if it has ended
                    if (isToday) {
                        const [endHour, endMinute] = event.endTime.split(':').map(Number);
                        if (currentHours < endHour || (currentHours === endHour && currentMinutes < endMinute)) {
                            continue; // Haven't finished yet, don't count as expected
                        }
                    }
                    expectedEventCount++;
                    eventTitles.add(event.title);
                }
            }

            if (expectedEventCount === 0) return; // No events yet this month, don't change status

            // 4. Get Attendance Stats for All Members
            // Get all members
            const { data: members } = await supabase.from('profiles').select('id, status');
            if (!members) return;

            // Get all 'Present' attendance for recurring events in this month
            const { data: attendance } = await supabase
                .from('attendance')
                .select('user_id')
                .eq('status', 'Present')
                .gte('date', startOfMonth.toISOString().split('T')[0])
                .lte('date', today.toISOString().split('T')[0])
                .in('event', Array.from(eventTitles));

            const attendanceMap = new Map(); // userId -> presentCount
            if (attendance) {
                attendance.forEach((rec: any) => {
                    const current = attendanceMap.get(rec.user_id) || 0;
                    attendanceMap.set(rec.user_id, current + 1);
                });
            }

            // 5. Update Status
            for (const member of members) {
                const presentCount = attendanceMap.get(member.id) || 0;
                let newStatus = member.status; // Default keep same

                // Apply Logic
                if (presentCount === expectedEventCount) {
                    newStatus = 'Active';
                } else if (presentCount === 0) {
                    newStatus = 'Inactive';
                } else {
                    newStatus = 'Semi Active';
                }

                // Only update if changed and not a special status (optional, but requested logic implies strict mapping)
                // Assuming we overwrite 'Active', 'Inactive', 'Semi Active'. 
                // We should probably respect 'Deceased' or 'Transferred' if they are manually set flags that shouldn't change?
                // For now, I'll update all to follow the rule: "No attendance for whole month = Inactive" etc.
                // But let's exclude 'Deceased' just in case.
                if (member.status === 'Deceased' || member.status === 'Transferred') continue;

                if (newStatus !== member.status) {
                    await supabase.from('profiles').update({ status: newStatus }).eq('id', member.id);
                }
            }
            console.log('Member status updates completed.');

        } catch (error) {
            console.error('Error processing member status:', error);
        }
    };

    // Fetch data
    const fetchAttendance = async () => {
        try {
            setLoading(true);

            // Build query
            // Join with profiles using user_id foreign key
            let query = supabase
                .from('attendance')
                .select(`
                    *,
                    profiles:user_id (*)
                `)
                .order('date', { ascending: false });

            if (selectedEvent !== 'All Events') {
                query = query.eq('event', selectedEvent);
            }

            if (selectedDate) {
                query = query.eq('date', selectedDate);
            }

            const { data, error } = await query;

            if (error) throw error;

            console.log('Attendance Records Fetched:', data);

            if (data) {
                const mappedData = data.map((record: any) => ({
                    ...record,
                    // Handle profiles being an object or array (Supabase returns object for many-to-one)
                    profiles: Array.isArray(record.profiles) ? record.profiles[0] : record.profiles,
                    cluster: (Array.isArray(record.profiles) ? record.profiles[0]?.cluster : record.profiles?.cluster) || 'Unassigned',
                }));
                setAttendanceRecords(mappedData);
            }
        } catch (error: any) {
            console.error('Error fetching attendance:', error);
            toast.error(error.message || 'Failed to load attendance records');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedEvent, selectedDate, isChecklistOpen, isAddModalOpen]);

    // Computed Logic for Pagination
    const filteredRecords = attendanceRecords.filter(item => {
        if (!item.profiles) return false;
        return item.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredRecords.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / 5) * 5;
        return new Array(Math.min(5, totalPages - start)).fill(0).map((_, idx) => start + idx + 1);
    };


    return (
        <div className="attendance-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h1>Attendance</h1>
                        <div className="tooltip-container" style={{ position: 'relative', display: 'flex' }}>
                            <div className="info-icon" style={{ cursor: 'help', color: '#9ca3af' }}>
                                <Info size={18} />
                            </div>
                            <div className="tooltip-bubble" style={{ minWidth: '320px', textAlign: 'left' }}>
                                <strong>Automation Active:</strong><br />
                                • Absences are auto-marked when recurring events end.<br />
                                • Member Status is auto-updated based on monthly attendance:<br />
                                &nbsp;&nbsp;- <span style={{ color: '#10b981' }}>Active:</span> Complete attendance<br />
                                &nbsp;&nbsp;- <span style={{ color: '#f59e0b' }}>Semi Active:</span> Partial attendance<br />
                                &nbsp;&nbsp;- <span style={{ color: '#ef4444' }}>Inactive:</span> No attendance
                            </div>
                        </div>
                    </div>
                </div>

                <div className="top-actions">
                    <button className="theme-toggle">
                        <Moon size={20} />
                    </button>

                    <UserProfile />
                </div>
            </header>

            <div className="attendance-container">
                {/* Actions & Filters */}
                <div className="header-actions" style={{ justifyContent: 'flex-end', marginBottom: '-0.5rem', gap: '0.75rem' }}>
                    <button className="export-btn">
                        <Download size={16} />
                        Export CSV
                    </button>
                    <button className="checklist-btn" onClick={() => setIsChecklistOpen(true)} style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', color: '#374151', padding: '0.65rem 1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckSquare size={16} />
                        Checklist
                    </button>
                    <button className="take-attendance-btn" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={16} />
                        Take Attendance
                    </button>
                </div>

                <div className="attendance-table-card">
                    {/* Filter Row inside card like standard lists sometimes, or separate. Image shows controls above table. 
                        Wait, Image shows controls in a white bar. Let's put them in a container above table.
                    */}
                    <div className="attendance-filters" style={{ borderBottom: '1px solid #f3f4f6', borderRadius: '12px 12px 0 0' }}>
                        <div className="controls-row">
                            <div className="filter-search">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="filter-select-wrapper">
                                <select
                                    className="filter-select-input"
                                    value={selectedEvent}
                                    onChange={(e) => setSelectedEvent(e.target.value)}
                                >
                                    <option>All Events</option>
                                    {eventsList.map((event, index) => (
                                        <option key={index} value={event}>{event}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-date">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    placeholder="mm/dd/yyyy"
                                    className="filter-date-input"
                                    style={{ border: 'none', outline: 'none', background: 'transparent' }}
                                />
                            </div>

                            <button className="filter-icon-btn">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

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
                                const initials = getInitials(fullName);
                                const avatarColor = getAvatarColor(fullName);

                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="user-cell">
                                                <div className={`avatar - circle ${avatarColor}`}>
                                                    {item.profiles?.avatar_url ? (
                                                        <img src={item.profiles.avatar_url} alt={initials} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                                    ) : (
                                                        initials
                                                    )}
                                                </div>
                                                <span style={{ fontWeight: 600 }}>{fullName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status - pill ${item.status === 'Present' ? 'pill-present' : 'pill-absent'}`}>
                                                <span className={`status - dot ${item.status === 'Present' ? 'dot-present' : 'dot-absent'}`}></span>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{item.cluster}</td>
                                        <td>{item.event}</td>

                                    </tr>
                                );
                            })}
                            {attendanceRecords.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                                        No attendance records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div className="table-footer">
                        <div className="showing-text">
                            Showing {filteredRecords.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredRecords.length)} of {filteredRecords.length} entries
                        </div>

                        <div className="pagination-controls">
                            <div className="per-page">
                                <span>Per Page</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="page-numbers">
                                <button
                                    className="page-nav-btn"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {getPaginationGroup().map((item, index) => (
                                    <button
                                        key={index}
                                        className={`page-num ${currentPage === item ? 'active' : ''}`}
                                        onClick={() => handlePageChange(item)}
                                    >
                                        {item}
                                    </button>
                                ))}

                                {totalPages > 5 && (Math.floor((currentPage - 1) / 5) * 5) + 5 < totalPages && (
                                    <span style={{ padding: '0 0.25rem', display: 'flex', alignItems: 'center', color: '#9ca3af' }}>...</span>
                                )}

                                <button
                                    className="page-nav-btn"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Footer */}
                    <div className="attendance-summary">
                        <div className="summary-item">
                            <span className="summary-dot dot-present"></span>
                            <span>Present ({attendanceRecords.filter(r => r.status === 'Present').length})</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-dot dot-absent"></span>
                            <span>Absent ({attendanceRecords.filter(r => r.status === 'Absent').length})</span>
                        </div>
                    </div>
                </div>
            </div>
            <TakeAttendanceModal isOpen={isTakeAttendanceOpen} onClose={() => setIsTakeAttendanceOpen(false)} />
            <AttendanceChecklistModal isOpen={isChecklistOpen} onClose={() => setIsChecklistOpen(false)} />
            <AddAttendanceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
        </div >
    );
};
