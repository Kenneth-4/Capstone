import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit2,
    Settings
} from 'lucide-react';
import './MyProfile.css';

export const MyProfile = () => {
    return (
        <div className="my-profile-page">
            <header className="top-bar">
                <div className="page-title">
                    <h1>My Profile</h1>
                </div>
                <div className="top-actions">
                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">Ministry Leader</span>
                            <span className="user-role">ADMIN</span>
                        </div>
                        <div className="avatar">
                            <User size={20} />
                        </div>
                        <Settings size={20} style={{ color: '#9ca3af', marginLeft: '0.5rem', cursor: 'pointer' }} />
                    </div>
                </div>
            </header>

            <div className="profile-content">
                {/* Header Card */}
                <div className="profile-header-card">
                    <div className="profile-main-info">
                        <div className="profile-avatar-large">
                            <User size={48} />
                            <div className="avatar-edit-btn">
                                <Edit2 size={14} />
                            </div>
                        </div>
                        <div>
                            <div className="p-name-row">
                                <h2 className="p-name">Admin User</h2>
                                <span className="p-badge">Active</span>
                                <span style={{ color: '#9ca3af' }}>•</span>
                                <span className="p-role">Administrator</span>
                            </div>
                            <div className="p-details-grid">
                                <div className="p-detail-item">
                                    <Mail size={14} /> admin@lampbinan.org
                                </div>
                                <div className="p-detail-item">
                                    <Phone size={14} /> 0917-123-4567
                                </div>
                                <div className="p-detail-item">
                                    <MapPin size={14} /> Cluster A
                                </div>
                                <div className="p-detail-item">
                                    <Calendar size={14} /> Member since Jan 2020
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn-outline">
                        <Edit2 size={16} /> Edit Profile
                    </button>
                </div>

                {/* Personal Information */}
                <div className="profile-section-card">
                    <div className="section-header">
                        <h3 className="section-title">Personal Information</h3>
                        <p className="section-subtitle">Update your basic information and contact details.</p>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-input" defaultValue="Admin" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-input" defaultValue="User" />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" defaultValue="admin@lampbinan.org" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-input" defaultValue="0917-123-4567" />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Birth Date</label>
                            <div style={{ position: 'relative' }}>
                                <input type="text" className="form-input" defaultValue="01/15/1990" />
                                <Calendar size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cluster</label>
                            <div style={{ position: 'relative' }}>
                                <select className="form-input" style={{ appearance: 'none' }}>
                                    <option>Cluster A</option>
                                    <option>Cluster B</option>
                                </select>
                                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }}>▼</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn-primary">Save Changes</button>
                    </div>
                </div>

                {/* Change Password */}
                <div className="profile-section-card">
                    <div className="section-header" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
                        <h3 className="section-title">Change Password</h3>
                        <p className="section-subtitle">Ensure your account is using a long, random password to stay secure.</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <input type="password" className="form-input" defaultValue="........" />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-input" defaultValue="........" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-input" defaultValue="........" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn-primary">Update Password</button>
                    </div>
                </div>

                <div className="footer-copyright">
                    © 2024 Lampkonek Ministry Management System. All rights reserved.
                </div>
            </div>

            {/* Theme Toggle Floating Button (as seen in screenshot bottom right if that's what it is, or maybe just standard) 
                Actually the screenshot shows a Moon icon in a circle at the bottom right of the 'Change Password' card area?
                Wait, looking at the image... ah, there is a round pill-shaped toggle at the bottom right of the password card.
                Let's stick to standard layout first.
            */}
        </div>
    );
};
