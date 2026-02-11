import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './AddAttendanceModal.css';

interface AddAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Member {
    id: string;
    full_name: string;
}

export const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ isOpen, onClose }) => {
    // Form State
    const [memberId, setMemberId] = useState('');
    const [status, setStatus] = useState('Present');
    const [mode, setMode] = useState('Onsite'); // Assuming 'mode' isn't in DB schema yet, we might need to add it or store in remarks? 
    // The previous modal didn't have 'mode'. Let's check the schema implied by previous turn.
    // The user didn't mention 'mode' column. I'll store it in remarks for now if needed, or omit if not supported.
    // Actually, let's keep it in UI state but maybe append to remarks if no column.

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

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
            fetchApprovedEvents(date);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            fetchApprovedEvents(date);
        }
    }, [date]);

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
            const { data, error } = await supabase
                .from('reservations')
                .select('event_title')
                .eq('status', 'APPROVED')
                .eq('event_date', selectedDate);

            if (error) throw error;

            if (data && data.length > 0) {
                setApprovedEvents(data);
                setSelectedEvent(data[0].event_title);
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
                .insert({
                    user_id: memberId,
                    date: date,
                    event: selectedEvent,
                    status: status,
                    remarks: mode // Storing mode in remarks
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
                            <select
                                className="form-input"
                                value={memberId}
                                onChange={(e) => setMemberId(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a member</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.full_name}</option>
                                ))}
                            </select>
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
                                    onChange={(e) => setMode(e.target.value)}
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
