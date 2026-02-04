import {
    Search,
    Filter,
    Plus,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    Moon,
    User,
    Settings
} from 'lucide-react';
import './Members.css';

// Mock Data
const membersData = [
    { id: '01', name: 'Jane Doe', email: 'JaneDoe@gmail.com', cluster: 'Cluster B', status: 'Active', ministry: 'Ushering' },
    { id: '01', name: 'John Smith', email: 'JohnSmith@gmail.com', cluster: 'Cluster C', status: 'Semi Active', ministry: 'Music Ministry' },
    { id: '01', name: 'Alice Wong', email: 'AliceWong@gmail.com', cluster: 'Cluster D', status: 'Transferred', ministry: 'MMPM' },
    { id: '01', name: 'Bob Roberts', email: 'BobRoberts@gmail.com', cluster: 'Cluster A', status: 'Inactive', ministry: 'Worship' },
    { id: '01', name: 'Jane Doe', email: 'JaneDoe@gmail.com', cluster: 'Cluster B', status: 'Active', ministry: 'Ushering' },
    { id: '01', name: 'Maria Garcia', email: 'MariaG@gmail.com', cluster: 'Cluster B', status: 'Deceased', ministry: 'Ushering' },
    { id: '01', name: 'David Lee', email: 'DavidLee@gmail.com', cluster: 'Cluster B', status: 'Visitor', ministry: 'Ushering' },
    { id: '01', name: 'Jane Doe', email: 'JaneDoe@gmail.com', cluster: 'Cluster B', status: 'Active', ministry: 'Ushering' },
    { id: '01', name: 'Jane Doe', email: 'JaneDoe@gmail.com', cluster: 'Cluster B', status: 'Active', ministry: 'Ushering' },
    { id: '01', name: 'Jane Doe', email: 'JaneDoe@gmail.com', cluster: 'Cluster B', status: 'Active', ministry: 'Ushering' },
];

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Active': return 'status-active';
        case 'Inactive': return 'status-inactive';
        case 'Semi Active': return 'status-semi-active';
        case 'Transferred': return 'status-transferred';
        case 'Deceased': return 'status-deceased';
        case 'Visitor': return 'status-visitor';
        default: return '';
    }
};

export const Members = () => {
    return (
        <div className="members-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Members</h1>
                    <p>Manage and track your ministry members</p>
                </div>

                <div className="top-actions">
                    <button className="theme-toggle">
                        <Moon size={20} />
                    </button>

                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">Ministry Leader</span>
                            <span className="user-role">ADMIN</span>
                        </div>
                        <div className="avatar">
                            <User size={20} />
                        </div>
                        <Settings size={20} style={{ color: '#9ca3af', cursor: 'pointer', marginLeft: '0.5rem' }} />
                    </div>
                </div>
            </header>

            <div className="members-container">
                {/* Controls */}
                <div className="members-controls">
                    <div className="search-filter-group">
                        <div className="search-box">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Search members..." className="search-input" />
                        </div>
                        <div className="dropdown-filter">
                            <select className="filter-select">
                                <option>All Status</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <button className="filter-btn">
                            <Filter size={18} />
                        </button>
                    </div>

                    <button className="add-member-btn">
                        <Plus size={18} />
                        ADD NEW MEMBER
                    </button>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="members-table">
                        <thead>
                            <tr>
                                <th>ID <ChevronsUpDown size={14} className="sort-icon" /></th>
                                <th>NAME <ChevronsUpDown size={14} className="sort-icon" /></th>
                                <th>EMAIL <ChevronsUpDown size={14} className="sort-icon" /></th>
                                <th>CLUSTER <ChevronsUpDown size={14} className="sort-icon" /></th>
                                <th>STATUS <ChevronsUpDown size={14} className="sort-icon" /></th>
                                <th>MINISTRY <ChevronsUpDown size={14} className="sort-icon" /></th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {membersData.map((member, index) => (
                                <tr key={index}>
                                    <td>{member.id}</td>
                                    <td className="member-name">{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.cluster}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(member.status)}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td>{member.ministry}</td>
                                    <td>
                                        <a href="#" className="action-link">Edit</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
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
                            <button className="page-btn active">01</button>
                            <button className="page-btn">2</button>
                            <button className="page-btn">3</button>
                            <span style={{ color: '#9ca3af', margin: '0 0.25rem' }}>...</span>
                            <button className="page-btn">99</button>
                            <button className="page-btn">
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="pagination-info">
                            Showing 1 to 10 of 275 members
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
