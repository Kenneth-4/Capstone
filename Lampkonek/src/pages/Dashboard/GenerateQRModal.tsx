import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import QRCode from 'react-qr-code';
import { supabase } from '../../lib/supabase';
import { initializeRecurringEvents } from '../../utils/initializeRecurringEvents';

interface GenerateQRModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const GenerateQRModal: React.FC<GenerateQRModalProps> = ({ isOpen, onClose }) => {
    const [date, setDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    
    const [selectedEvent, setSelectedEvent] = useState('');
    const [approvedEvents, setApprovedEvents] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            initializeRecurringEvents().then(() => {
                fetchApprovedEvents(date);
            });
        }
    }, [isOpen, date]);

    const fetchApprovedEvents = async (selectedDate: string) => {
        try {
            const { data: reservationsData } = await supabase
                .from('reservations')
                .select('event_title')
                .eq('status', 'APPROVED')
                .eq('event_date', selectedDate);

            const { data: settingsData } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', 'recurring_events')
                .single();

            let allEvents: any[] = reservationsData || [];

            if (settingsData?.value) {
                const recurringEvents: any[] = JSON.parse(settingsData.value);
                const selectedDateObj = new Date(selectedDate + 'T00:00:00');
                const dayOfWeek = selectedDateObj.getDay();

                const matchingRecurringEvents = recurringEvents
                    .filter(e => e.enabled && e.dayOfWeek === dayOfWeek)
                    .map(e => ({ event_title: e.title }));

                allEvents = [...allEvents, ...matchingRecurringEvents];
            }

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

    const qrData = JSON.stringify({
        event: selectedEvent,
        date: date,
        type: 'attendance_qr'
    });

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-container attendance-modal">
                <div className="modal-header">
                    <h2>Generate Attendance QR</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
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

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                        {selectedEvent && approvedEvents.length > 0 ? (
                            <>
                                <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
                                    <QRCode value={qrData} size={256} />
                                </div>
                                <p style={{ marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>
                                    Have members scan this QR code to log their attendance.
                                </p>
                            </>
                        ) : (
                            <p style={{ color: '#ef4444' }}>Please select a valid event to generate a QR.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
