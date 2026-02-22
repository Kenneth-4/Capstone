import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { initializeRecurringEvents } from '../../utils/initializeRecurringEvents';
import './AddAttendanceModal.css';

interface AddAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'Onsite' | 'Online';
}

interface Member {
    id: string;
    full_name: string;
}

export const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ isOpen, onClose, initialMode = 'Onsite' }) => {
    // Form State
    const [memberId, setMemberId] = useState('');
    const [status, setStatus] = useState('Present');
    const [mode, setMode] = useState(initialMode);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);    // The previous modal didn't have 'mode'. Let's check the schema implied by previous turn.
    // The user didn't mention 'mode' column. I'll store it in remarks for now if needed, or omit if not supported.
    // Search/Dropdown State
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    const [date, setDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [selectedEvent, setSelectedEvent] = useState('');

    // Data State
    const [members, setMembers] = useState<Member[]>([]);
    const [approvedEvents, setApprovedEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(window.innerWidth <= 768 ? 10 : 20);

    const handleShowMore = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent closing dropdown
        setVisibleCount(prev => prev * 2);
    };

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
            // Initialize recurring events if they don't exist
            initializeRecurringEvents().then(() => {
                fetchApprovedEvents(date);
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            // Initialize recurring events if they don't exist
            initializeRecurringEvents().then(() => {
                fetchApprovedEvents(date);
            });
        }
    }, [date]);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredMembers = members.filter(member =>
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedMembers = filteredMembers.slice(0, visibleCount);

    const handleMemberSelect = (member: Member) => {
        setMemberId(member.id);
        setSearchTerm(member.full_name);
        setIsDropdownOpen(false);
    };

    const fetchMembers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name')
                .order('full_name');

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching members:', error);
            // toast.error('Failed to load members');
        }
    };

    const fetchApprovedEvents = async (selectedDate: string) => {
        try {
            console.log('Fetching events for date:', selectedDate);

            // Fetch approved reservations
            const { data: reservationsData, error: reservationsError } = await supabase
                .from('reservations')
                .select('event_title')
                .eq('status', 'APPROVED')
                .eq('event_date', selectedDate);

            if (reservationsError) throw reservationsError;

            // Fetch recurring events
            const { data: settingsData } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'recurring_events')
                .single();

            let allEvents: any[] = reservationsData || [];
            console.log('Reservations:', reservationsData);

            // Add recurring events that match this day of week
            if (settingsData?.value) {
                const recurringEvents: any[] = JSON.parse(settingsData.value);
                console.log('All recurring events from DB:', recurringEvents);

                const selectedDateObj = new Date(selectedDate + 'T00:00:00');
                const dayOfWeek = selectedDateObj.getDay();
                console.log(`Selected date: ${selectedDate}, Day of week: ${dayOfWeek} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]})`);

                const matchingRecurringEvents = recurringEvents
                    .filter(e => {
                        const matches = e.enabled && e.dayOfWeek === dayOfWeek;
                        console.log(`  - ${e.title}: enabled=${e.enabled}, dayOfWeek=${e.dayOfWeek}, matches=${matches}`);
                        return matches;
                    })
                    .map(e => ({ event_title: e.title }));

                console.log('Matching recurring events:', matchingRecurringEvents);
                allEvents = [...allEvents, ...matchingRecurringEvents];
            } else {
                console.log('No recurring events settings in database');
            }

            console.log('Final all events:', allEvents);

            if (allEvents.length > 0) {
                setApprovedEvents(allEvents);
                setSelectedEvent(allEvents[0].event_title);
            } else {
                setApprovedEvents([]);
                setSelectedEvent('');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!memberId || !selectedEvent || !date) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase
                .from('attendance')
                .upsert({
                    user_id: memberId,
                    date: date,
                    event: selectedEvent,
                    status: status,
                    remarks: mode // Storing mode in remarks
                }, {
                    onConflict: 'user_id,date,event'
                });

            if (error) throw error;

            toast.success('Attendance record added!');
            onClose();
        } catch (error: any) {
            console.error('Error saving attendance:', error);
            toast.error(error.message || 'Failed to save record');
        } finally {
            setLoading(false);
        }
    };
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-container attendance-modal">
                <div className="modal-header">
                    <h2>Add Attendance Record</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Member Name <span className="required">*</span></label>
                            <div className="autocomplete-container" ref={dropdownRef}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Search member..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setIsDropdownOpen(true);
                                        setMemberId(''); // Clear selection when typing
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    required
                                />
                                {isDropdownOpen && (
                                    <div className="autocomplete-dropdown">
                                        {displayedMembers.length > 0 ? (
                                            <>
                                                {displayedMembers.map(member => (
                                                    <div
                                                        key={member.id}
                                                        className="autocomplete-item"
                                                        onClick={() => handleMemberSelect(member)}
                                                    >
                                                        {member.full_name}
                                                    </div>
                                                ))}
                                                {filteredMembers.length > visibleCount && (
                                                    <div
                                                        className="autocomplete-show-more"
                                                        onClick={handleShowMore}
                                                        style={{
                                                            padding: '0.75rem',
                                                            textAlign: 'center',
                                                            color: '#6366f1',
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600,
                                                            cursor: 'pointer',
                                                            borderTop: '1px solid #f3f4f6',
                                                            backgroundColor: '#f9fafb'
                                                        }}
                                                    >
                                                        Show More ({filteredMembers.length - visibleCount} remaining)
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="no-results">No members found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-row-split">
                            <div className="form-group">
                                <label>Status <span className="required">*</span></label>
                                <select
                                    className="form-input"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                    <option value="Late">Late</option>
                                    <option value="Excused">Excused</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Mode <span className="required">*</span></label>
                                <select
                                    className="form-input"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value as 'Onsite' | 'Online')}
                                >
                                    <option value="Onsite">Onsite</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Event <span className="required">*</span></label>
                            <select
                                className="form-input"
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                disabled={approvedEvents.length === 0}
                                required
                            >
                                {approvedEvents.length > 0 ? (
                                    approvedEvents.map((event, index) => (
                                        <option key={index} value={event.event_title}>
                                            {event.event_title}
                                        </option>
                                    ))
                                ) : (
                                    <option value="">No approved events for this date</option>
                                )}
                            </select>
                        </div>

                        {/* Cluster is derived from member profile, no need to ask */}

                        <div className="form-group">
                            <label>Date <span className="required">*</span></label>
                            <input
                                type="date"
                                className="form-input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="modal-footer-simple">
                            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
                            <button type="submit" className="btn-submit" disabled={loading || approvedEvents.length === 0}>
                                {loading ? 'Adding...' : 'Add Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
