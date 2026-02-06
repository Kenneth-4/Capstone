import { useState } from 'react';
import {
    Moon,
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Users,
    GraduationCap,
    PartyPopper,
    Clock,
    MapPin,
    User as UserIcon
} from 'lucide-react';
import './Reservation.css';
import { NewReservationModal } from './NewReservationModal';
import { UserProfile } from '../../components/UserProfile';

// Mock Data
const upcomingReservations = [
    {
        id: 1,
        title: 'Coordinator Meetings',
        date: '2024-12-15',
        time: '02:00 PM',
        location: 'Main Sanctuary',
        organizer: 'Maria Santos',
        status: 'APPROVED',
        icon: CalendarIcon,
        iconClass: 'icon-green'
    },
    {
        id: 2,
        title: 'Youth Fellowship',
        date: '2024-11-25',
        time: '06:00 PM',
        location: 'Fellowship Hall',
        organizer: 'Juan Dela Cruz',
        status: 'APPROVED',
        icon: Users,
        iconClass: 'icon-green'
    },
    {
        id: 3,
        title: 'Cluster Leader Seminar',
        date: '2024-11-30',
        time: '03:00 PM',
        location: 'Multi-purpose Room',
        organizer: 'Rosa Martinez',
        status: 'PENDING',
        icon: GraduationCap,
        iconClass: 'icon-orange' // Simulating the yellowish icon from image
    },
    {
        id: 4,
        title: 'YP Culminating Activity',
        date: '2024-12-01',
        time: '08:00 PM',
        location: 'Prayer Room',
        organizer: 'Miguel Torres',
        status: 'APPROVED',
        icon: PartyPopper,
        iconClass: 'icon-green'
    }
];

// Simple Calendar Grid Mock
const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const dates = [
    1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28,
    29, 30, 31
];

export const Reservation = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="reservation-content">
            {/* Header */}
            <header className="top-bar">
                <div className="page-title">
                    <h1>Reservation</h1>
                </div>

                <div className="top-actions">
                    <button className="theme-toggle">
                        <Moon size={20} />
                    </button>

                    <UserProfile />
                </div>
            </header>

            <div className="reservation-container">
                {/* Controls */}
                <div className="reservation-controls">
                    <input type="text" className="res-search-input" placeholder="Search by ID or Type..." />
                    <button className="add-res-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        Add Reservation
                    </button>
                </div>

                {/* Stats */}
                <div className="res-stats-grid">
                    <div className="res-stat-card">
                        <span className="res-stat-title">Total Reservation</span>
                        <span className="res-stat-value">6</span>
                    </div>
                    <div className="res-stat-card">
                        <span className="res-stat-title">Approved</span>
                        <span className="res-stat-value">2</span>
                    </div>
                    <div className="res-stat-card">
                        <span className="res-stat-title">Pending</span>
                        <span className="res-stat-value">3</span>
                    </div>
                    <div className="res-stat-card">
                        <span className="res-stat-title">Rejected</span>
                        <span className="res-stat-value">1</span>
                    </div>
                </div>

                {/* Main Content: Calendar + List */}
                <div className="res-main-layout">
                    {/* Left: Calendar */}
                    <div className="calendar-card">
                        <div className="calendar-header">
                            <h3 className="calendar-title">View Calendar</h3>
                        </div>

                        <div className="calendar-header" style={{ marginBottom: '1rem' }}>
                            <span className="calendar-nav-title">May 2023</span>
                            <div className="calendar-nav-btns">
                                <button className="c-nav-btn"><ChevronLeft size={16} /></button>
                                <button className="c-nav-btn"><ChevronRight size={16} /></button>
                            </div>
                        </div>

                        <div className="calendar-grid">
                            {days.map(day => (
                                <div key={day} className="c-day-label">{day}</div>
                            ))}
                            {dates.map(date => (
                                <div key={date} className={`c-date ${date === 18 ? 'active' : ''}`}>
                                    {date}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Upcoming List */}
                    <div className="upcoming-section">
                        <h3 className="section-title">Upcoming Reservations</h3>

                        <div className="res-list">
                            {upcomingReservations.map(res => (
                                <div key={res.id} className="res-card">
                                    <div className={`res-icon-box ${res.iconClass}`}>
                                        <res.icon size={24} />
                                    </div>
                                    <div className="res-details">
                                        <span className="res-name">{res.title}</span>
                                        <div className="res-meta">
                                            <div className="res-meta-item">
                                                <Clock size={14} />
                                                <span>{res.date} • {res.time}</span>
                                            </div>
                                            <div className="res-meta-item">
                                                <MapPin size={14} />
                                                <span>{res.location}</span>
                                            </div>
                                            <div className="res-meta-item">
                                                <UserIcon size={14} />
                                                <span>{res.organizer}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`res-badge ${res.status === 'APPROVED' ? 'badge-approved' : 'badge-pending'}`}>
                                        {res.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <NewReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};
