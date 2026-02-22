import { useState, useEffect, useMemo } from 'react';
import { X, Search, ShieldCheck, User as UserIcon, Save, ChevronDown, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './EditUserRolesModal.css';

interface EditUserRolesModalProps {
    isOpen: boolean;
    onClose: () => void;
    roles: string[];
}

export const EditUserRolesModal = ({
    isOpen,
    onClose,
    roles
}: EditUserRolesModalProps) => {
    const [users, setUsers] = useState<any[]>([]);
    const [pendingUpdates, setPendingUpdates] = useState<Record<string, string>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [displayLimit, setDisplayLimit] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            setDisplayLimit(10);
            setSearchQuery('');
            setPendingUpdates({});
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('id, full_name, email, role')
                .neq('role', 'Administrator')
                .order('full_name', { ascending: true });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = (userId: string, newRole: string) => {
        const originalUser = users.find(u => u.id === userId);
        if (originalUser.role === newRole) {
            const newPending = { ...pendingUpdates };
            delete newPending[userId];
            setPendingUpdates(newPending);
        } else {
            setPendingUpdates({
                ...pendingUpdates,
                [userId]: newRole
            });
        }
    };

    const handleSaveChanges = async () => {
        const updateCount = Object.keys(pendingUpdates).length;
        if (updateCount === 0) return;

        try {
            setIsSaving(true);
            const promises = Object.entries(pendingUpdates).map(([userId, newRole]) =>
                supabase.from('profiles').update({ role: newRole }).eq('id', userId)
            );

            const results = await Promise.all(promises);
            const errors = results.filter(r => r.error);

            if (errors.length > 0) {
                toast.error(`Failed to update ${errors.length} user(s)`);
            } else {
                toast.success(`Successfully updated ${updateCount} user role(s)`);
                // Update local state
                setUsers(users.map(u => pendingUpdates[u.id] ? { ...u, role: pendingUpdates[u.id] } : u));
                setPendingUpdates({});
            }
        } catch (error) {
            console.error('Error saving changes:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
        (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [users, searchQuery]);

    const displayedUsers = filteredUsers.slice(0, displayLimit);
    const hasPendingChanges = Object.keys(pendingUpdates).length > 0;

    if (!isOpen) return null;

    return (
        <div className="user-roles-modal-overlay">
            <div className="user-roles-modal-content">
                <div className="mobile-pull-handle"></div>
                <div className="user-roles-modal-header">
                    <div className="header-icon-badge">
                        <ShieldCheck size={24} />
                    </div>
                    <div className="title-group">
                        <h3>Member Access Control</h3>
                        <p>Manage permissions and assign roles to your church members.</p>
                    </div>
                    <button className="user-roles-close-btn" onClick={onClose} disabled={isSaving}>
                        <X size={20} />
                    </button>
                </div>

                <div className="user-roles-modal-body">
                    <div className="search-bar-wrapper">
                        <Search className="search-bar-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-bar-input"
                        />
                    </div>

                    <div className="users-grid">
                        {loading && users.length === 0 ? (
                            <div className="loading-state">
                                <div className="spinner"></div>
                                <span>Loading member profiles...</span>
                            </div>
                        ) : displayedUsers.length === 0 ? (
                            <div className="empty-state">
                                <Search size={48} />
                                <p>No members found matching your search.</p>
                            </div>
                        ) : (
                            displayedUsers.map((user) => {
                                const isModified = !!pendingUpdates[user.id];
                                const currentRole = pendingUpdates[user.id] || user.role;

                                return (
                                    <div key={user.id} className={`user-role-card ${isModified ? 'modified' : ''}`}>
                                        <div className="user-card-main">
                                            <div className="user-avatar-mini">
                                                {user.full_name?.charAt(0) || <UserIcon size={16} />}
                                            </div>
                                            <div className="user-details">
                                                <div className="user-name-row">
                                                    <span className="u-name">{user.full_name}</span>
                                                    {isModified && <span className="modified-indicator"><Check size={10} /> Pending</span>}
                                                </div>
                                                <div className="u-email">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="user-card-actions">
                                            <div className="select-wrapper">
                                                <select
                                                    value={currentRole}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="role-select-premium"
                                                    disabled={isSaving}
                                                >
                                                    {roles.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="select-icon" size={14} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {filteredUsers.length > displayLimit && (
                        <div className="show-more-container">
                            <button
                                className="show-more-fancy-btn"
                                onClick={() => setDisplayLimit(prev => prev * 2)}
                            >
                                <span>Show More Members</span>
                                <span className="remaining-count">+{filteredUsers.length - displayLimit} more</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="user-roles-modal-footer">
                    <button
                        className="modal-secondary-btn"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        className={`modal-primary-btn ${!hasPendingChanges ? 'disabled' : ''}`}
                        onClick={handleSaveChanges}
                        disabled={!hasPendingChanges || isSaving}
                    >
                        {isSaving ? (
                            <>
                                <div className="btn-spinner"></div>
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save {hasPendingChanges ? `(${Object.keys(pendingUpdates).length})` : ''} Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
