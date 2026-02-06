import React from 'react';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

interface UserProfileProps {
    showRole?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ showRole = true }) => {
    const { profile, loading } = useAuth();

    if (loading) {
        return (
            <div className="user-profile-skeleton">
                <div className="skeleton-text"></div>
                <div className="skeleton-avatar"></div>
            </div>
        );
    }

    const displayName = profile?.full_name || 'User';
    const displayRole = profile?.role || 'Member';
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="user-profile-widget">
            <div className="user-info">
                <span className="user-name">{displayName}</span>
                {showRole && <span className="user-role">{displayRole}</span>}
            </div>
            <div className="avatar-container">
                {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={displayName} className="user-avatar-img" />
                ) : (
                    <div className="user-avatar-placeholder">
                        {initials}
                    </div>
                )}
                <div className="status-indicator"></div>
            </div>
            {/* <Settings size={18} className="settings-icon" /> */}
        </div>
    );
};
