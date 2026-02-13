import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { initializeRecurringEvents } from '../../utils/initializeRecurringEvents';
import './TakeAttendanceModal.css';

interface TakeAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({ isOpen, onClose }) => {
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [availableEvents, setAvailableEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [memberName, setMemberName] = useState('');
    const [status, setStatus] = useState('Present');
    const [mode, setMode] = useState('Onsite');
    const [cluster, setCluster] = useState('');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        console.log('TakeAttendanceModal useEffect triggered - isOpen:', isOpen, 'selectedDate:', selectedDate);
        if (isOpen) {
            console.log('Modal is open, initializing recurring events...');
            // Initialize recurring events if they don't exist
            initializeRecurringEvents()
                .then(() => {
                    console.log('Initialization complete, now fetching events...');
                    fetchEventsForDate(selectedDate);
                })
                .catch(err => {
                    console.error('Initialization failed:', err);
                    // Try to fetch anyway
                    fetchEventsForDate(selectedDate);
                });
        }
    }, [selectedDate, isOpen]);

    // Reset form when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            setMemberName('');
            setStatus('Present');
            setMode('Onsite');
            setCluster('');
            setSelectedEvent('');
            setAvailableEvents([]);
            setSelectedDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    const fetchEventsForDate = async (date: string) => {
        try {
            console.log('Fetching events for date:', date);

            // Fetch approved reservations
            const { data: reservationsData, error: reservationsError } = await supabase
                .from('reservations')
                .select('event_title')
                .eq('status', 'APPROVED')
                .eq('event_date', date);

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

                const selectedDateObj = new Date(date + 'T00:00:00');
                const dayOfWeek = selectedDateObj.getDay();
                console.log(`Selected date: ${date}, Day of week: ${dayOfWeek} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]})`);

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
            setAvailableEvents(allEvents);

            // Auto-select first event if available
            if (allEvents.length > 0) {
                setSelectedEvent(allEvents[0].event_title);
            } else {
                setSelectedEvent('');
            }
        } catch (error: any) {
            console.error('Error fetching events:', error);
            toast.error(error.message || 'Failed to fetch events');
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!memberName.trim()) {
            toast.error('Please enter member name');
            return;
        }
        if (!selectedEvent) {
            toast.error('Please select an event');
            return;
        }
        if (!cluster) {
            toast.error('Please select a cluster');
            return;
        }

        try {
            setLoading(true);

            // Find user by name
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .ilike('full_name', memberName.trim())
                .limit(1);

            if (profileError) throw profileError;

            if (!profiles || profiles.length === 0) {
                toast.error('Member not found. Please check the name.');
                return;
            }

            const userId = profiles[0].id;

            // Insert attendance record
            const { error: insertError } = await supabase
                .from('attendance')
                .upsert({
                    user_id: userId,
                    date: selectedDate,
                    event: selectedEvent,
                    status: status,
                    remarks: `Mode: ${mode}`
                }, {
                    onConflict: 'user_id,date,event'
                });

            if (insertError) throw insertError;

            toast.success('Attendance record added successfully');
            onClose();
        } catch (error: any) {
            console.error('Error saving attendance:', error);
            toast.error(error.message || 'Failed to save attendance');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Handle outside click to close
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Add Attendance Record</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Date */}
                    <div className="form-group">
                        <label>Date <span className="required">*</span></label>
                        <div className="date-input-container">
                            <input
                                type="date"
                                className="form-input"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Event */}
                    <div className="form-group">
                        <label>Event <span className="required">*</span></label>
                        <select
                            className="form-input"
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            disabled={availableEvents.length === 0}
                        >
                            {availableEvents.length > 0 ? (
                                availableEvents.map((event, index) => (
                                    <option key={index} value={event.event_title}>
                                        {event.event_title}
                                    </option>
                                ))
                            ) : (
                                <option value="">No events for this date</option>
                            )}
                        </select>
                        {availableEvents.length === 0 && (
                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                💡 No events for this date. Try selecting a Sunday, Monday, or Friday for recurring events.
                            </p>
                        )}
                    </div>

                    {/* Member Name */}
                    <div className="form-group">
                        <label>Member Name <span className="required">*</span></label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter member name"
                            value={memberName}
                            onChange={(e) => setMemberName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Status & Mode Row */}
                    <div className="form-row">
                        <div className="col-half">
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
                        </div>
                        <div className="col-half">
                            <div className="form-group">
                                <label>Mode <span className="required">*</span></label>
                                <select
                                    className="form-input"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                >
                                    <option value="Onsite">Onsite</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Cluster */}
                    <div className="form-group">
                        <label>Cluster <span className="required">*</span></label>
                        <select
                            className="form-input"
                            value={cluster}
                            onChange={(e) => setCluster(e.target.value)}
                        >
                            <option value="" disabled>Select a cluster</option>
                            <option value="Cluster A">Cluster A</option>
                            <option value="Cluster B">Cluster B</option>
                            <option value="Cluster C">Cluster C</option>
                        </select>
                    </div>

                    <div className="modal-footer" style={{ padding: '0', marginTop: '1.5rem' }}>
                        <button className="cancel-btn" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Saving...' : 'Add Record'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
