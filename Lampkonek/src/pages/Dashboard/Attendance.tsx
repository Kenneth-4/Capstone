import {
    Download,
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Moon,
    CheckSquare,
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
    member_id: string;
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

    // State for data
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('All Events');
    const [selectedDate, setSelectedDate] = useState(''); // Empty means all dates or let's default to today maybe? No, "All" is better for list view.
    const [eventsList, setEventsList] = useState<string[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await supabase
                    .from('reservations')
                    .select('event_title') // Get distinct event titles if possible. Supabase plain select doesn't do distinct easily without .rpc or client side.
                    .eq('status', 'APPROVED');

                if (data) {
                    // Extract unique titles client-side
                    const titles = Array.from(new Set(data.map((item: any) => item.event_title)));
                    setEventsList(titles);
                }
            } catch (error) {
                console.error('Error fetching event filters:', error);
            }
        };
        fetchEvents();
    }, []);

    // Fetch data
    const fetchAttendance = async () => {
        try {
            setLoading(true);

            // Build query
            // Attempt standard join. If your FK is named differently, this might need adjustment.
            let query = supabase
                .from('attendance')
                .select(`
                    *,
                    profiles:member_id (*)
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
    }, [selectedEvent, selectedDate, isChecklistOpen, isAddModalOpen]); // Refresh when modals close or filters change


    return (
        <div className="attendance-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Attendance</h1>

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
                                <th style={{ textAlign: 'right' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords
                                .filter(item => {
                                    if (!item.profiles) return false;
                                    return item.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase());
                                })
                                .map((item) => {
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
                                            <td style={{ textAlign: 'right' }}>
                                                <button className="action-btn">
                                                    <Edit2 size={16} />
                                                </button>
                                            </td>
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
                        <div className="showing-text">Showing 1 to 5 of 48 entries</div>

                        <div className="pagination-controls">
                            <div className="per-page">
                                <span>Per Page</span>
                                <select>
                                    <option>10</option>
                                    <option>20</option>
                                </select>
                            </div>

                            <div className="page-numbers">
                                <button className="page-nav-btn"><ChevronLeft size={16} /></button>
                                <button className="page-num active">1</button>
                                <button className="page-num">2</button>
                                <button className="page-num">3</button>
                                <span style={{ padding: '0 0.25rem', display: 'flex', alignItems: 'center', color: '#9ca3af' }}>...</span>
                                <button className="page-num">10</button>
                                <button className="page-nav-btn"><ChevronRight size={16} /></button>
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
