import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit2,

} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './MyProfile.css';

export const MyProfile = () => {
    const { profile, user } = useAuth();

    const displayName = profile?.full_name || 'User';
    const displayRole = profile?.role || 'Member';
    const email = profile?.email || user?.email || 'No email';
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Mock data for fields not yet in DB
    const phone = "0917-123-4567";
    const cluster = "Cluster A";
    const joinDate = "Jan 2020";

    return (
        <div className="my-profile-page">
            <header className="top-bar">
                <div className="page-title">
                    <h1>My Profile</h1>
                </div>
                <div className="top-actions">
                    <div className="user-profile-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                    </div>
                </div>
            </header>

            <div className="profile-content">
                {/* Header Card */}
                <div className="profile-header-card">
                    <div className="profile-main-info">
                        <div className="profile-avatar-large">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt={displayName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {initials}
                                </div>
                            )}
                            <div className="avatar-edit-btn">
                                <Edit2 size={14} />
                            </div>
                        </div>
                        <div>
                            <div className="p-name-row">
                                <h2 className="p-name">{displayName}</h2>
                                <span className="p-badge">Active</span>
                                <span style={{ color: '#9ca3af' }}>•</span>
                                <span className="p-role">{displayRole}</span>
                            </div>
                            <div className="p-details-grid">
                                <div className="p-detail-item">
                                    <Mail size={14} /> {email}
                                </div>
                                <div className="p-detail-item">
                                    <Phone size={14} /> {phone}
                                </div>
                                <div className="p-detail-item">
                                    <MapPin size={14} /> {cluster}
                                </div>
                                <div className="p-detail-item">
                                    <Calendar size={14} /> Member since {joinDate}
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
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-input" defaultValue={displayName} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <input type="text" className="form-input" defaultValue={displayRole} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" defaultValue={email} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input type="text" className="form-input" defaultValue={phone} />
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
                                <select className="form-input" style={{ appearance: 'none' }} defaultValue={cluster}>
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
                        <input type="password" className="form-input" placeholder="••••••••" />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input type="password" className="form-input" placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input type="password" className="form-input" placeholder="••••••••" />
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
        </div>
    );
};
