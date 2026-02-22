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
import { UserProfile } from '../../components/UserProfile';
import './MyProfile.css';

export const MyProfile = () => {
    const { profile, user, refreshProfile } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        birthday: '',
        cluster: ''
    });

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [clusters, setClusters] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Initialize form data and fetch clusters when profile loads
    useEffect(() => {
        const fetchClusters = async () => {
            const { data } = await supabase
                .from('clusters')
                .select('name')
                .order('name');

            if (data) {
                setClusters(data.map(c => c.name));
            }
        };

        fetchClusters();

        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                birthday: profile.birthday || '',
                cluster: profile.cluster || ''
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
                    birthday: formData.birthday || null,
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
        <div className="my-profile-page dashboard-view-content">
            <header className="top-bar">
                <div className="page-title">
                    <h1>My Profile</h1>
                    <p>Manage your account settings and preferences.</p>
                </div>
                <div className="top-actions">
                    <UserProfile />
                </div>
            </header>

            <div className="profile-content">
                {/* Header Card */}
                <div className="profile-header-card">
                    <div className="profile-main-info">
                        <div className="profile-avatar-large">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt={displayName} className="p-avatar-img" />
                            ) : (
                                <div className="p-avatar-placeholder">
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
                            <input type="text" className="form-input input-disabled" value={displayRole} disabled />
                        </div>
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input input-disabled" value={email} disabled />
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
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Cluster</label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    className="form-input select-custom"
                                    name="cluster"
                                    value={formData.cluster}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>Select Cluster</option>
                                    <option value="Unassigned">Unassigned</option>
                                    {clusters.map((c, idx) => (
                                        <option key={idx} value={c}>{c}</option>
                                    ))}
                                </select>
                                <div className="select-arrow">▼</div>
                            </div>
                        </div>
                    </div>

                    <div className="section-footer">
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
                    <div className="section-header no-border">
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

                    <div className="section-footer">
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
