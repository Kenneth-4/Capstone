import { useState, useEffect } from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit2,

} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './MyProfile.css';

export const MyProfile = () => {
    const { profile, user, refreshProfile } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        birth_date: '',
        cluster: ''
    });

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Initialize form data when profile loads
    useEffect(() => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                birth_date: profile.birth_date || '',
                cluster: profile.cluster || 'Cluster A'
            });
        }
    }, [profile]);

    const displayName = profile?.full_name || 'User';
    const displayRole = profile?.role || 'Member';
    const email = profile?.email || user?.email || 'No email';
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle password input changes
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save profile changes
    const handleSaveProfile = async () => {
        if (!user) return;

        // Validation
        if (!formData.full_name.trim()) {
            toast.error('Full name is required');
            return;
        }

        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name.trim(),
                    phone: formData.phone || null,
                    birth_date: formData.birth_date || null,
                    cluster: formData.cluster || null
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success('Profile updated successfully!');
            await refreshProfile();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setIsUpdating(false);
        }
    };

    // Change password
    const handleChangePassword = async () => {
        // Validation
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        setIsChangingPassword(true);
        try {
            // Verify current password by attempting to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: passwordData.currentPassword
            });

            if (signInError) {
                throw new Error('Current password is incorrect');
            }

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (updateError) throw updateError;

            toast.success('Password changed successfully!');

            // Clear password fields
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error: any) {
            console.error('Error changing password:', error);
            toast.error(error.message || 'Failed to change password');
        } finally {
            setIsChangingPassword(false);
        }
    };

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
                                    <Phone size={14} /> {formData.phone || 'No phone'}
                                </div>
                                <div className="p-detail-item">
                                    <MapPin size={14} /> {formData.cluster || 'No cluster'}
                                </div>
                                <div className="p-detail-item">
                                    <Calendar size={14} /> Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <input
                                type="text"
                                className="form-input"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <input type="text" className="form-input" value={displayRole} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" value={email} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-input"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="0917-123-4567"
                            />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Birth Date</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="date"
                                    className="form-input"
                                    name="birth_date"
                                    value={formData.birth_date}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cluster</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    className="form-input"
                                    style={{ appearance: 'none' }}
                                    name="cluster"
                                    value={formData.cluster}
                                    onChange={handleInputChange}
                                >
                                    <option value="Cluster A">Cluster A</option>
                                    <option value="Cluster B">Cluster B</option>
                                    <option value="Cluster C">Cluster C</option>
                                </select>
                                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }}>▼</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn-primary"
                            onClick={handleSaveProfile}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
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
                        <input
                            type="password"
                            className="form-input"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn-primary"
                            onClick={handleChangePassword}
                            disabled={isChangingPassword}
                        >
                            {isChangingPassword ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </div>

                <div className="footer-copyright">
                    © 2024 Lampkonek Ministry Management System. All rights reserved.
                </div>
            </div>
        </div>
    );
};
