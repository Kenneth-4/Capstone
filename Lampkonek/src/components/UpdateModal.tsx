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
                            <span className="version-number">v1.7.0</span>
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
                                <span className="update-date">March 15, 2026</span>
                                <h4 className="update-title">Automated QR Attendance & Analytics Polish 📸</h4>
                                <p>We've completely modernized how you take attendance. No more manual clicking—members can now simply scan a QR code! We also polished member analytics.</p>
                                <ul className="feature-list">
                                    <li>📸 <strong>QR Code Scanning:</strong> Admins can generate a live QR code per event. Members can scan it with their device to automatically log their attendance.</li>
                                    <li>⚡ <strong>Real-Time Refresh:</strong> The attendance board updates instantly the second a member scans the QR code—no page reloads needed!</li>
                                    <li>📊 <strong>Smart Event Tallies:</strong> Member profiles now break down their attendance ratio specific to recurring automatic events (e.g., Sunday Service vs. Prayer Meeting).</li>
                                    <li>🎯 <strong>Streamlined Statuses:</strong> We removed "Late" and "Excused" to enforce a stricter, cleaner "Present" or "Absent" tracking logic.</li>
                                    <li>🔒 <strong>Date Locking:</strong> The manual Add Attendance modal is now locked to the current real-world day, preventing accidental historical logging errors.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <span className="update-date">February 28, 2026</span>
                                <h4 className="update-title">Attendance & Reports Polish 📊</h4>
                                <p>We've massively improved the Attendance and Reports pages with better navigation, export tools, and professional document printing.</p>
                                <ul className="feature-list">
                                    <li>📄 <strong>Real Pagination:</strong> Replaced the old "Show More" functionality with a robust, navigable pagination system on the Attendance page.</li>
                                    <li>🖨️ <strong>Print-Ready Reports:</strong> Added a clean, black-and-white document style for printing both Attendance and Member Reports without dashboard clutter.</li>
                                    <li>📥 <strong>CSV Data Export:</strong> You can now export your filtered reports into neatly formatted `.csv` files natively compatible with spreadsheet software like Excel.</li>
                                    <li>🔘 <strong>Action Consolidation:</strong> Simplified the Attendance UI by merging "Add Onsite" and "Add Online" into a single, smart "Add Attendance" button.</li>
                                    <li>🎨 <strong>Breathing Room:</strong> Increased margins and gaps across the Reports dashboards for a premium, less-cramped view.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <span className="update-date">February 22, 2026 (Evening)</span>
                                <h4 className="update-title">Premium Dashboard Standardization & UI Polish ✨</h4>
                                <p>A major design synchronization across the entire dashboard suite, ensuring a consistent, premium feel on every page.</p>
                                <ul className="feature-list">
                                    <li>🎨 <strong>Unified Design Language:</strong> Standardized layout and spacing across all dashboard tabs for a cohesive user experience.</li>
                                    <li>👤 <strong>Global Identity:</strong> Integrated the UserProfile widget into every header, keeping your status visible at all times.</li>
                                    <li>📈 <strong>Modern Analytics:</strong> Re-engineered chart components with "edge-to-edge" styling for a more professional, streamlined look.</li>
                                    <li>📱 <strong>Native Mobile Feel:</strong> Enhanced mobile modals with pull handles and improved touch-friendly action grids.</li>
                                    <li>🧼 <strong>Clean Viewports:</strong> Optimized headers with contextual subtitles and improved white space management (5rem header gap).</li>
                                    <li>✨ <strong>Logic Fixes:</strong> Resolved JSX structural issues in Reports and cleaned up experimental 'Export' features for a more focused experience.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <span className="update-date">February 22, 2026</span>
                                <h4 className="update-title">Total Mobile Responsiveness Overhaul 📱</h4>
                                <p>We've completely re-engineered the mobile experience for a seamless, "app-like" feel across the entire dashboard and settings.</p>
                                <ul className="feature-list">
                                    <li>📱 <strong>Mobile-First Modals:</strong> All settings modals now slide up from the bottom on mobile with sticky footers and stacked action buttons.</li>
                                    <li>⚙️ <strong>Adaptive Settings:</strong> Settings navigation now transforms into a sticky horizontal scrollable tab bar on small screens.</li>
                                    <li>🔐 <strong>Auth Page Refresh:</strong> Login and Signup pages now feature a prominent animated Lampkonek logo on mobile with centered layouts.</li>
                                    <li>👤 <strong>Profile Accessibility:</strong> Redesigned "My Profile" with stacked information cards and touch-optimized form fields.</li>
                                    <li>📊 <strong>Responsive Reports:</strong> Stacking statistics cards and table-to-card transformations for better viewing on the go.</li>
                                    <li>✨ <strong>UI Optimization:</strong> Improved touch targets, removed bulky margins, and added smooth mobile-only animations.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <span className="update-date">February 19, 2026</span>
                                <h4 className="update-title">Dashboard & Activity Enhancements 🚀</h4>
                                <p>Major upgrades to the dashboard with real-time activity tracking, visual improvements to attendance and reservations, and enhanced security.</p>
                                <ul className="feature-list">
                                    <li>🕒 <strong>Recent Activity Timeline:</strong> A beautiful new timeline on the dashboard showing real-time member registrations, reservations, and attendance.</li>
                                    <li>📅 <strong>Upcoming Services:</strong> Dedicated card view for approved upcoming events and services.</li>
                                    <li>📊 <strong>Attendance Analytics:</strong> Completely redesigned Attendance page with "Trends" and "Onsite vs Online" charts.</li>
                                    <li>🖨️ <strong>Export & Print:</strong> You can now export attendance data to CSV or print reports directly.</li>
                                    <li>🛡️ <strong>Security Update:</strong> Signup flow now restricts "Admin" and "Pastor" role creation.</li>
                                    <li>🎨 <strong>UI Polish:</strong> Refined icons, colors, and layout across the dashboard for a premium feel.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <span className="update-date">February 15, 2026</span>
                            <h4 className="update-title">Visual Overhaul & Branding Refresh ✨</h4>
                            <p>We've completely modernized the authentication experience and dashboard branding with a sleek, premium design.</p>
                            <ul className="feature-list">
                                <li>🎨 <strong>Modern Design:</strong> Login and Signup pages now feature a stunning glassmorphism design with a levitating logo animation.</li>
                                <li>⚡ <strong>Enhanced Branding:</strong> Integrated the official Lampkonek logo across the app, including the Dashboard sidebar.</li>
                                <li>📱 <strong>Responsive Layout:</strong> Improved split-screen layouts that adapt perfectly to any device size.</li>
                                <li>✨ <strong>Visual Polish:</strong> Replaced generic icons with modern "Lucide" icons and added smooth animations throughout.</li>
                                <li>🌚 <strong>Consistent Theming:</strong> Unified dark mode toggles and UI elements across all authentication screens.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <span className="update-date">February 13, 2026</span>
                            <h4 className="update-title">Reservation Management & Permission System Fix 🔧</h4>
                            <p>We've enhanced reservation management with edit/delete capabilities and fixed the user roles permission system to work as intended.</p>
                            <ul className="feature-list">
                                <li>✏️ <strong>Edit Reservations:</strong> Pending reservations can now be edited directly from the details modal.</li>
                                <li>🗑️ <strong>Delete Reservations:</strong> All non-recurring reservations can be deleted with confirmation.</li>
                                <li>🎨 <strong>Icon-Only Buttons:</strong> Cleaner UI with Edit and Delete icons instead of text buttons.</li>
                                <li>🔒 <strong>Permission System Fixed:</strong> User role permissions now actually control dashboard access! Changes in Settings → User Roles are now applied immediately.</li>
                                <li>🔄 <strong>Dynamic Permissions:</strong> Dashboard now fetches permissions from the database instead of using hardcoded values.</li>
                                <li>📊 <strong>Debug Logging:</strong> Added console logs to help troubleshoot permission issues.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <span className="update-date">February 13, 2026</span>
                            <h4 className="update-title">Member Form & Dashboard Polish 💎</h4>
                            <p>We've refined the member management experience and optimized the dashboard layout.</p>
                            <ul className="feature-list">
                                <li>📝 <strong>Enhanced Member Form:</strong> Complete redesign with clear sections for Basic, Church, and Emergency info.</li>
                                <li>📱 <strong>New Data Fields:</strong> Track comprehensive details including Phone, Birthday, Address, and Emergency Contacts.</li>
                                <li>📊 <strong>Dashboard Layout Fix:</strong> Optimized the statistics grid to a clean 3x2 layout for better readability.</li>
                                <li>🎨 <strong>Visual Polish:</strong> Improved styling, icons, and input fields across the member management module.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <span className="update-date">February 13, 2026</span>
                            <h4 className="update-title">Recurring Events & Enhanced Automation 🤖</h4>
                            <p>We've added powerful automation tools to streamline your workflow and keep data accurate.</p>
                            <ul className="feature-list">
                                <li>🔄 <strong>Recurring Events:</strong> Set up weekly events like Sunday Service and Prayer Meeting that auto-appear on your calendar.</li>
                                <li>❌ <strong>Auto-Absence:</strong> Members who miss a recurring event are automatically marked as "Absent" once the event ends.</li>
                                <li>🏷️ <strong>Status Automation:</strong> Member status (Active, Semi Active, Inactive) is now automatically updated based on monthly attendance.</li>
                                <li>ℹ️ <strong>Smart Tooltips:</strong> Added helpful context to explain automation rules right where you need them.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <span className="update-date">February 12, 2026</span>
                            <h4 className="update-title">Member Management & Permissions Overhaul 🛠️</h4>
                            <p>We've restored member management and significantly enhanced security controls.</p>
                            <ul className="feature-list">
                                <li>🔒 <strong>Granular Permissions:</strong> New "User Roles" editor allows precise control over which pages each role can access.</li>
                                <li>🔄 <strong>Dynamic Data Handling:</strong> Forms now intelligently fetch Clusters and Ministries from your settings, ensuring data consistency.</li>
                                <li>✨ <strong>Profile Enhancements:</strong> "My Profile" now supports dynamic cluster selection and proper birth date handling.</li>
                                <li>📊 <strong>Status Consistency:</strong> Fixed discrepancies between Dashboard charts and Member Reports.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <span className="update-date">February 9, 2026</span>
                            <h4 className="update-title">Advanced Settings & Data Management ⚙️</h4>
                            <p>Major upgrade to the Settings module, giving you full control over your church's structure and data safety.</p>
                            <ul className="feature-list">
                                <li>🏘️ <strong>Dynamic Clusters:</strong> Create, edit, and delete Cluster groups. Auto-detects clusters from member profiles!</li>
                                <li>🙏 <strong>Ministry Management:</strong> Full control over Ministries with dynamic member counting and leader assignment.</li>
                                <li>💾 <strong>Backup & Restore:</strong> Protect your data! Download full database backups and restore them with a single click.</li>
                                <li>🔗 <strong>Integrated Forms:</strong> "Add Member" forms now dynamically pull options from your defined Clusters and Ministries.</li>
                                <li>🗑️ <strong>Safe Deletion:</strong> Unified confirmation dialogues to prevent accidental data loss.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker"></div>
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

                <div className="modal-footer">
                    <button className="primary-btn" onClick={onClose}>Got it!</button>
                </div>
            </div>
        </div>
    );
};

export default UpdateModal;
