import React from 'react';
import { X } from 'lucide-react';
import './TakeAttendanceModal.css';

interface TakeAttendanceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TakeAttendanceModal: React.FC<TakeAttendanceModalProps> = ({ isOpen, onClose }) => {
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
                    {/* Member Name */}
                    <div className="form-group">
                        <label>Member Name <span className="required">*</span></label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter member name"
                            autoFocus
                        />
                    </div>

                    {/* Status & Mode Row */}
                    <div className="form-row">
                        <div className="col-half">
                            <div className="form-group">
                                <label>Status <span className="required">*</span></label>
                                <select className="form-input" defaultValue="Present">
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
                                <select className="form-input" defaultValue="Onsite">
                                    <option value="Onsite">Onsite</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Event */}
                    {/* Event & Cluster Row */}
                    <div className="form-row">
                        <div className="col-half">
                            <div className="form-group">
                                <label>Event <span className="required">*</span></label>
                                <select className="form-input" defaultValue="">
                                    <option value="" disabled>Select an event</option>
                                    <option value="Sunday Service">Sunday Service</option>
                                    <option value="Prayer Meeting">Prayer Meeting</option>
                                    <option value="Bible Study">Bible Study</option>
                                    <option value="Youth Fellowship">Youth Fellowship</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-half">
                            <div className="form-group">
                                <label>Cluster <span className="required">*</span></label>
                                <select className="form-input" defaultValue="">
                                    <option value="" disabled>Select a cluster</option>
                                    <option value="Cluster A">Cluster A</option>
                                    <option value="Cluster B">Cluster B</option>
                                    <option value="Cluster C">Cluster C</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="form-group">
                        <label>Date <span className="required">*</span></label>
                        <div className="date-input-container">
                            <input
                                type="date"
                                className="form-input"
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                            {/* Native date inputs often have their own icon, but standard text inputs do not. 
                                Providing a fallback or custom wrapper if browser supports it.
                                For now utilizing standard input with type="date".
                            */}
                        </div>
                    </div>

                    {/* Footer buttons inside body/container flow or separate? 
                       Image shows them at bottom. I put them in modal-footer in CSS which is flex.
                       I'll move them here inside body or container. The CSS has .modal-footer.
                       Let's put them after form groups.
                    */}
                    <div className="modal-footer" style={{ padding: '0', marginTop: '1.5rem' }}>
                        <button className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button className="submit-btn" onClick={() => {
                            // Handle save logic
                            onClose();
                        }}>Add Record</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
