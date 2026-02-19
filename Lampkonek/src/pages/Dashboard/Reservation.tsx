import { useState, useEffect } from 'react';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Users,
    GraduationCap,
    PartyPopper,
    Clock,
    MapPin,
    User as UserIcon,
    X,
    Repeat,
    Edit2,
    Trash2
} from 'lucide-react';
import './Reservation.css';
import { NewReservationModal } from './NewReservationModal';
import { RecurringEventsModal } from './RecurringEventsModal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Reservation {
    id: string;
    event_title: string;
    event_date: string;
    start_time: string;
    end_time: string;
    venue: string;
    organizer_name: string;
    status: string;
    purpose: string;
    expected_attendees: number;
    setup_required?: string;
    equipment_needed?: string[];
    additional_notes?: string;
    isRecurring?: boolean; // Added for display handling
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

// Icon mapping for different event types
const getIconForEvent = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('youth') || lowerTitle.includes('yp')) return Users;
    if (lowerTitle.includes('seminar') || lowerTitle.includes('training')) return GraduationCap;
    if (lowerTitle.includes('party') || lowerTitle.includes('celebration') || lowerTitle.includes('culminating')) return PartyPopper;
    return CalendarIcon;
};

// Simple Calendar Grid Mock
const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export const Reservation = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
    const [recurringEvents, setRecurringEvents] = useState<RecurringEventConfig[]>([]);

    // Calendar state
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    useEffect(() => {
        fetchReservations();
        fetchRecurringSettings();
    }, []);

    const fetchRecurringSettings = async () => {
        try {
            const { data } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'recurring_events')
                .single();

            if (data && data.value) {
                setRecurringEvents(JSON.parse(data.value));
            } else {
                // Defaults matching modal defaults to ensure they show up even if not saved yet
                setRecurringEvents([
                    { key: 'sunday_service', title: 'Sunday Service', dayOfWeek: 0, time: '09:00', endTime: '11:00', enabled: true, venue: 'Main Sanctuary' },
                    { key: 'prayer_meeting', title: 'Prayer Meeting', dayOfWeek: 1, time: '19:00', endTime: '20:30', enabled: true, venue: 'Prayer Room' },
                    { key: 'bible_study', title: 'Bible Study', dayOfWeek: 5, time: '18:00', endTime: '19:30', enabled: true, venue: 'Community Hall' },
                ]);
            }
        } catch (error) {
            console.error('Error fetching recurring settings:', error);
        }
    };

    const fetchReservations = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('reservations')
                .select('*')
                .order('event_date', { ascending: true })
                .order('start_time', { ascending: true });

            if (error) throw error;

            setReservations(data || []);
        } catch (error: any) {
            console.error('Error fetching reservations:', error);
            toast.error('Failed to load reservations');
        } finally {
            setIsLoading(false);
        }
    };

    // Calendar functions
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday=0 to Monday=0
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
        setSelectedDate(null);
    };

    // Generate instances of recurring events for a specific date
    const getRecurringInstancesForDate = (date: number) => {
        const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
        const dayOfWeek = targetDate.getDay();
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;

        return recurringEvents
            .filter(event => event.enabled && event.dayOfWeek === dayOfWeek)
            .map(event => ({
                id: `recurring-${event.key}-${dateStr}`,
                event_title: event.title,
                event_date: dateStr,
                start_time: event.time,
                end_time: event.endTime,
                venue: event.venue,
                organizer_name: 'Church',
                status: 'APPROVED',
                purpose: 'Automatic Recurring Event',
                expected_attendees: 0,
                isRecurring: true
            } as Reservation));
    };

    const getReservationsForDate = (date: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
        const manual = reservations.filter(res => res.event_date === dateStr);
        const recurring = getRecurringInstancesForDate(date);
        return [...manual, ...recurring];
    };

    const hasReservationOnDate = (date: number) => {
        return getReservationsForDate(date).length > 0;
    };

    // Calculate all reservations including recurring for the current view and future (simplified for upcoming list)
    // Note: This logic for 'upcoming' needs to generate recurring events for the next few dates/weeks.
    // For simplicity, we'll generate recurring events for the next 30 days and add them to the list.



    // Generate calendar dates
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOffset = getFirstDayOfMonth(currentDate);
    const calendarDates = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptySlots = Array.from({ length: firstDayOffset }, (_, i) => i);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // Handle reservation status update
    const handleStatusUpdate = async (status: 'APPROVED' | 'REJECTED') => {
        if (!selectedReservation) return;

        const confirmMessage = status === 'APPROVED'
            ? `Approve reservation for "${selectedReservation.event_title}"?`
            : `Reject reservation for "${selectedReservation.event_title}"?`;

        if (!window.confirm(confirmMessage)) return;

        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('reservations')
                .update({ status })
                .eq('id', selectedReservation.id);

            if (error) throw error;

            toast.success(`Reservation ${status.toLowerCase()} successfully!`);
            setIsDetailsModalOpen(false);
            setSelectedReservation(null);
            fetchReservations();
        } catch (error: any) {
            console.error('Error updating reservation:', error);
            toast.error(error.message || 'Failed to update reservation');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReservationClick = (reservation: Reservation) => {
        setSelectedReservation(reservation);
        setIsDetailsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedReservation || selectedReservation.isRecurring) return;

        const confirmMessage = `Are you sure you want to delete the reservation for "${selectedReservation.event_title}"? This action cannot be undone.`;

        if (!window.confirm(confirmMessage)) return;

        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('reservations')
                .delete()
                .eq('id', selectedReservation.id);

            if (error) throw error;

            toast.success('Reservation deleted successfully!');
            setIsDetailsModalOpen(false);
            setSelectedReservation(null);
            fetchReservations();
        } catch (error: any) {
            console.error('Error deleting reservation:', error);
            toast.error(error.message || 'Failed to delete reservation');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleEdit = () => {
        if (!selectedReservation || selectedReservation.isRecurring) return;

        // Close the details modal and open the edit modal
        // We'll need to pass the reservation data to NewReservationModal
        setIsDetailsModalOpen(false);
        setIsModalOpen(true);
    };

    // Filter reservations based on search


    // Calculate stats
    const stats = {
        total: reservations.length,
        approved: reservations.filter(r => r.status === 'APPROVED').length,
        pending: reservations.filter(r => r.status === 'PENDING').length,
        rejected: reservations.filter(r => r.status === 'REJECTED').length
    };

    // Get upcoming reservations (future dates only)
    const today = new Date().toISOString().split('T')[0];
    // Removed generating recurring events for the list to satisfy user request

    // Filter standard reservations based on search query
    const filteredReservations = reservations.filter(res =>
        res.event_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.venue.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const upcomingReservations = filteredReservations
        .filter(res => res.event_date >= today)
        .sort((a, b) => {
            if (a.event_date !== b.event_date) return a.event_date.localeCompare(b.event_date);
            return a.start_time.localeCompare(b.start_time);
        });

    return (
        <div className="reservation-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Reservation</h1>
                </div>
            </header>

            <div className="reservation-container">
                {/* Controls */}
                <div className="reservation-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        type="text"
                        className="res-search-input"
                        placeholder="Search by ID or Type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button
                        className="add-res-btn"
                        onClick={() => setIsRecurringModalOpen(true)}
                        style={{ backgroundColor: 'white', color: '#374151', border: '1px solid #e5e7eb' }}
                    >
                        <Repeat size={18} />
                        Auto Events
                    </button>
                    <button className="add-res-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        Add Reservation
                    </button>
                </div>

                {/* Stats */}
                <div className="res-stats-grid">
                    <div className="res-stat-card">
                        <span className="res-stat-title">Total Reservation</span>
                        <span className="res-stat-value">{stats.total}</span>
                    </div>
                    <div className="res-stat-card">
                        <span className="res-stat-title">Approved</span>
                        <span className="res-stat-value">{stats.approved}</span>
                    </div>
                    <div className="res-stat-card">
                        <span className="res-stat-title">Pending</span>
                        <span className="res-stat-value">{stats.pending}</span>
                    </div>
                    <div className="res-stat-card">
                        <span className="res-stat-title">Rejected</span>
                        <span className="res-stat-value">{stats.rejected}</span>
                    </div>
                </div>

                {/* Main Content: Calendar + List */}
                <div className="res-main-layout">
                    {/* Left: Calendar */}
                    <div className="calendar-card">
                        <div className="calendar-header">
                            <h3 className="calendar-title">View Calendar</h3>
                        </div>

                        <div className="calendar-header" style={{ marginBottom: '1rem' }}>
                            <span className="calendar-nav-title">{currentMonthYear}</span>
                            <div className="calendar-nav-btns">
                                <button className="c-nav-btn" onClick={() => navigateMonth('prev')}>
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="c-nav-btn" onClick={() => navigateMonth('next')}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="calendar-grid">
                            {days.map(day => (
                                <div key={day} className="c-day-label">{day}</div>
                            ))}
                            {emptySlots.map(slot => (
                                <div key={`empty-${slot}`} className="c-date empty"></div>
                            ))}
                            {calendarDates.map(date => {
                                const hasReservation = hasReservationOnDate(date);
                                const isSelected = selectedDate === date;
                                const isToday = new Date().getDate() === date &&
                                    new Date().getMonth() === currentDate.getMonth() &&
                                    new Date().getFullYear() === currentDate.getFullYear();

                                return (
                                    <div
                                        key={date}
                                        className={`c-date ${isSelected ? 'active' : ''} ${isToday ? 'today' : ''} ${hasReservation ? 'has-event' : ''}`}
                                        onClick={() => setSelectedDate(date)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {date}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Upcoming List */}
                    <div className="upcoming-section">
                        <h3 className="section-title">Upcoming Reservations</h3>

                        <div className="res-list">
                            {isLoading ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                    Loading reservations...
                                </div>
                            ) : upcomingReservations.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                    {searchQuery ? 'No reservations found matching your search' : 'No upcoming reservations'}
                                </div>
                            ) : (
                                upcomingReservations.map(res => {
                                    const Icon = getIconForEvent(res.event_title);
                                    const iconClass = res.status === 'APPROVED' ? 'icon-green' :
                                        res.status === 'PENDING' ? 'icon-orange' : 'icon-red';

                                    // Format time from 24h to 12h
                                    const formatTime = (time: string) => {
                                        const [hours, minutes] = time.split(':');
                                        const hour = parseInt(hours);
                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                        const displayHour = hour % 12 || 12;
                                        return `${displayHour}:${minutes} ${ampm}`;
                                    };

                                    return (
                                        <div
                                            key={res.id}
                                            className="res-card"
                                            onClick={() => handleReservationClick(res)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div className={`res-icon-box ${iconClass}`}>
                                                <Icon size={24} />
                                            </div>
                                            <div className="res-details">
                                                <span className="res-name">{res.event_title}</span>
                                                <div className="res-meta">
                                                    <div className="res-meta-item">
                                                        <Clock size={14} />
                                                        <span>{res.event_date} • {formatTime(res.start_time)}</span>
                                                    </div>
                                                    <div className="res-meta-item">
                                                        <MapPin size={14} />
                                                        <span>{res.venue}</span>
                                                    </div>
                                                    <div className="res-meta-item">
                                                        <UserIcon size={14} />
                                                        <span>{res.organizer_name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`res-badge ${res.status === 'APPROVED' ? 'badge-approved' :
                                                res.status === 'PENDING' ? 'badge-pending' : 'badge-rejected'
                                                }`}>
                                                {res.status}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <NewReservationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedReservation(null);
                }}
                onSuccess={fetchReservations}
                editReservation={selectedReservation}
            />

            <RecurringEventsModal
                isOpen={isRecurringModalOpen}
                onClose={() => setIsRecurringModalOpen(false)}
                onUpdate={fetchRecurringSettings}
            />

            {/* Reservation Details Modal */}
            {isDetailsModalOpen && selectedReservation && (
                <div className="modal-backdrop" onClick={() => setIsDetailsModalOpen(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2>Reservation Details</h2>
                            <button className="close-btn" onClick={() => setIsDetailsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="modal-body" style={{ padding: '1.5rem' }}>
                            {/* Event Title */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
                                    {selectedReservation.event_title}
                                </h3>
                                <span className={`res-badge ${selectedReservation.status === 'APPROVED' ? 'badge-approved' :
                                    selectedReservation.status === 'PENDING' ? 'badge-pending' : 'badge-rejected'
                                    }`}>
                                    {selectedReservation.status}
                                </span>
                            </div>

                            {/* Details Grid */}
                            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>
                                        Venue
                                    </label>
                                    <p style={{ fontSize: '1rem', color: '#1f2937' }}>{selectedReservation.venue}</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>
                                            Date
                                        </label>
                                        <p style={{ fontSize: '1rem', color: '#1f2937' }}>{selectedReservation.event_date}</p>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>
                                            Time
                                        </label>
                                        <p style={{ fontSize: '1rem', color: '#1f2937' }}>
                                            {selectedReservation.start_time} - {selectedReservation.end_time}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>
                                        Organizer
                                    </label>
                                    <p style={{ fontSize: '1rem', color: '#1f2937' }}>{selectedReservation.organizer_name}</p>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>
                                        Expected Attendees
                                    </label>
                                    <p style={{ fontSize: '1rem', color: '#1f2937' }}>{selectedReservation.expected_attendees}</p>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>
                                        Purpose
                                    </label>
                                    <p style={{ fontSize: '1rem', color: '#1f2937', whiteSpace: 'pre-wrap' }}>{selectedReservation.purpose}</p>
                                </div>

                                {selectedReservation.setup_required && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>
                                            Setup Required
                                        </label>
                                        <p style={{ fontSize: '1rem', color: '#1f2937' }}>{selectedReservation.setup_required}</p>
                                    </div>
                                )}

                                {selectedReservation.equipment_needed && selectedReservation.equipment_needed.length > 0 && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>
                                            Equipment Needed
                                        </label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            {selectedReservation.equipment_needed.map((equip, idx) => (
                                                <span
                                                    key={idx}
                                                    style={{
                                                        padding: '0.25rem 0.75rem',
                                                        backgroundColor: '#e0e7ff',
                                                        color: '#4338ca',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {equip}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedReservation.additional_notes && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', marginBottom: '0.25rem' }}>
                                            Additional Notes
                                        </label>
                                        <p style={{ fontSize: '1rem', color: '#1f2937', whiteSpace: 'pre-wrap' }}>{selectedReservation.additional_notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb', flexWrap: 'wrap' }}>
                                {/* Delete Button - Available for all non-recurring reservations */}
                                {!selectedReservation.isRecurring && (
                                    <button
                                        onClick={handleDelete}
                                        disabled={isUpdating}
                                        title="Delete reservation"
                                        style={{
                                            padding: '0.75rem',
                                            backgroundColor: '#dc2626',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                                            opacity: isUpdating ? 0.6 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}

                                {/* Edit Button - Only for PENDING reservations */}
                                {selectedReservation.status === 'PENDING' && !selectedReservation.isRecurring && (
                                    <button
                                        onClick={handleEdit}
                                        disabled={isUpdating}
                                        title="Edit reservation"
                                        style={{
                                            padding: '0.75rem',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '0.5rem',
                                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                                            opacity: isUpdating ? 0.6 : 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                )}

                                {/* Approve/Reject Buttons - Only for PENDING status */}
                                {selectedReservation.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate('REJECTED')}
                                            disabled={isUpdating}
                                            style={{
                                                flex: '1 1 auto',
                                                padding: '0.75rem 1.5rem',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                                opacity: isUpdating ? 0.6 : 1
                                            }}
                                        >
                                            {isUpdating ? 'Updating...' : 'Reject'}
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate('APPROVED')}
                                            disabled={isUpdating}
                                            style={{
                                                flex: '1 1 auto',
                                                padding: '0.75rem 1.5rem',
                                                backgroundColor: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                cursor: isUpdating ? 'not-allowed' : 'pointer',
                                                opacity: isUpdating ? 0.6 : 1
                                            }}
                                        >
                                            {isUpdating ? 'Updating...' : 'Approve'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
