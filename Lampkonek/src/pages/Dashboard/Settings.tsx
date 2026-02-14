import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
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
    AlertTriangle,
    ChevronRight, // Added ChevronRight import
} from 'lucide-react';
import './Settings.css';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { AddAnnouncementModal } from './AddAnnouncementModal';
import { AddClusterModal } from './AddClusterModal';
import { AddMinistryModal } from './AddMinistryModal';

interface AppSettings {
    churchName: string;
    address: string;
    phone: string;
    email: string;
}

interface ReservationSettings {
    expirationDays: number;
    terms: string;
}

interface Announcement {
    id: number;
    title: string;
    date: string;
    status: string;
}

interface GroupStats {
    id?: number;
    name: string;
    count: number;
    leader?: string; // Derived if possible
    description?: string;
    permissions?: string[];
}

interface Cluster {
    id: number;
    name: string;
    leader: string;
    description: string;
    schedule?: string;
    count?: number; // For display
}

interface Ministry {
    id: number;
    name: string;
    leader: string;
    description: string;
    schedule?: string;
    count?: number;
}

export const Settings = () => {
    const [activeSetting, setActiveSetting] = useState('General');
    const [loading, setLoading] = useState(false);

    // State for Settings
    const [generalSettings, setGeneralSettings] = useState<AppSettings>({
        churchName: 'LampKonek Church',
        address: '123 Main Street, City, Country',
        phone: '+63 912 345 6789',
        email: 'info@lampkonek.church'
    });

    const [reservationSettings, setReservationSettings] = useState<ReservationSettings>({
        expirationDays: 7,
        terms: `1. Reservation Approval\nAll reservations are subject to approval by the church administration.\n\n2. Reservation Period\nReservations expire after 7 days if not approved or used.\n\n3. Cancellation Policy\nCancellations must be made at least 48 hours before the scheduled event.`
    });

    // State for Lists
    const [rolesList, setRolesList] = useState<GroupStats[]>([]);
    const [clustersList, setClustersList] = useState<Cluster[]>([]);
    const [ministriesList, setMinistriesList] = useState<Ministry[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // Selected items for editing
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isClusterModalOpen, setIsClusterModalOpen] = useState(false);
    const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
    const [isMinistryModalOpen, setIsMinistryModalOpen] = useState(false);
    const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
    const [selectedRole, setSelectedRole] = useState<GroupStats | null>(null);
    const [tempPermissions, setTempPermissions] = useState<string[]>([]);

    const APP_PAGES = ['Dashboard', 'Attendance', 'Members', 'Reports', 'Settings', 'Reservation'];

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteType, setDeleteType] = useState<'role' | 'announcement' | 'cluster' | 'ministry' | null>(null);
    const [itemToDelete, setItemToDelete] = useState<any>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSettings('general');
        fetchSettings('reservations');
    }, []);

    useEffect(() => {
        if (activeSetting === 'User Roles') fetchRoles();
        if (activeSetting === 'Clusters') fetchClusters();
        if (activeSetting === 'Ministries') fetchMinistries();
        if (activeSetting === 'Announcements') fetchAnnouncements();
    }, [activeSetting]);

    const fetchSettings = async (key: string) => {
        try {
            const { data } = await supabase
                .from('app_settings')
                .select('value')
                .eq('key', key)
                .single();

            if (data && data.value) {
                const parsed = JSON.parse(data.value);
                if (key === 'general') setGeneralSettings(parsed);
                if (key === 'reservations') setReservationSettings(parsed);
            }
        } catch (error) {
            console.error(`Error fetching ${key} settings:`, error);
        }
    };

    const fetchRoles = async () => {
        try {
            // 1. Fetch defined roles from 'roles' table (has ID for signup)
            const { data: definedRoles } = await supabase
                .from('roles')
                .select('*')
                .order('name');

            // 2. Fetch all profiles to count usage
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('role');

            if (profilesError) throw profilesError;

            // Count users per role
            const counts: Record<string, number> = {};
            profiles?.forEach((p: any) => {
                const role = p.role || 'Unassigned';
                counts[role] = (counts[role] || 0) + 1;
            });

            let finalRoles: GroupStats[] = [];

            if (definedRoles && definedRoles.length > 0) {
                // Map defined roles with their usage counts (include ID)
                finalRoles = definedRoles.map((r: any) => ({
                    id: r.id, // Include ID for editing/deleting
                    name: r.name,
                    count: counts[r.name] || 0,
                    description: r.description,
                    permissions: (r.permissions || []).map((p: string) => p === 'Reservations' ? 'Reservation' : p)
                }));

                // Add Unassigned if exists
                if (counts['Unassigned']) {
                    finalRoles.push({
                        name: 'Unassigned',
                        count: counts['Unassigned'],
                        description: 'Users without a role'
                    });
                }
            } else {
                // If no roles defined, just show unassigned
                if (counts['Unassigned']) {
                    finalRoles.push({
                        name: 'Unassigned',
                        count: counts['Unassigned'],
                        description: 'Users without a role'
                    });
                }
            }

            setRolesList(finalRoles);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    const fetchClusters = async () => {
        try {
            // 1. Fetch defined clusters
            const { data: definedClusters, error: clusterError } = await supabase
                .from('clusters')
                .select('*')
                .order('name');

            if (clusterError && clusterError.code !== 'PGRST116') {
                // Ignore if table doesn't exist yet, but log others
                console.error('Error fetching clusters table:', clusterError);
            }

            // 2. Fetch profile counts by cluster
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('cluster');

            if (profileError) throw profileError;

            const counts: Record<string, number> = {};
            profiles?.forEach((p: any) => {
                const clusterName = p.cluster || 'Unassigned';
                counts[clusterName] = (counts[clusterName] || 0) + 1;
            });

            // 3. Merge data
            const distinctNames = new Set<string>();
            const mergedClusters: Cluster[] = [];

            // Add defined clusters first
            if (definedClusters) {
                definedClusters.forEach(c => {
                    distinctNames.add(c.name);
                    mergedClusters.push({
                        ...c,
                        count: counts[c.name] || 0
                    });
                });
            }

            // Add any cluster found in profiles that isn't defined yet
            Object.keys(counts).forEach(clusterName => {
                if (!distinctNames.has(clusterName) && clusterName !== 'Unassigned' && clusterName !== 'No Cluster') {
                    mergedClusters.push({
                        id: 0, // Temporary ID for auto-detected
                        name: clusterName,
                        leader: 'Auto-detected',
                        description: 'Found in member profiles but not defined in settings.',
                        count: counts[clusterName]
                    });
                    distinctNames.add(clusterName);
                }
            });

            // Add 'Unassigned' count if exists
            if (counts['Unassigned']) {
                mergedClusters.push({
                    id: -1,
                    name: 'Unassigned',
                    leader: '-',
                    description: 'Members without a cluster',
                    count: counts['Unassigned']
                });
            }
            if (counts['No Cluster']) {
                // Sometimes it might come as 'No Cluster'
                // merged...
            }

            setClustersList(mergedClusters.sort((a, b) => a.name.localeCompare(b.name)));

        } catch (error) {
            console.error('Error fetching clusters:', error);
            toast.error('Failed to load clusters');
        }
    };

    const fetchMinistries = async () => {
        try {
            // 1. Fetch defined ministries
            const { data: definedMinistries, error: minError } = await supabase
                .from('ministries')
                .select('*')
                .order('name');

            if (minError && minError.code !== 'PGRST116') {
                console.error('Error fetching ministries table:', minError);
            }

            // 2. Fetch profile counts by ministry
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('ministry');

            if (profileError) throw profileError;

            const counts: Record<string, number> = {};
            profiles?.forEach((p: any) => {
                const ministryName = p.ministry || 'None';
                counts[ministryName] = (counts[ministryName] || 0) + 1;
            });

            // 3. Merge data
            const distinctNames = new Set<string>();
            const mergedMinistries: Ministry[] = [];

            // Add defined ministries first
            if (definedMinistries) {
                definedMinistries.forEach(m => {
                    distinctNames.add(m.name);
                    mergedMinistries.push({
                        ...m,
                        count: counts[m.name] || 0
                    });
                });
            }

            // Add any ministry found in profiles that isn't defined yet
            Object.keys(counts).forEach(ministryName => {
                if (!distinctNames.has(ministryName) && ministryName !== 'None' && ministryName !== '') {
                    mergedMinistries.push({
                        id: 0, // Temporary ID for auto-detected
                        name: ministryName,
                        leader: 'Auto-detected',
                        description: 'Found in member profiles but not defined in settings.',
                        count: counts[ministryName]
                    });
                    distinctNames.add(ministryName);
                }
            });

            setMinistriesList(mergedMinistries.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (error) {
            console.error('Error fetching ministries:', error);
            toast.error('Failed to load ministries');
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('date', { ascending: false });
            if (error) throw error;
            setAnnouncements(data || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const handleAddAnnouncement = async (data: { title: string; status: string }) => {
        if (!data.title) {
            toast.error('Title is required');
            return;
        }

        try {
            setLoading(true);

            if (selectedAnnouncement) {
                const { error } = await supabase
                    .from('announcements')
                    .update({
                        title: data.title,
                        status: data.status
                    })
                    .eq('id', selectedAnnouncement.id);

                if (error) throw error;
                toast.success('Announcement updated!');
            } else {
                const { error } = await supabase
                    .from('announcements')
                    .insert([{
                        title: data.title,
                        status: data.status,
                        date: new Date().toISOString().split('T')[0]
                    }]);

                if (error) throw error;
                toast.success('Announcement added!');
            }

            setIsAnnouncementModalOpen(false);
            setSelectedAnnouncement(null);
            fetchAnnouncements();
        } catch (error: any) {
            console.error('Error saving announcement:', error);
            toast.error('Failed to save announcement');
        } finally {
            setLoading(false);
        }
    };

    const handleEditAnnouncement = (ann: Announcement) => {
        setSelectedAnnouncement(ann);
        setIsAnnouncementModalOpen(true);
    };

    const handleAddCluster = async (data: { name: string; leader: string; description: string; schedule: string }) => {
        if (!data.name) {
            toast.error('Cluster Name is required');
            return;
        }

        try {
            setLoading(true);

            // Use upsert since name is the primary key
            const { error } = await supabase
                .from('clusters')
                .upsert({
                    name: data.name,
                    leader: data.leader,
                    description: data.description,
                    schedule: data.schedule
                }, {
                    onConflict: 'name'
                });

            if (error) throw error;

            // Show appropriate message
            if (selectedCluster?.name && selectedCluster.name !== data.name) {
                toast.success('Cluster created!');
            } else if (selectedCluster?.name) {
                toast.success('Cluster updated!');
            } else {
                toast.success('Cluster created!');
            }

            setIsClusterModalOpen(false);
            setSelectedCluster(null);
            fetchClusters();
        } catch (error: any) {
            console.error('Error saving cluster:', error);
            toast.error('Failed to save cluster');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCluster = (cluster: Cluster) => {
        setSelectedCluster(cluster);
        setIsClusterModalOpen(true);
    };

    const handleDeleteCluster = (cluster: Cluster) => {
        setItemToDelete(cluster);
        setDeleteType('cluster');
        setIsDeleteModalOpen(true);
    };

    const handleAddMinistry = async (data: { name: string; leader: string; description: string; schedule: string }) => {
        if (!data.name) {
            toast.error('Ministry Name is required');
            return;
        }

        try {
            setLoading(true);

            // Use upsert since name is the primary key
            const { error } = await supabase
                .from('ministries')
                .upsert({
                    name: data.name,
                    leader: data.leader,
                    description: data.description,
                    schedule: data.schedule
                }, {
                    onConflict: 'name'
                });

            if (error) throw error;

            // Show appropriate message
            if (selectedMinistry?.name && selectedMinistry.name !== data.name) {
                toast.success('Ministry created!');
            } else if (selectedMinistry?.name) {
                toast.success('Ministry updated!');
            } else {
                toast.success('Ministry created!');
            }

            setIsMinistryModalOpen(false);
            setSelectedMinistry(null);
            fetchMinistries();
        } catch (error: any) {
            console.error('Error saving ministry:', error);
            toast.error('Failed to save ministry');
        } finally {
            setLoading(false);
        }
    };

    const handleEditMinistry = (ministry: Ministry) => {
        setSelectedMinistry(ministry);
        setIsMinistryModalOpen(true);
    };

    const handleDeleteMinistry = (ministry: Ministry) => {
        setItemToDelete(ministry);
        setDeleteType('ministry');
        setIsDeleteModalOpen(true);
    };

    // Backup & Restore Handlers
    const handleCreateBackup = async () => {
        try {
            setLoading(true);
            const tables = ['roles', 'clusters', 'ministries', 'announcements', 'attendance', 'profiles', 'app_settings'];
            const backupData: any = { version: '1.0', timestamp: new Date().toISOString(), tables: {} };

            // Fetch data sequentially to avoid connection spam
            for (const table of tables) {
                const { data, error } = await supabase.from(table).select('*');
                if (error && error.code !== '42P01') { // Ignore "relation does not exist" for optional tables
                    console.warn(`Error backing up ${table}:`, error);
                }
                backupData.tables[table] = data || [];
            }

            // Download JSON
            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lampkonek_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success('Backup created successfully!');
        } catch (error) {
            console.error('Backup failed:', error);
            toast.error('Failed to create backup');
        } finally {
            setLoading(false);
        }
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm('WARNING: Restoring will overwrite existing data with matching IDs. This cannot be undone. Are you sure?')) {
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        try {
            setLoading(true);
            const text = await file.text();
            const backup = JSON.parse(text);

            if (!backup.version || !backup.tables) throw new Error('Invalid backup file format');

            // Restore non-dependent tables first
            const dictTables = ['roles', 'clusters', 'ministries', 'announcements', 'app_settings'];
            for (const table of dictTables) {
                const records = backup.tables[table];
                if (records && records.length > 0) {
                    const { error } = await supabase.from(table).upsert(records);
                    if (error) console.error(`Error restoring ${table}:`, error);
                }
            }

            // Restore profiles
            const profiles = backup.tables['profiles'];
            if (profiles && profiles.length > 0) {
                // Note: We cannot restore Auth users, only their public profiles.
                // If the Auth user doesn't exist, this might fail depending on RLS/Foreign Keys, 
                // but typically profiles are linked to auth.users. 
                // We'll attempt upsert.
                const { error } = await supabase.from('profiles').upsert(profiles);
                if (error) console.error('Error restoring profiles:', error);
            }

            // Restore attendance (depends on profiles)
            const attendance = backup.tables['attendance'];
            if (attendance && attendance.length > 0) {
                const { error } = await supabase.from('attendance').upsert(attendance);
                if (error) console.error('Error restoring attendance:', error);
            }


            toast.success('Restore process finished');

            // Refresh all data
            fetchRoles();
            fetchClusters();
            fetchMinistries();
            fetchAnnouncements();

        } catch (error) {
            console.error('Restore failed:', error);
            toast.error('Failed to restore backup');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDeleteAnnouncement = (id: number) => {
        setItemToDelete({ id });
        setDeleteType('announcement');
        setIsDeleteModalOpen(true);
    };

    const handleUpdateRolePermissions = async () => {
        if (!selectedRole?.id) return;

        try {
            setLoading(true);
            const { error } = await supabase
                .from('roles')
                .update({
                    permissions: tempPermissions
                })
                .eq('id', selectedRole.id);

            if (error) throw error;
            toast.success('Role permissions updated successfully');

            // Refresh and close
            fetchRoles();
            setSelectedRole(null);
            setTempPermissions([]);
        } catch (error: any) {
            console.error('Error updating role:', error);
            toast.error('Failed to update permissions');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        setLoading(true);

        try {
            if (deleteType === 'role') {
                const { error } = await supabase
                    .from('roles')
                    .delete()
                    .eq('id', itemToDelete.id); // Roles use ID

                if (error) throw error;
                toast.success('Role deleted successfully');
                fetchRoles();
            } else if (deleteType === 'announcement') {
                const { error } = await supabase
                    .from('announcements')
                    .delete()
                    .eq('id', itemToDelete.id);

                if (error) throw error;
                toast.success('Announcement deleted');
                fetchAnnouncements();
                setSelectedAnnouncement(null);
            } else if (deleteType === 'cluster') {
                const { error } = await supabase
                    .from('clusters')
                    .delete()
                    .eq('name', itemToDelete.name); // Clusters use name as primary key

                if (error) throw error;
                toast.success('Cluster deleted');
                fetchClusters();
                setSelectedCluster(null);
            } else if (deleteType === 'ministry') {
                const { error } = await supabase
                    .from('ministries')
                    .delete()
                    .eq('name', itemToDelete.name); // Ministries use name as primary key

                if (error) throw error;
                toast.success('Ministry deleted');
                fetchMinistries();
                setSelectedMinistry(null);
            }
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            setDeleteType(null);
        } catch (error: any) {
            console.error('Error deleting item:', error);
            toast.error('Failed to delete item');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGeneral = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('app_settings')
                .upsert({ key: 'general', value: JSON.stringify(generalSettings) });
            if (error) throw error;
            toast.success('General settings saved!');
        } catch (error: any) {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveReservations = async () => {
        try {
            setLoading(true);
            const { error } = await supabase
                .from('app_settings')
                .upsert({ key: 'reservations', value: JSON.stringify(reservationSettings) });
            if (error) throw error;
            toast.success('Reservation settings saved!');
        } catch (error: any) {
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (activeSetting) {
            case 'General':
                return (
                    <div>
                        <div className="set-content-header">General Settings</div>
                        <div className="form-group">
                            <label className="form-label">Church Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={generalSettings.churchName}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, churchName: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                className="form-input"
                                value={generalSettings.address}
                                onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={generalSettings.phone}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={generalSettings.email}
                                    onChange={(e) => setGeneralSettings({ ...generalSettings, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button className="btn-primary" onClick={handleSaveGeneral} disabled={loading}>
                                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                );
            case 'User Roles':
                return (
                    <div>
                        <div className="set-content-header">
                            User Roles & Permissions
                        </div>

                        {selectedRole ? (
                            <div className="role-editor">
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>{selectedRole.name}</h3>
                                    <p style={{ color: '#6b7280' }}>{selectedRole.description}</p>
                                </div>

                                <div className="permissions-section">
                                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Allowed Access</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {APP_PAGES.map(page => (
                                            <label key={page} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={tempPermissions.includes(page)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setTempPermissions([...tempPermissions, page]);
                                                        } else {
                                                            setTempPermissions(tempPermissions.filter(p => p !== page));
                                                        }
                                                    }}
                                                    style={{ width: '16px', height: '16px' }}
                                                />
                                                <span style={{ color: '#374151' }}>{page}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button
                                        className="btn-primary"
                                        onClick={handleUpdateRolePermissions}
                                        disabled={loading}
                                    >
                                        <Save size={16} /> Save Changes
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: 'white', cursor: 'pointer' }}
                                        onClick={() => setSelectedRole(null)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            rolesList.length === 0 ? <p style={{ color: '#6b7280', padding: '1rem' }}>No roles data found.</p> : rolesList.map((role, idx) => (
                                <div
                                    key={idx}
                                    className="role-card"
                                    onClick={() => {
                                        setSelectedRole(role);
                                        setTempPermissions(role.permissions || []);
                                    }}
                                    style={{ cursor: 'pointer', transition: 'transform 0.1s' }}
                                >
                                    <div className="role-info">
                                        <h4>{role.name}</h4>
                                        <span className="role-desc">{role.description || role.leader || 'No description'}</span>
                                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {(role.permissions || []).slice(0, 3).map((perm, i) => (
                                                <span key={i} style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '4px' }}>
                                                    {perm}
                                                </span>
                                            ))}
                                            {(role.permissions?.length || 0) > 3 && (
                                                <span style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '4px' }}>
                                                    +{(role.permissions?.length || 0) - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="role-actions">
                                        <ChevronRight size={20} color="#9ca3af" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );
            case 'Reservations':
                return (
                    <div>
                        <div className="set-content-header">Reservation Settings</div>
                        <div className="form-group">
                            <label className="form-label">Reservation Expiration (Days)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={reservationSettings.expirationDays}
                                onChange={(e) => setReservationSettings({ ...reservationSettings, expirationDays: parseInt(e.target.value) || 0 })}
                                style={{ width: '100px' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                Number of days before pending reservations automatically expire
                            </span>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Terms and Conditions</label>
                            <textarea
                                className="form-input textarea-input"
                                value={reservationSettings.terms}
                                onChange={(e) => setReservationSettings({ ...reservationSettings, terms: e.target.value })}
                            />
                            <span style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                                These terms will be displayed to users when they create a new reservation
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button className="btn-primary" onClick={handleSaveReservations} disabled={loading}>
                                <Save size={18} /> {loading ? 'Saving...' : 'Save Reservation Settings'}
                            </button>
                        </div>
                    </div>
                );
            case 'Announcements':
                return (
                    <div>
                        <div className="set-content-header">
                            Announcements
                            <button
                                className="btn-primary"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => {
                                    setSelectedAnnouncement(null);
                                    setIsAnnouncementModalOpen(true);
                                }}
                            >
                                <Plus size={16} /> New Announcement
                            </button>
                        </div>

                        {/* Announcement Modal */}
                        <AddAnnouncementModal
                            isOpen={isAnnouncementModalOpen}
                            onClose={() => setIsAnnouncementModalOpen(false)}
                            onSave={handleAddAnnouncement}
                            initialData={selectedAnnouncement ? {
                                title: selectedAnnouncement.title,
                                status: selectedAnnouncement.status
                            } : null}
                        />
                        {announcements.length === 0 ? <p style={{ color: '#6b7280', padding: '1rem' }}>No announcements found.</p> : announcements.map((ann, idx) => (
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
                                    <button
                                        className="icon-btn-gray"
                                        onClick={() => handleEditAnnouncement(ann)}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        className="icon-btn-gray icon-btn-red"
                                        onClick={() => handleDeleteAnnouncement(ann.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
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
                            <button
                                className="btn-primary"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => {
                                    setSelectedCluster(null);
                                    setIsClusterModalOpen(true);
                                }}
                            >
                                <Plus size={16} /> Add Cluster
                            </button>
                        </div>

                        <AddClusterModal
                            isOpen={isClusterModalOpen}
                            onClose={() => setIsClusterModalOpen(false)}
                            onSave={handleAddCluster}
                            initialData={selectedCluster ? {
                                name: selectedCluster.name,
                                leader: selectedCluster.leader,
                                description: selectedCluster.description,
                                schedule: selectedCluster.schedule
                            } : undefined}
                        />

                        <div className="cluster-grid">
                            {clustersList.length === 0 ? <p style={{ color: '#6b7280', padding: '1rem', gridColumn: '1 / -1' }}>No clusters found.</p> : clustersList.map((c, idx) => (
                                <div key={idx} className="role-card" style={{ marginBottom: 0 }}>
                                    <div className="role-info">
                                        <h4>{c.name}</h4>
                                        <span className="role-desc">{c.leader || 'No Leader Assigned'}</span>
                                        <span className="role-users" style={{ display: 'block', marginBottom: '0.25rem' }}>Members: {c.count}</span>
                                        {c.schedule && <span className="role-users" style={{ color: '#6366f1' }}>{c.schedule}</span>}
                                    </div>
                                    <div className="role-actions">
                                        <button
                                            className="icon-btn-gray"
                                            onClick={() => handleEditCluster(c)}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="icon-btn-gray icon-btn-red"
                                            onClick={() => handleDeleteCluster(c)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
                            <button
                                className="btn-primary"
                                style={{ fontSize: '0.85rem' }}
                                onClick={() => {
                                    setSelectedMinistry(null);
                                    setIsMinistryModalOpen(true);
                                }}
                            >
                                <Plus size={16} /> Add Ministry
                            </button>
                        </div>

                        <AddMinistryModal
                            isOpen={isMinistryModalOpen}
                            onClose={() => setIsMinistryModalOpen(false)}
                            onSave={handleAddMinistry}
                            initialData={selectedMinistry ? {
                                name: selectedMinistry.name,
                                leader: selectedMinistry.leader,
                                description: selectedMinistry.description,
                                schedule: selectedMinistry.schedule
                            } : undefined}
                        />

                        <div className="cluster-grid">
                            {ministriesList.length === 0 ? <p style={{ color: '#6b7280', padding: '1rem', gridColumn: '1 / -1' }}>No ministries found.</p> : ministriesList.map((m, idx) => (
                                <div key={idx} className="role-card" style={{ marginBottom: 0 }}>
                                    <div className="role-info">
                                        <h4>{m.name}</h4>
                                        <span className="role-desc">{m.leader || 'No Leader Assigned'}</span>
                                        <span className="role-users" style={{ display: 'block', marginBottom: '0.25rem' }}>Members: {m.count}</span>
                                        {m.schedule && <span className="role-users" style={{ color: '#10b981' }}>{m.schedule}</span>}
                                    </div>
                                    <div className="role-actions">
                                        <button
                                            className="icon-btn-gray"
                                            onClick={() => handleEditMinistry(m)}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            className="icon-btn-gray icon-btn-red"
                                            onClick={() => handleDeleteMinistry(m)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
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
                                <button
                                    className="btn-primary"
                                    style={{ width: '200px' }}
                                    onClick={handleCreateBackup}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Create Backup Now'}
                                </button>
                            </div>

                            <div className="backup-card">
                                <div className="backup-icon b-icon-green">
                                    <Database size={32} />
                                </div>
                                <div className="backup-title">Restore from Backup</div>
                                <div className="backup-desc">
                                    Restore your church data from a previous backup file
                                    <br /><span style={{ fontSize: '0.8rem', color: '#ef4444' }}>Warning: This may overwrite existing data.</span>
                                </div>
                                <input
                                    type="file"
                                    accept=".json"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                                <button
                                    className="btn-primary btn-green"
                                    style={{ width: '200px' }}
                                    onClick={handleRestoreClick}
                                    disabled={loading}
                                >
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

                <DeleteConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title={deleteType === 'role' ? 'Delete Role' : (deleteType === 'cluster' ? 'Delete Cluster' : (deleteType === 'ministry' ? 'Delete Ministry' : 'Delete Announcement'))}
                    message={deleteType === 'role'
                        ? `Are you sure you want to delete the role "${itemToDelete?.name}"? This action cannot be undone.`
                        : (deleteType === 'cluster'
                            ? `Are you sure you want to delete the cluster "${itemToDelete?.name}"? This action cannot be undone.`
                            : (deleteType === 'ministry'
                                ? `Are you sure you want to delete the ministry "${itemToDelete?.name}"? This action cannot be undone.`
                                : 'Are you sure you want to delete this announcement? This action cannot be undone.'))}
                    loading={loading}
                />
            </div>
        </div>
    );
};
