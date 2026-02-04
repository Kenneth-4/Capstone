import React, { useState } from 'react';
import { X, Calendar, Clock, Plus, FileText } from 'lucide-react';
import './NewReservationModal.css';

interface NewReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EQUIPMENT_OPTIONS = [
    'Sound System', 'Projector', 'Screen', 'Microphones',
    'Livestream Equipment', 'Chairs', 'Tables', 'Whiteboard'
];

export const NewReservationModal: React.FC<NewReservationModalProps> = ({ isOpen, onClose }) => {
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleEquipment = (item: string) => {
        if (selectedEquipment.includes(item)) {
            setSelectedEquipment(selectedEquipment.filter(i => i !== item));
        } else {
            setSelectedEquipment([...selectedEquipment, item]);
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
                            <input type="text" className="form-input" placeholder="Enter event title" />
                        </div>
                        <div className="form-group">
                            <label>Venue <span className="required">*</span></label>
                            <select className="form-input" defaultValue="">
                                <option value="" disabled>Select venue</option>
                                <option value="sanctuary">Main Sanctuary</option>
                                <option value="hall">Fellowship Hall</option>
                                <option value="room">Multi-purpose Room</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-grid" style={{ marginBottom: 0 }}>
                            <div className="form-group">
                                <label>Date <span className="required">*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <input type="text" className="form-input" placeholder="mm/dd/yyyy" style={{ width: '100%' }} />
                                    <Calendar size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div className="form-grid" style={{ marginBottom: 0, gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Start Time <span className="required">*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="text" className="form-input" placeholder="--:-- --" style={{ width: '100%' }} />
                                        <Clock size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>End Time <span className="required">*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <input type="text" className="form-input" placeholder="--:-- --" style={{ width: '100%' }} />
                                        <Clock size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Purpose <span className="required">*</span></label>
                            <textarea className="form-input" placeholder="Describe the purpose of this reservation"></textarea>
                        </div>
                    </div>

                    <div className="section-title">Additional Details</div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Expected Attendees <span className="required">*</span></label>
                            <input type="number" className="form-input" placeholder="Number of attendees" />
                        </div>
                        <div className="form-group">
                            <label>Setup Required</label>
                            <select className="form-input" defaultValue="">
                                <option value="" disabled>Select setup type</option>
                                <option value="theatre">Theatre Style</option>
                                <option value="classroom">Classroom Style</option>
                                <option value="u-shape">U-Shape</option>
                                <option value="round">Round Tables</option>
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
                                <input type="text" className="form-input" placeholder="Add custom equipment" style={{ flex: 1 }} />
                                <button className="add-btn-small">
                                    <Plus size={16} /> Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Additional Notes</label>
                            <textarea className="form-input" placeholder="Any additional information or special requests..."></textarea>
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
                        <input type="checkbox" id="terms-agree" />
                        <label htmlFor="terms-agree">I have read and agree to the terms and conditions <span className="required">*</span></label>
                    </div>

                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="submit-btn">
                        <FileText size={18} />
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
    );
};
