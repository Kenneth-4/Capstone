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
                            <span className="version-number">v1.0.5</span>
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
                                <span className="update-date">February 8, 2026</span>
                                <h4 className="update-title">Reports & Analytics Complete 📊</h4>
                                <p>Comprehensive reporting system with real-time data visualization and dynamic filtering.</p>
                                <ul className="feature-list">
                                    <li>📈 <strong>Attendance Reports:</strong> Real-time attendance statistics with trends and cluster analysis.</li>
                                    <li>📅 <strong>Date Filtering:</strong> Filter reports by Today, This Week, This Month, Last 6 Months, and more.</li>
                                    <li>📊 <strong>Interactive Charts:</strong> Line charts for trends, bar charts for clusters, with tooltips and legends.</li>
                                    <li>👥 <strong>Member Reports:</strong> Status distribution, registration trends, and detailed member lists.</li>
                                    <li>🎯 <strong>Cluster Analytics:</strong> Real attendance tracking per cluster with dynamic filtering.</li>
                                    <li>🔍 <strong>Search & Pagination:</strong> Find specific events and navigate through attendance logs.</li>
                                    <li>📱 <strong>Loading States:</strong> Smooth loading indicators and empty state handling.</li>
                                    <li>🎨 <strong>Enhanced Design:</strong> Modern tooltips, legends, and visual feedback throughout.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <span className="update-date">February 8, 2026</span>
                                <h4 className="update-title">Reservation System Complete 📅</h4>
                                <p>Full-featured reservation management system with calendar and approval workflow.</p>
                                <ul className="feature-list">
                                    <li>📝 <strong>Create Reservations:</strong> Submit facility reservation requests with detailed information.</li>
                                    <li>📅 <strong>Interactive Calendar:</strong> Navigate months and see highlighted dates with reservations.</li>
                                    <li>👁️ <strong>View Details:</strong> Click any reservation to see complete information in a modal.</li>
                                    <li>✅ <strong>Approve/Reject:</strong> Administrators can approve or reject pending reservations.</li>
                                    <li>🔍 <strong>Search & Filter:</strong> Find reservations by title, ID, or venue.</li>
                                    <li>📊 <strong>Real-time Stats:</strong> Dashboard shows total, approved, pending, and rejected counts.</li>
                                    <li>🏷️ <strong>Equipment Tracking:</strong> Request specific equipment and setup requirements.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <span className="update-date">February 8, 2026</span>
                                <h4 className="update-title">Member Editing & Data Integration ✏️</h4>
                                <p>We've enhanced the Members module with real data capabilities.</p>
                                <ul className="feature-list">
                                    <li>📝 <strong>Edit Profiles:</strong> Admins can now edit member details directly from the list.</li>
                                    <li>🔌 <strong>Real Data:</strong> The members list now pulls live data from the database.</li>
                                    <li>🔍 <strong>Search & Filter:</strong> Finding members is now easier with working search and filter tools.</li>
                                    <li>🗑️ <strong>Delete Members:</strong> Admins can now delete member profiles.</li>
                                    <li>🗑️ <strong>Removed Add Members:</strong> Removed the ability to add new members. as it will be a security risk. instead, members can now use the sign up form to create their own accounts.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
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
