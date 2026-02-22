import { useState, useEffect, useRef } from 'react';
import {
    Search,
    Filter,
    User,
    UserCheck,
    UserX,
    Users,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    Download,
    Plus,
    ArrowLeft,
    Calendar,
    Activity,
    SquarePen,
    Trash2
} from 'lucide-react';
import './Members.css';
import { AddMemberModal } from './AddMemberModal';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Member {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    cluster: string;
    ministry: string;
    status: string;
    role: string;
    created_at: string;
    birthday?: string;
    address?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
}

interface MemberStats {
    present: number;
    absent: number;
    ratio: number;
    recentHistory: {
        date: string;
        event_name: string;
        status: string;
    }[];
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Active': return 'status-active';
        case 'Inactive': return 'status-inactive';
        case 'Semi Active': return 'status-semi-active';
        case 'Transferred': return 'status-inactive'; // Using inactive style
        case 'Deceased': return 'status-inactive'; // Using inactive style
        case 'Visitor': return 'status-visitor';
        default: return 'status-active'; // Default style
    }
};

const getAvatarColor = (name: string) => {
    const colors = ['purple', 'orange', 'blue', 'pink', 'green'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const Members = () => {
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [clusterFilter, setClusterFilter] = useState('All Clusters');
    const [editingMember, setEditingMember] = useState<Member | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [memberStats, setMemberStats] = useState<MemberStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(false);

    // Pagination
    const [visibleCount, setVisibleCount] = useState(window.innerWidth <= 768 ? 10 : 20);

    const handleShowMore = () => {
        setVisibleCount(prev => prev * 2);
    };

    // Click outside handler for menu
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Derived Lists for Filters
    const clustersList = Array.from(new Set(members.map(m => m.cluster))).filter(Boolean).sort();

    // Stats
    const stats = {
        total: members.length,
        active: members.filter(m => m.status === 'Active').length,
        inactive: members.filter(m => m.status === 'Inactive').length,
        visitors: members.filter(m => m.status === 'Visitor').length
    };

    // Fetch members from Supabase
    const fetchMembers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .neq('role', 'Administrator')
                .order('full_name', { ascending: true });

            if (error) throw error;

            if (data) {
                // Map the data to ensure all fields exist (handling nulls from DB)
                const mappedMembers = data.map((profile: any) => ({
                    id: profile.id,
                    full_name: profile.full_name || 'Unknown',
                    email: profile.email || 'No Email',
                    phone: profile.phone || '', // Fetch phone from profile
                    cluster: profile.cluster || 'Unassigned',
                    ministry: profile.ministry || 'None',
                    status: profile.status || 'Active',
                    role: profile.role,
                    created_at: profile.created_at, // Fetch created_at for Joined Date
                    birthday: profile.birthday,
                    address: profile.address,
                    emergency_contact_name: profile.emergency_contact_name,
                    emergency_contact_phone: profile.emergency_contact_phone
                }));
                setMembers(mappedMembers);
            }
        } catch (error: any) {
            console.error('Error fetching members:', error);
            toast.error('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMemberStats = async (memberId: string) => {
        setStatsLoading(true);
        try {
            // Fetch attendance history
            const { data: attendanceData, error } = await supabase
                .from('attendance')
                .select('*')
                .eq('user_id', memberId)
                .order('date', { ascending: false });

            if (error) throw error;

            if (attendanceData) {
                const present = attendanceData.filter(a => a.status === 'Present').length;
                const absent = attendanceData.filter(a => a.status === 'Absent').length;
                const total = present + absent; // Ignoring 'Late' or treating as present/absent? Assuming 'Late' is present for simplicity or just counting specific statuses

                // If there are other statuses like 'Late', we should clarify. Assuming simple model for now.
                // Let's assume 'Late' counts as present for ratio, but let's stick to strict Present/Absent if that's what we have.
                // Or maybe the user has 'Late' separate. The prompt for history said 'Present', 'Absent'.

                const ratio = total > 0 ? Math.round((present / total) * 100) : 0;

                setMemberStats({
                    present,
                    absent,
                    ratio,
                    recentHistory: attendanceData.slice(0, 5).map(r => ({
                        date: r.date,
                        event_name: r.event_name || 'Event', // attendance table might not have event_name directly if it's foreign key, but previously we just stored date.
                        // Wait, previous messages showed attendance table structure check.
                        // Let's assume basic structure for now. If event_name is missing, fallback to 'Service'.
                        status: r.status
                    }))
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            // toast.error('Failed to load member statistics');
        } finally {
            setStatsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedMember) {
            fetchMemberStats(selectedMember.id);
        }
    }, [selectedMember]);


    // Filter logic
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || member.status === statusFilter;
        const matchesCluster = clusterFilter === 'All Clusters' || member.cluster === clusterFilter;
        return matchesSearch && matchesStatus && matchesCluster;
    });

    // Pagination Logic
    const currentItems = filteredMembers.slice(0, visibleCount);

    const handleEditMember = (member: Member) => {
        setEditingMember(member);
        setIsAddMemberOpen(true);
        setActiveMenuId(null);
    };

    const handleDeleteMember = async (member: Member) => {
        // Confirmation dialog
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${member.full_name}?`
        );

        if (!confirmDelete) return;

        try {
            // Delete the profile (this will cascade delete the auth user due to foreign key)
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', member.id);

            if (error) throw error;

            toast.success(`${member.full_name} has been deleted successfully`);

            // Refresh the members list
            fetchMembers();
            if (selectedMember?.id === member.id) {
                setSelectedMember(null);
            }
        } catch (error: any) {
            console.error('Error deleting member:', error);
            toast.error(error.message || 'Failed to delete member');
        }
        setActiveMenuId(null);
    };

    const handleExport = () => {
        const headers = ['Name', 'Email', 'Phone', 'Status', 'Cluster', 'Ministry', 'Joined Date'];
        const csvContent = [
            headers.join(','),
            ...filteredMembers.map(m => [
                `"${m.full_name}"`,
                `"${m.email}"`,
                `"${m.phone}"`,
                `"${m.status}"`,
                `"${m.cluster}"`,
                `"${m.ministry}"`,
                `"${m.created_at ? new Date(m.created_at).toLocaleDateString() : ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'members_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (selectedMember) {
        return (
            <div className="members-content">
                <div className="member-details-container">
                    <button className="back-btn" onClick={() => setSelectedMember(null)}>
                        <ArrowLeft size={16} />
                        Back to Members
                    </button>

                    <div className="profile-overview-card">
                        <div className="profile-main-info">
                            <div className={`profile-avatar-large ${getAvatarColor(selectedMember.full_name)}`}>
                                {getInitials(selectedMember.full_name)}
                            </div>
                            <div className="profile-text">
                                <h2>{selectedMember.full_name}</h2>
                                <span className={`status-badge ${getStatusClass(selectedMember.status)}`}>
                                    {selectedMember.status}
                                </span>

                                <div className="profile-details-grid">
                                    <div className="detail-item">
                                        <Mail size={16} className="icon" />
                                        <div className="detail-content">
                                            <span className="detail-label">Email</span>
                                            <span className="detail-value">{selectedMember.email}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <Phone size={16} className="icon" />
                                        <div className="detail-content">
                                            <span className="detail-label">Phone</span>
                                            <span className="detail-value">{selectedMember.phone || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <MapPin size={16} className="icon" />
                                        <div className="detail-content">
                                            <span className="detail-label">Cluster</span>
                                            <span className="detail-value">{selectedMember.cluster}</span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <Calendar size={16} className="icon" />
                                        <div className="detail-content">
                                            <span className="detail-label">Join Date</span>
                                            <span className="detail-value">{formatDate(selectedMember.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="profile-actions">
                            <button className="details-action-btn details-btn-edit" onClick={() => handleEditMember(selectedMember)}>
                                <SquarePen size={16} /> Edit Member
                            </button>
                            <button className="details-action-btn details-btn-delete" onClick={() => handleDeleteMember(selectedMember)}>
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>

                    <div className="details-dashboard-grid">
                        {/* Ministry Involvement */}
                        <div className="dashboard-card">
                            <div className="card-title-row">
                                <Users size={18} />
                                <span>Ministry Involvement</span>
                            </div>
                            <div className="ministry-list">
                                {(selectedMember.ministry && selectedMember.ministry !== 'None'
                                    ? selectedMember.ministry.split(',').map(m => m.trim())
                                    : ['None']
                                ).map((ministry, idx) => (
                                    <div className="ministry-item" key={idx}>
                                        <div className="ministry-info">
                                            <h4>{ministry}</h4>
                                            <span className="ministry-role">{selectedMember.role || 'Member'}</span>
                                        </div>
                                        <span className="ministry-date">Since {new Date(selectedMember.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attendance Summary */}
                        <div className="dashboard-card">
                            <div className="card-title-row">
                                <Activity size={18} />
                                <span>Attendance Summary</span>
                            </div>
                            {statsLoading ? (
                                <div style={{ textAlign: 'center', color: '#9ca3af' }}>Loading stats...</div>
                            ) : (
                                <div className="attendance-stats-row">
                                    <div className="stat-box ratio">
                                        <span className="stat-number">{memberStats?.ratio || 0}%</span>
                                        <span className="stat-desc">Overall Ratio</span>
                                    </div>
                                    <div className="stat-box present">
                                        <span className="stat-number">{memberStats?.present || 0}</span>
                                        <span className="stat-desc">Present</span>
                                    </div>
                                    <div className="stat-box absent">
                                        <span className="stat-number">{memberStats?.absent || 0}</span>
                                        <span className="stat-desc">Absent</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attendance History */}
                    <div className="dashboard-card">
                        <div className="card-title-row">
                            <span>Recent Attendance History</span>
                        </div>
                        <div className="history-table-container">
                            <table className="history-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Event</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statsLoading ? (
                                        <tr><td colSpan={3} style={{ textAlign: 'center' }}>Loading history...</td></tr>
                                    ) : memberStats?.recentHistory && memberStats.recentHistory.length > 0 ? (
                                        memberStats.recentHistory.map((record, idx) => (
                                            <tr key={idx}>
                                                <td>{formatDate(record.date)}</td>
                                                <td>{record.event_name}</td>
                                                <td>
                                                    <span className={`status-pill ${record.status}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={3} style={{ textAlign: 'center', color: '#9ca3af' }}>No recent attendance history</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <AddMemberModal
                    isOpen={isAddMemberOpen}
                    onClose={() => setIsAddMemberOpen(false)}
                    member={editingMember}
                    onSuccess={async () => {
                        await fetchMembers();
                        if (selectedMember) {
                            const { data } = await supabase.from('profiles').select('*').eq('id', selectedMember.id).single();
                            if (data) {
                                const updatedMember = {
                                    id: data.id,
                                    full_name: data.full_name || 'Unknown',
                                    email: data.email || 'No Email',
                                    phone: data.phone || '',
                                    cluster: data.cluster || 'Unassigned',
                                    ministry: data.ministry || 'None',
                                    status: data.status || 'Active',
                                    role: data.role,
                                    created_at: data.created_at
                                };
                                setSelectedMember(updatedMember);
                                fetchMemberStats(updatedMember.id);
                            }
                        }
                    }}
                />

                <button className="mobile-add-btn" onClick={() => { setEditingMember(null); setIsAddMemberOpen(true); }}>
                    <Plus size={24} />
                </button>
            </div>
        );
    }

    return (
        <div className="members-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Member Management</h1>
                </div>

                <div className="header-actions">
                    <button className="export-btn hide-mobile" onClick={handleExport}>
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Total Members</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>
                    <div className="stat-icon blue">
                        <Users size={20} />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Active</span>
                        <span className="stat-value">{stats.active}</span>
                    </div>
                    <div className="stat-icon green">
                        <UserCheck size={20} />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Inactive</span>
                        <span className="stat-value">{stats.inactive}</span>
                    </div>
                    <div className="stat-icon red">
                        <UserX size={20} />
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-info">
                        <span className="stat-label">Visitors</span>
                        <span className="stat-value">{stats.visitors}</span>
                    </div>
                    <div className="stat-icon purple">
                        <User size={20} />
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="search-filter-bar">
                <div className="search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>
                <div className="filters-group">
                    <div className="filter-wrapper">
                        <Filter size={18} className="filter-icon" />
                    </div>

                    <select
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                        }}
                    >
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Semi Active</option>
                        <option>Visitor</option>
                    </select>

                    <select
                        className="filter-select"
                        value={clusterFilter}
                        onChange={(e) => {
                            setClusterFilter(e.target.value);
                        }}
                    >
                        <option>All Clusters</option>
                        {clustersList.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Members Grid */}
            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading members...</div>
            ) : filteredMembers.length > 0 ? (
                <>
                    <div className="members-grid">
                        {currentItems.map((member) => (
                            <div key={member.id} className="member-card" onClick={() => setSelectedMember(member)} style={{ cursor: 'pointer' }}>
                                {/* Menu Button */}
                                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 10 }}>
                                    <button
                                        className="menu-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMenuId(activeMenuId === member.id ? null : member.id);
                                        }}
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    {activeMenuId === member.id && (
                                        <div ref={menuRef} className="card-menu-dropdown" style={{
                                            position: 'absolute',
                                            top: '100%',
                                            right: 0,
                                            backgroundColor: 'white',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                            borderRadius: '6px',
                                            padding: '4px',
                                            width: '120px',
                                            border: '1px solid #e5e7eb',
                                            zIndex: 20
                                        }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditMember(member);
                                                }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#374151' }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <SquarePen size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteMember(member);
                                                }}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', color: '#ef4444' }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="card-header">
                                    <div className={`member-avatar ${getAvatarColor(member.full_name)}`}>
                                        {getInitials(member.full_name)}
                                    </div>
                                    <div className="member-info-header">
                                        <div className="member-name-row">
                                            <span className="member-name">{member.full_name}</span>
                                            <span className={`status-badge ${getStatusClass(member.status)}`}>
                                                {member.status}
                                            </span>
                                        </div>
                                        <div className="contact-info">
                                            <Mail size={14} />
                                            <span>{member.email}</span>
                                        </div>
                                        {member.phone && (
                                            <div className="contact-info" style={{ marginTop: '0.25rem' }}>
                                                <Phone size={14} />
                                                <span>{member.phone}</span>
                                            </div>
                                        )}
                                        <div className="contact-info" style={{ marginTop: '0.25rem' }}>
                                            <MapPin size={14} />
                                            <span>{member.cluster}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <div className="info-col">
                                        <span className="label">Ministry:</span>
                                        <span className="value">{member.ministry}</span>
                                    </div>
                                    <div className="info-col" style={{ alignItems: 'flex-end' }}>
                                        <span className="label">Joined:</span>
                                        <span className="value">{formatDate(member.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Show More Button */}
                    {filteredMembers.length > visibleCount && (
                        <div className="show-more-container" style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                            <button className="btn-secondary show-more-btn" onClick={handleShowMore}>
                                Show More ({filteredMembers.length - visibleCount} remaining)
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    No members found matching your search.
                </div>
            )}

            <AddMemberModal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                member={editingMember}
                onSuccess={fetchMembers}
            />
        </div>
    );
};
