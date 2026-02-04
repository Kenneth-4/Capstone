import {
    Download,
    Plus,
    Search,
    Calendar as CalendarIcon,
    Filter,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Moon,
    User,
    Bell,
    Settings as SettingsIcon
} from 'lucide-react';
import './Attendance.css';

const attendanceData = [
    { id: 1, name: 'John Doe', initials: 'JD', status: 'Present', cluster: 'Cluster A', event: 'Sunday Service', avatarColor: 'avatar-purple' },
    { id: 2, name: 'Jane Doe', initials: 'JD', status: 'Absent', cluster: 'Cluster B', event: 'Sunday Service', avatarColor: 'avatar-orange' },
    { id: 3, name: 'Michael Smith', initials: 'MS', status: 'Present', cluster: 'Cluster A', event: 'Sunday Service', avatarColor: 'avatar-blue' },
    { id: 4, name: 'Sarah Wilson', initials: 'SW', status: 'Absent', cluster: 'Cluster C', event: 'Sunday Service', avatarColor: 'avatar-purple' },
    { id: 5, name: 'Robert Brown', initials: 'RB', status: 'Present', cluster: 'Cluster B', event: 'Sunday Service', avatarColor: 'avatar-pink' },
];

export const Attendance = () => {
    return (
        <div className="attendance-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Attendance</h1>
                    <p>Manage and track member attendance records</p>
                </div>

                <div className="top-actions">
                    <button className="theme-toggle">
                        <Moon size={20} />
                    </button>

                    <button className="theme-toggle">
                        <Bell size={20} />
                    </button>

                    <div className="user-profile">
                        <div className="user-info">
                            <span className="user-name">Ministry Leader</span>
                            <span className="user-role">ADMIN</span>
                        </div>
                        <div className="avatar">
                            <User size={20} />
                        </div>
                    </div>
                </div>
            </header>

            <div className="attendance-container">
                {/* Actions & Filters */}
                <div className="header-actions" style={{ justifyContent: 'flex-end', marginBottom: '-0.5rem' }}>
                    <button className="export-btn">
                        <Download size={16} />
                        Export CSV
                    </button>
                    <button className="take-attendance-btn">
                        <Plus size={16} />
                        Take Attendance
                    </button>
                </div>

                <div className="attendance-table-card">
                    {/* Filter Row inside card like standard lists sometimes, or separate. Image shows controls above table. 
                        Wait, Image shows controls in a white bar. Let's put them in a container above table.
                    */}
                    <div className="attendance-filters" style={{ borderBottom: '1px solid #f3f4f6', borderRadius: '12px 12px 0 0' }}>
                        <div className="controls-row">
                            <div className="filter-search">
                                <Search size={18} />
                                <input type="text" placeholder="Search by name..." />
                            </div>

                            <div className="filter-select-wrapper">
                                <select className="filter-select-input">
                                    <option>All Events</option>
                                    <option>Sunday Service</option>
                                    <option>Prayer Meeting</option>
                                </select>
                            </div>

                            <div className="filter-date">
                                <input type="text" placeholder="mm/dd/yyyy" />
                                <CalendarIcon size={16} style={{ marginRight: '0.5rem', opacity: 0.5 }} />
                            </div>

                            <button className="filter-icon-btn">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>STATUS</th>
                                <th>CLUSTER</th>
                                <th>EVENT</th>
                                <th style={{ textAlign: 'right' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className={`avatar-circle ${item.avatarColor}`}>
                                                {item.initials}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${item.status === 'Present' ? 'pill-present' : 'pill-absent'}`}>
                                            <span className={`status-dot ${item.status === 'Present' ? 'dot-present' : 'dot-absent'}`}></span>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{item.cluster}</td>
                                    <td>{item.event}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button className="action-btn">
                                            <Edit2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div className="table-footer">
                        <div className="showing-text">Showing 1 to 5 of 48 entries</div>

                        <div className="pagination-controls">
                            <div className="per-page">
                                <span>Per Page</span>
                                <select>
                                    <option>10</option>
                                    <option>20</option>
                                </select>
                            </div>

                            <div className="page-numbers">
                                <button className="page-nav-btn"><ChevronLeft size={16} /></button>
                                <button className="page-num active">1</button>
                                <button className="page-num">2</button>
                                <button className="page-num">3</button>
                                <span style={{ padding: '0 0.25rem', display: 'flex', alignItems: 'center', color: '#9ca3af' }}>...</span>
                                <button className="page-num">10</button>
                                <button className="page-nav-btn"><ChevronRight size={16} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Footer */}
                    <div className="attendance-summary">
                        <div className="summary-item">
                            <span className="summary-dot dot-present"></span>
                            <span>Present (32)</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-dot dot-absent"></span>
                            <span>Absent (16)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
