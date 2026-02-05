import React from 'react';
import { X, Calendar } from 'lucide-react';
import './AddAttendanceModal.css';

interface AddAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ isOpen, onClose }) => {
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
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label>Member Name <span className="required">*</span></label>
                            <input type="text" className="form-input" placeholder="Enter member name" style={{ borderColor: '#6366f1', borderWidth: '1px' }} /> {/* Focused look in screenshot simulation */}
                        </div>

                        <div className="form-row-split">
                            <div className="form-group">
                                <label>Status <span className="required">*</span></label>
                                <select className="form-input" defaultValue="Present">
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Mode <span className="required">*</span></label>
                                <select className="form-input" defaultValue="Onsite">
                                    <option value="Onsite">Onsite</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Event <span className="required">*</span></label>
                            <select className="form-input" defaultValue="">
                                <option value="" disabled>Select an event</option>
                                <option value="sunday-service">Sunday Service</option>
                                <option value="prayer-meeting">Prayer Meeting</option>
                                <option value="bible-study">Bible Study</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Cluster <span className="required">*</span></label>
                            <select className="form-input" defaultValue="">
                                <option value="" disabled>Select a cluster</option>
                                <option value="A">Cluster A</option>
                                <option value="B">Cluster B</option>
                                <option value="C">Cluster C</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Date <span className="required">*</span></label>
                            <div style={{ position: 'relative' }}>
                                <input type="text" className="form-input" defaultValue="02/04/2026" />
                                <Calendar size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        <div className="modal-footer-simple">
                            <button className="btn-cancel" onClick={onClose}>Cancel</button>
                            <button className="btn-submit">Add Record</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
