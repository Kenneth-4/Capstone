import React, { useEffect, useState } from 'react';
import './UpdateModal.css';

interface UpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : 'closing'}`} onClick={onClose}>
            <div className={`modal-content ${isOpen ? 'open' : 'closing'}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="header-title-group">
                        <div className="icon-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                        </div>
                        <h2>What's New</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    <div className="current-version-card">
                        <div className="version-left">
                            <span className="version-label">Current Version</span>
                            <span className="version-number">v1.0.1</span>
                        </div>
                        <div className="version-status">
                            <span className="status-dot"></span>
                            Up to date
                        </div>
                    </div>

                    <div className="updates-timeline">
                        <div className="timeline-item">
                            <div className="timeline-marker latest"></div>
                            <div className="timeline-content">
                                <span className="update-date">February 6, 2026</span>
                                <h4 className="update-title">Role-Based Access & Profiles 🛡️</h4>
                                <p>We've implemented secure access controls and personalized profiles.</p>
                                <ul className="feature-list">
                                    <li>👮‍♂️ <strong>Role-Based Access:</strong> Specific modules are now restricted based on your role (Admin, Ministry Leader, Logistics, member, etc).</li>
                                    <li>👤 <strong>Personalized Profile:</strong> "My Profile" now displays your actual account details.</li>
                                    <li>🧭 <strong>Smart Navigation:</strong> The sidebar only shows links relevant to your role.</li>
                                    <li>🖼️ <strong>User Widget:</strong> Top bar now shows your real name and role.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <span className="update-date">February 5, 2026</span>
                                <h4 className="update-title">Global Launch 🚀</h4>
                                <p>Welcome to Lampkonek! We're excited to start this journey with you.</p>
                                <ul className="feature-list">
                                    <li>Authentication Complete</li>
                                    <li>UI/UX Complete</li>
                                </ul>
                            </div>
                        </div>


                    </div>
                </div>

                <div className="modal-footer">
                    <button className="primary-btn" onClick={onClose}>Got it!</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
