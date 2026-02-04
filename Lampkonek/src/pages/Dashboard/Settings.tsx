import { useState } from 'react';
import {
    Globe,
    Shield,
    Calendar,
    Bell,
    Users,
    User,
    Database,
    Save,
    Plus,
    Edit2,
    Trash2,
    AlertTriangle
} from 'lucide-react';
import './Settings.css';

// Mock Data
const rolesData = [
    { name: 'Admin', desc: 'All Permissions', count: 3 },
    { name: 'Ministry Leader', desc: 'View Reports, Manage Members, Manage Events', count: 8 },
    { name: 'Volunteer', desc: 'View Attendance, Check-in Members', count: 25 },
    { name: 'Member', desc: 'View Profile, View Events', count: 1200 },
];

const announcementsData = [
    { title: 'Christmas Service Schedule', date: '2024-12-08', status: 'Active' },
    { title: 'Youth Camp Registration Open', date: '2024-12-05', status: 'Active' },
    { title: 'Building Maintenance Notice', date: '2024-12-01', status: 'Inactive' },
];

const clustersData = [
    { name: 'Cluster A', leader: 'John Doe', members: 420 },
    { name: 'Cluster B', leader: 'Jane Smith', members: 385 },
    { name: 'Cluster C', leader: 'Maria Santos', members: 442 },
];

const ministriesData = [
    { name: 'Worship Team', leader: 'Pedro Cruz', members: 180 },
    { name: 'Youth Ministry', leader: 'Anna Reyes', members: 250 },
    { name: 'Children Ministry', leader: 'Mark Garcia', members: 220 },
    { name: 'Media Team', leader: 'Lisa Tan', members: 150 },
];

