import { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    Moon,
    Plus, // Added Plus import
} from 'lucide-react';
import './Members.css';
import { AddMemberModal } from './AddMemberModal';
import { UserProfile } from '../../components/UserProfile';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Member {
    id: string;
    full_name: string;
    email: string;
    cluster: string;
    ministry: string;
    status: string;
    role: string;
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Active': return 'status-active';
        case 'Inactive': return 'status-inactive';
        case 'Semi Active': return 'status-semi-active';
        case 'Transferred': return 'status-transferred';
        case 'Deceased': return 'status-deceased';
        case 'Visitor': return 'status-visitor';
        default: return 'status-active'; // Default style
    }
};

export const Members = () => {
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [editingMember, setEditingMember] = useState<Member | null>(null);

    // Fetch members from Supabase
    const fetchMembers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('full_name', { ascending: true });

            if (error) throw error;

            if (data) {
                // Map the data to ensure all fields exist (handling nulls from DB)
                const mappedMembers = data.map((profile: any) => ({
                    id: profile.id,
                    full_name: profile.full_name || 'Unknown',
                    email: profile.email || 'No Email',
                    cluster: profile.cluster || 'Unassigned',
                    ministry: profile.ministry || 'None',
                    status: profile.status || 'Active',
                    role: profile.role
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

    // Filter logic
    const filteredMembers = members.filter(member => {
        const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || member.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleEditMember = (member: Member) => {
        setEditingMember(member);
        setIsAddMemberOpen(true);
    };

    const handleDeleteMember = async (member: Member) => {
        // Confirmation dialog
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${member.full_name}?\n\nThis action cannot be undone and will permanently remove:\n- User account\n- Profile data\n- All associated records`
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
        } catch (error: any) {
            console.error('Error deleting member:', error);
            toast.error(error.message || 'Failed to delete member');
        }
    };

    return (
        <div className="members-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Members</h1>

                </div>

                <div className="top-actions">
                    <button className="theme-toggle">
                        <Moon size={20} />
                    </button>

                    <div className="user-profile-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                        <UserProfile />
                    </div>
                </div>
            </header>

            <div className="members-container">
                {/* Controls */}
                <div className="members-controls">
                    <div className="search-filter-group">
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search members..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="dropdown-filter">
                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option>All Status</option>
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Semi Active</option>
                                <option>Transferred</option>
                                <option>Visitor</option>
                            </select>
                        </div>
                        <button className="filter-btn">
                            <Filter size={18} />
                        </button>
                    </div>

                </div>

                {/* Table */}
                <div className="table-container">
                    {loading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading members...</div>
                    ) : (
                        <table className="members-table">
                            <thead>
                                <tr>
                                    <th>NAME <ChevronsUpDown size={14} className="sort-icon" /></th>
                                    <th>EMAIL <ChevronsUpDown size={14} className="sort-icon" /></th>
                                    <th>CLUSTER <ChevronsUpDown size={14} className="sort-icon" /></th>
                                    <th>STATUS <ChevronsUpDown size={14} className="sort-icon" /></th>
                                    <th>MINISTRY <ChevronsUpDown size={14} className="sort-icon" /></th>
                                    <th>ROLE <ChevronsUpDown size={14} className="sort-icon" /></th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map((member) => (
                                        <tr key={member.id}>
                                            <td className="member-name">{member.full_name}</td>
                                            <td>{member.email}</td>
                                            <td>{member.cluster}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(member.status)}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td>{member.ministry}</td>
                                            <td style={{ textTransform: 'capitalize' }}>{member.role?.replace('_', ' ')}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                                    <button
                                                        className="action-link"
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6366f1', padding: 0, fontWeight: 500 }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleEditMember(member);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <span style={{ color: '#e5e7eb' }}>|</span>
                                                    <button
                                                        className="action-link"
                                                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444', padding: 0, fontWeight: 500 }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteMember(member);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No members found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination - Visual Only for now */}
                    {!loading && filteredMembers.length > 0 && (
                        <div className="pagination-container">
                            <div className="per-page-select">
                                <span>Per Page</span>
                                <select className="page-select-input">
                                    <option>20</option>
                                    <option>50</option>
                                    <option>100</option>
                                </select>
                            </div>

                            <div className="pagination-controls">
                                <button className="page-btn" disabled>
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="pagination-info">
                                Showing {filteredMembers.length} entries
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddMemberModal
                isOpen={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                member={editingMember}
                onSuccess={fetchMembers}
            />
        </div>
    );
};
