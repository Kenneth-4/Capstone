import React from 'react';
import { X, PlusCircle, Calendar } from 'lucide-react';
import './AddMemberModal.css';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Add Member</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="section-title">Personal Information</div>

                    <form>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name <span className="required">*</span></label>
                                <input type="text" className="form-input" placeholder="e.g. John" />
                            </div>
                            <div className="form-group">
                                <label>Last Name <span className="required">*</span></label>
                                <input type="text" className="form-input" placeholder="e.g. Doe" />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Email Address <span className="required">*</span></label>
                                <input type="email" className="form-input" placeholder="john.doe@example.com" />
                            </div>
                            <div className="form-group">
                                <label>Birth Date <span className="required">*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <input type="text" className="form-input" placeholder="mm/dd/yyyy" style={{ width: '100%' }} />
                                    <Calendar size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Gender</label>
                                <select className="form-input" defaultValue="">
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <select className="form-input" defaultValue="">
                                    <option value="" disabled>Select Country</option>
                                    <option value="ph">Philippines</option>
                                    <option value="us">United States</option>
                                    {/* Add more countries as needed */}
                                </select>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Cluster</label>
                                <select className="form-input" defaultValue="">
                                    <option value="" disabled>Select Cluster</option>
                                    <option value="A">Cluster A</option>
                                    <option value="B">Cluster B</option>
                                    <option value="C">Cluster C</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Member Status <span className="required">*</span></label>
                                <select className="form-input" defaultValue="">
                                    <option value="" disabled>Select Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="semi-active">Semi Active</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Join Date</label>
                                <div style={{ position: 'relative' }}>
                                    <input type="text" className="form-input" placeholder="mm/dd/yyyy" style={{ width: '100%' }} />
                                    <Calendar size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Ministry</label>
                                <input type="text" className="form-input" placeholder="e.g. Worship Team" />
                            </div>
                        </div>

                        <a href="#" className="add-secondary-email">
                            <PlusCircle size={16} />
                            Add Secondary Email Address
                        </a>
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="save-btn">Save Member</button>
                </div>
            </div>
        </div>
    );
};