export const Settings = () => {
    const [activeSetting, setActiveSetting] = useState('General');

    const renderContent = () => {
        switch (activeSetting) {
            case 'General':
                return (
                    <div>
                        <div className="set-content-header">General Settings</div>
                        <div className="form-group">
                            <label className="form-label">Church Name</label>
                            <input type="text" className="form-input" defaultValue="LampKonek Church" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input type="text" className="form-input" defaultValue="123 Main Street, City, Country" />
                        </div>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Phone Number</label>
                                <input type="text" className="form-input" defaultValue="+63 912 345 6789" />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" defaultValue="info@lampkonek.church" />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button className="btn-primary">
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </div>
                );
            case 'User Roles':
                return (
                    <div>
                        <div className="set-content-header">
                            User Roles & Permissions
                            <button className="btn-primary" style={{ fontSize: '0.85rem' }}>
                                <Plus size={16} /> Add Role
                            </button>
                        </div>
                        {rolesData.map((role, idx) => (
                            <div key={idx} className="role-card">
                                <div className="role-info">
                                    <h4>{role.name}</h4>
                                    <span className="role-desc">{role.desc}</span>
                                    <span className="role-users">{role.count} users with this role</span>
                                </div>
                                <div className="role-actions">
                                    <button className="icon-btn-gray"><Edit2 size={16} /></button>
                                    <button className="icon-btn-gray icon-btn-red"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Reservations':
                return (
                    <div>
                        <div className="set-content-header">Reservation Settings</div>
                        <div className="form-group">
                            <label className="form-label">Reservation Expiration (Days)</label>
                            <input type="number" className="form-input" defaultValue={7} style={{ width: '100px' }} />
                            <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                Number of days before pending reservations automatically expire
                            </span>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Terms and Conditions</label>
                            <textarea className="form-input textarea-input" defaultValue={`1. Reservation Approval
All reservations are subject to approval by the church administration. Approval is not guaranteed and may be denied based on availability, purpose, or church policy.

2. Reservation Period
Reservations expire after 7 days if not approved or used. Please submit your reservation request at least 5 days before your intended date.

3. Cancellation Policy
Cancellations must be made at least 48 hours before the scheduled event. Late cancellations may affect future reservation privileges.

4. Facility Usage
The reserved venue and equipment must be used only for the stated purpose. Any changes to the event details must be approved in advance.`} />
                            <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                These terms will be displayed to users when they create a new reservation
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button className="btn-primary">
                                <Save size={18} /> Save Reservation Settings
                            </button>
                        </div>
                    </div>
                );
            case 'Announcements':
                return (
                    <div>
                        <div className="set-content-header">
                            Announcements
                            <button className="btn-primary" style={{ fontSize: '0.85rem' }}>
                                <Plus size={16} /> New Announcement
                            </button>
                        </div>
                        {announcementsData.map((ann, idx) => (
                            <div key={idx} className="announcement-card">
                                <div>
                                    <div className="ann-title-row">
                                        <span className="ann-title">{ann.title}</span>
                                        <span className={`ann-badge ${ann.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                                            {ann.status}
                                        </span>
                                    </div>
                                    <span className="ann-date">Posted on {ann.date}</span>
                                </div>
                                <div className="role-actions">
                                    <button className="icon-btn-gray"><Edit2 size={16} /></button>
                                    <button className="icon-btn-gray icon-btn-red"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Clusters':
                return (
                    <div>
                        <div className="set-content-header">
                            Cluster Management
                            <button className="btn-primary" style={{ fontSize: '0.85rem' }}>
                                <Plus size={16} /> Add Cluster
                            </button>
                        </div>
                        <div className="cluster-grid">
                            {clustersData.map((c, idx) => (
                                <div key={idx} className="role-card" style={{ marginBottom: 0 }}>
                                    <div className="role-info">
                                        <h4>{c.name}</h4>
                                        <span className="role-desc">Leader: {c.leader}</span>
                                        <span className="role-users">Members: {c.members}</span>
                                    </div>
                                    <div className="role-actions">
                                        <button className="icon-btn-gray"><Edit2 size={16} /></button>
                                        <button className="icon-btn-gray icon-btn-red"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Ministries':
                return (
                    <div>
                        <div className="set-content-header">
                            Ministry Management
                            <button className="btn-primary" style={{ fontSize: '0.85rem' }}>
                                <Plus size={16} /> Add Ministry
                            </button>
                        </div>
                        <div className="cluster-grid">
                            {ministriesData.map((m, idx) => (
                                <div key={idx} className="role-card" style={{ marginBottom: 0 }}>
                                    <div className="role-info">
                                        <h4>{m.name}</h4>
                                        <span className="role-desc">Leader: {m.leader}</span>
                                        <span className="role-users">Members: {m.members}</span>
                                    </div>
                                    <div className="role-actions">
                                        <button className="icon-btn-gray"><Edit2 size={16} /></button>
                                        <button className="icon-btn-gray icon-btn-red"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Backup & Restore':
                return (
                    <div>
                        <div className="set-content-header">Backup & Restore</div>
                        <div className="backup-section">
                            <div className="backup-card">
                                <div className="backup-icon b-icon-blue">
                                    <Database size={32} />
                                </div>
                                <div className="backup-title">Create Backup</div>
                                <div className="backup-desc">
                                    Create a backup of all your church data including members, attendance, and reservations
                                </div>
                                <button className="btn-primary" style={{ width: '200px' }}>
                                    Create Backup Now
                                </button>
                            </div>

                            <div className="backup-card">
                                <div className="backup-icon b-icon-green">
                                    <Database size={32} />
                                </div>
                                <div className="backup-title">Restore from Backup</div>
                                <div className="backup-desc">
                                    Restore your church data from a previous backup file
                                </div>
                                <button className="btn-primary btn-green" style={{ width: '200px' }}>
                                    Choose Backup File
                                </button>
                            </div>

                            <div className="warning-banner">
                                <AlertTriangle size={18} />
                                <span>Important: Regular backups are recommended. Last backup: Never</span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Select a setting to view</div>;
        }
    };

    return (
        <div className="settings-page">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Settings</h1>
                </div>
            </header>

            <div className="settings-container">
                {/* Sidebar Nav */}
                <nav className="settings-menu">
                    <button
                        className={`settings-nav-item ${activeSetting === 'General' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('General')}
                    >
                        <Globe size={18} /> General
                    </button>
                    <button
                        className={`settings-nav-item ${activeSetting === 'User Roles' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('User Roles')}
                    >
                        <Shield size={18} /> User Roles
                    </button>
                    <button
                        className={`settings-nav-item ${activeSetting === 'Reservations' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('Reservations')}
                    >
                        <Calendar size={18} /> Reservations
                    </button>
                    <button
                        className={`settings-nav-item ${activeSetting === 'Announcements' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('Announcements')}
                    >
                        <Bell size={18} /> Announcements
                    </button>
                    <button
                        className={`settings-nav-item ${activeSetting === 'Clusters' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('Clusters')}
                    >
                        <Users size={18} /> Clusters
                    </button>
                    <button
                        className={`settings-nav-item ${activeSetting === 'Ministries' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('Ministries')}
                    >
                        <User size={18} /> Ministries
                    </button>
                    <button
                        className={`settings-nav-item ${activeSetting === 'Backup & Restore' ? 'active' : ''}`}
                        onClick={() => setActiveSetting('Backup & Restore')}
                    >
                        <Database size={18} /> Backup & Restore
                    </button>
                </nav>

                {/* Main Content */}
                <main className="settings-content-area">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
