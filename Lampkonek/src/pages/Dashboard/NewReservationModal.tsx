import React, { useState, useEffect } from 'react';
import { X, Plus, FileText } from 'lucide-react';
import './NewReservationModal.css';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface NewReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const EQUIPMENT_OPTIONS = [
    'Sound System', 'Projector', 'Screen', 'Microphones',
    'Livestream Equipment', 'Chairs', 'Tables', 'Whiteboard'
];

export const NewReservationModal: React.FC<NewReservationModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const [customEquipment, setCustomEquipment] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        eventTitle: '',
        venue: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: '',
        setupRequired: '',
        additionalNotes: ''
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                eventTitle: '',
                venue: '',
                eventDate: '',
                startTime: '',
                endTime: '',
                purpose: '',
                expectedAttendees: '',
                setupRequired: '',
                additionalNotes: ''
            });
            setSelectedEquipment([]);
            setCustomEquipment('');
            setAgreedToTerms(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleEquipment = (item: string) => {
        if (selectedEquipment.includes(item)) {
            setSelectedEquipment(selectedEquipment.filter(i => i !== item));
        } else {
            setSelectedEquipment([...selectedEquipment, item]);
        }
    };

    const handleAddCustomEquipment = () => {
        if (customEquipment.trim()) {
            setSelectedEquipment([...selectedEquipment, customEquipment.trim()]);
            setCustomEquipment('');
            toast.success('Custom equipment added');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.eventTitle || !formData.venue || !formData.eventDate ||
            !formData.startTime || !formData.endTime || !formData.purpose ||
            !formData.expectedAttendees) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!agreedToTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        const attendees = parseInt(formData.expectedAttendees);
        if (isNaN(attendees) || attendees <= 0) {
            toast.error('Please enter a valid number of attendees');
            return;
        }

        setIsSubmitting(true);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('You must be logged in to create a reservation');
            }

            // Get user's full name from profiles
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .single();

            const organizerName = profile?.full_name || user.email || 'Unknown';

            // Insert reservation
            const { error } = await supabase
                .from('reservations')
                .insert({
                    user_id: user.id,
                    event_title: formData.eventTitle,
                    venue: formData.venue,
                    event_date: formData.eventDate,
                    start_time: formData.startTime,
                    end_time: formData.endTime,
                    purpose: formData.purpose,
                    expected_attendees: attendees,
                    setup_required: formData.setupRequired || null,
                    equipment_needed: selectedEquipment.length > 0 ? selectedEquipment : null,
                    additional_notes: formData.additionalNotes || null,
                    organizer_name: organizerName,
                    status: 'PENDING'
                });

            if (error) throw error;

            toast.success('Reservation submitted successfully! Awaiting approval.');

            // Close modal and refresh
            onClose();
            if (onSuccess) {
                setTimeout(() => onSuccess(), 100);
            }
        } catch (error: any) {
            console.error('Error creating reservation:', error);
            toast.error(error.message || 'Failed to create reservation');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container reservation-modal">
                <div className="modal-header">
                    <h2>Event Information</h2> {/* Using this as the main title based on image, though typically it's "New Reservation" */}
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Event Information Section */}
                    {/* Determine if we should show "Event Information" again or if the header covers it. 
                        The image shows "Event Information" at the very top, essentially as the modal title or section header.
                        Let's treat the modal header as the container for it or just put it inside default header text.
                        Actually, typical modal has a "New Reservation" title. The image starts with "Event Information".
                        I'll assume the Modal Header should probably say "New Reservation" or "Event Information".
                        Let's stick to "Event Information" as the first section title inside body if the header is generic.
                        But looking at the image, "Event Information" looks like a section header. 
                        Let's make the modal title "New Reservation" and the first section "Event Information".
                        Wait, the prompt says "that look like this". 
                        The image definitely shows "Event Information" as a heading. 
                        I will make the modal header generic "New Reservation" and follow the form structure.
                    */}

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Event Title <span className="required">*</span></label>
                            <input
                                type="text"
                                name="eventTitle"
                                className="form-input"
                                placeholder="Enter event title"
                                value={formData.eventTitle}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Venue <span className="required">*</span></label>
                            <select
                                name="venue"
                                className="form-input"
                                value={formData.venue}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>Select venue</option>
                                <option value="Main Sanctuary">Main Sanctuary</option>
                                <option value="Fellowship Hall">Fellowship Hall</option>
                                <option value="Multi-purpose Room">Multi-purpose Room</option>
                                <option value="Prayer Room">Prayer Room</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-grid" style={{ marginBottom: 0 }}>
                            <div className="form-group">
                                <label>Date <span className="required">*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        className="form-input"
                                        style={{ width: '100%' }}
                                        value={formData.eventDate}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="form-grid" style={{ marginBottom: 0, gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Start Time <span className="required">*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="time"
                                            name="startTime"
                                            className="form-input"
                                            style={{ width: '100%' }}
                                            value={formData.startTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>End Time <span className="required">*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="time"
                                            name="endTime"
                                            className="form-input"
                                            style={{ width: '100%' }}
                                            value={formData.endTime}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Purpose <span className="required">*</span></label>
                            <textarea
                                name="purpose"
                                className="form-input"
                                placeholder="Describe the purpose of this reservation"
                                value={formData.purpose}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="section-title">Additional Details</div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Expected Attendees <span className="required">*</span></label>
                            <input
                                type="number"
                                name="expectedAttendees"
                                className="form-input"
                                placeholder="Number of attendees"
                                value={formData.expectedAttendees}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Setup Required</label>
                            <select
                                name="setupRequired"
                                className="form-input"
                                value={formData.setupRequired}
                                onChange={handleInputChange}
                            >
                                <option value="">Select setup type</option>
                                <option value="Theatre Style">Theatre Style</option>
                                <option value="Classroom Style">Classroom Style</option>
                                <option value="U-Shape">U-Shape</option>
                                <option value="Round Tables">Round Tables</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Equipment Needed</label>
                            <div className="equipment-buttons">
                                {EQUIPMENT_OPTIONS.map(equip => (
                                    <button
                                        key={equip}
                                        className={`equip-btn ${selectedEquipment.includes(equip) ? 'selected' : ''}`}
                                        onClick={() => toggleEquipment(equip)}
                                    >
                                        {equip}
                                    </button>
                                ))}
                            </div>
                            <div className="custom-equip-row">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Add custom equipment"
                                    style={{ flex: 1 }}
                                    value={customEquipment}
                                    onChange={(e) => setCustomEquipment(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomEquipment())}
                                />
                                <button
                                    type="button"
                                    className="add-btn-small"
                                    onClick={handleAddCustomEquipment}
                                >
                                    <Plus size={16} /> Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Additional Notes</label>
                            <textarea
                                name="additionalNotes"
                                className="form-input"
                                placeholder="Any additional information or special requests..."
                                value={formData.additionalNotes}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </div>

                    <div className="section-title">Terms and Conditions</div>

                    <div className="terms-box">
                        <p><strong>RESERVATION TERMS AND CONDITIONS</strong></p>
                        <p>1. <strong>Reservation Approval</strong></p>
                        <p>All reservations are subject to approval by the church administration. Approval is not guaranteed and may be denied based on availability, purpose, or church policy.</p>
                        <br />
                        <p>2. <strong>Reservation Period</strong></p>
                        <p>Reservations expire after 7 days if not approved or used. Please submit your reservation request at least 5 days before your intended date.</p>
                        <br />
                        <p>3. <strong>Cancellation Policy</strong></p>
                        <p>Cancellations must be made at least 24 hours in advance.</p>
                    </div>

                    <div className="terms-checkbox">
                        <input
                            type="checkbox"
                            id="terms-agree"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                        />
                        <label htmlFor="terms-agree">I have read and agree to the terms and conditions <span className="required">*</span></label>
                    </div>

                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="submit-btn"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <FileText size={18} />
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};
