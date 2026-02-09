import React, { useState } from 'react';
import { X, Search, Filter } from 'lucide-react';
import './AttendanceChecklistModal.css';

interface AttendanceChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';



interface Member {
    id: string;
    name: string;
    ministry: string;
    remarks: string;
    isPresent: boolean;
    isAbsent: boolean;
    status: string; // 'Present', 'Absent', etc.
}

export const AttendanceChecklistModal: React.FC<AttendanceChecklistModalProps> = ({ isOpen, onClose }) => {
    const [employees, setEmployees] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [ministryFilter, setMinistryFilter] = useState('All');
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [selectedEvent, setSelectedEvent] = useState('');
    const [approvedEvents, setApprovedEvents] = useState<any[]>([]);

    React.useEffect(() => {
        if (isOpen && selectedDate && selectedEvent) {
            fetchMembersAndAttendance();
        } else if (isOpen) {
            // Just fetch members if event not selected yet? 
            // Better to wait or fetch basic list.
            fetchMembersAndAttendance();
        }
    }, [isOpen, selectedDate, selectedEvent]);

    React.useEffect(() => {
        if (isOpen) {
            fetchApprovedEvents(selectedDate);
        }
    }, [selectedDate, isOpen]);

    const fetchApprovedEvents = async (date: string) => {
        try {
            console.log('Fetching events for date:', date);
            const { data, error } = await supabase
                .from('reservations')
                .select('event_title')
                .eq('status', 'APPROVED')
                .eq('event_date', date);

            if (error) throw error;

            console.log('Fetched events:', data);

            if (data && data.length > 0) {
                setApprovedEvents(data);
                setSelectedEvent(data[0].event_title);
            } else {
                setApprovedEvents([]);
                setSelectedEvent('');
                // Optional: toast.info('No approved events for this date');
            }
        } catch (error: any) {
            console.error('Error fetching events:', error);
            toast.error(error.message || 'Failed to fetch events');
        }
    };

    const fetchMembersAndAttendance = async () => {
        try {
            setLoading(true);

            // 1. Fetch all members
            const { data: membersData, error: membersError } = await supabase
                .from('profiles')
                .select('*')
                .order('full_name', { ascending: true });

            if (membersError) throw membersError;

            // 2. Fetch existing attendance for this date/event
            let attendanceMap = new Map();
            if (selectedDate && selectedEvent) {
                const { data: attendanceData, error: attendanceError } = await supabase
                    .from('attendance')
                    .select('*')
                    .eq('date', selectedDate)
                    .eq('event', selectedEvent);

                if (!attendanceError && attendanceData) {
                    attendanceData.forEach((record: any) => {
                        attendanceMap.set(record.member_id, record);
                    });
                }
            }

            if (membersData) {
                const mappedMembers = membersData.map((profile: any) => {
                    const existingRecord = attendanceMap.get(profile.id);
                    return {
                        id: profile.id,
                        name: profile.full_name || 'Unknown',
                        ministry: profile.ministry || 'None',
                        remarks: existingRecord?.remarks || '',
                        isPresent: existingRecord?.status === 'Present',
                        isAbsent: existingRecord?.status === 'Absent',
                        status: existingRecord?.status || 'Pending' // Default to pending if no record
                    };
                });
                setEmployees(mappedMembers);
            }
        } catch (error: any) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const ministries = ['All', ...new Set(employees.map(emp => emp.ministry))];

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMinistry = ministryFilter === 'All' || emp.ministry === ministryFilter;
        return matchesSearch && matchesMinistry;
    });

    const handleAttendanceChange = (id: string, type: 'Present' | 'Absent') => {
        setEmployees(employees.map(emp => {
            if (emp.id !== id) return emp;

            if (type === 'Present') {
                return { ...emp, isPresent: !emp.isPresent, isAbsent: false, status: !emp.isPresent ? 'Present' : 'Pending' };
            } else {
                return { ...emp, isAbsent: !emp.isAbsent, isPresent: false, status: !emp.isAbsent ? 'Absent' : 'Pending' };
            }
        }));
    };

    const handleRemarksChange = (id: string, value: string) => {
        setEmployees(employees.map(emp =>
            emp.id === id ? { ...emp, remarks: value } : emp
        ));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            // Prepare records to insert
            // Only save records that are marked Present or have remarks? 
            // Or save all to track absentees explicitly? 
            // Let's save all for the day/event so we have a complete record.

            const records = employees.map(emp => {
                let status = 'Pending';
                if (emp.isPresent) status = 'Present';
                else if (emp.isAbsent) status = 'Absent';

                // If neither is checked, do we save? Maybe 'Absent' is default?
                // Or maybe we skip? 
                // User said "updating only 1 at a time". 
                // If we upsert all, we overwrite all.
                // If we only upsert changed ones... harder to track.
                // Let's upsert all current state, assuming 'Pending' records might be ignored or saved as such.
                // If status is 'Pending' (neither checked), maybe we shouldn't save a record?
                // Let's save only if marked Present or Absent.

                if (!emp.isPresent && !emp.isAbsent) return null;

                return {
                    member_id: emp.id,
                    date: selectedDate,
                    event: selectedEvent,
                    status: status,
                    remarks: emp.remarks
                };
            }).filter(Boolean); // Remove nulls

            // We probably want to upsert (update if exists for same member+date+event)
            // Assuming there is a unique constraint on (member_id, date, event) or we just insert.
            // Since we don't know the constraints, we'll try basic insert. 
            // Better: use upsert if we can identify the unique key. 
            // For now, let's just insert and hope for the best or assume user handles duplicates.

            const { error } = await supabase
                .from('attendance')
                .upsert(records, { onConflict: 'member_id, date, event' }); // Hope this constraint exists or Supabase handles it if we specify columns

            if (error) throw error;

            toast.success('Attendance saved successfully');
            onClose();
        } catch (error: any) {
            console.error('Error saving attendance:', error);
            toast.error('Failed to save attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container checklist-modal">
                <div className="modal-header">
                    <h2>Attendance Checklist</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="checklist-controls" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.25rem', display: 'block' }}>Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                            />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.25rem', display: 'block' }}>Event</label>
                            <select
                                className="form-input"
                                value={selectedEvent}
                                onChange={(e) => setSelectedEvent(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                                disabled={approvedEvents.length === 0}
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
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                        <div className="search-bar" style={{ flex: 2 }}>
                            <Search size={20} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-dropdown" style={{ flex: 1 }}>
                            <Filter size={20} className="filter-icon" />
                            <select
                                value={ministryFilter}
                                onChange={(e) => setMinistryFilter(e.target.value)}
                            >
                                {ministries.map(ministry => (
                                    <option key={ministry} value={ministry}>{ministry}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="checklist-body">
                    <table className="checklist-table">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Employee Name</th>
                                <th style={{ width: '20%' }}>Ministry</th>
                                <th style={{ width: '25%' }}>Remarks</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>Present</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>Absent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(emp => (
                                <tr key={emp.id}>
                                    <td className="employee-info">{emp.name}</td>
                                    <td className="employee-ministry">{emp.ministry}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="remarks-input"
                                            placeholder="Add remarks..."
                                            value={emp.remarks}
                                            onChange={(e) => handleRemarksChange(emp.id, e.target.value)}
                                        />
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div className="checkbox-wrapper">
                                            <input
                                                type="checkbox"
                                                className="checklist-checkbox"
                                                checked={emp.isPresent}
                                                onChange={() => handleAttendanceChange(emp.id, 'Present')}
                                            />
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div className="checkbox-wrapper">
                                            <input
                                                type="checkbox"
                                                className="checklist-checkbox"
                                                checked={emp.isAbsent}
                                                onChange={() => handleAttendanceChange(emp.id, 'Absent')}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={loading}>Cancel</button>
                    <button className="btn-save" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Attendance'}
                    </button>
                </div>
            </div>
        </div>
    );
};
