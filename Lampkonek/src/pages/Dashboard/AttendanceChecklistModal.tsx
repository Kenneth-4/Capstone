import React, { useState } from 'react';
import { X, Search, Filter } from 'lucide-react';
import './AttendanceChecklistModal.css';

interface AttendanceChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock Data for the checklist
const initialEmployees = [
    { id: 1, name: 'John Doe', ministry: 'Worship Team', remarks: '', isPresent: false },
    { id: 2, name: 'Jane Smith', ministry: 'Kids Ministry', remarks: '', isPresent: true },
    { id: 3, name: 'Alice Johnson', ministry: 'Ushers', remarks: 'Late', isPresent: true },
    { id: 4, name: 'Robert Brown', ministry: 'Media', remarks: '', isPresent: false },
    { id: 5, name: 'Michael White', ministry: 'Adult Ministry', remarks: 'Sick leave', isPresent: false },
    { id: 6, name: 'Emily Davis', ministry: 'Youth Ministry', remarks: '', isPresent: true },
    { id: 7, name: 'David Wilson', ministry: 'Tech Team', remarks: '', isPresent: true },
    { id: 8, name: 'Sarah Miller', ministry: 'Youth Ministry', remarks: '', isPresent: true },
    { id: 9, name: 'James Wilson', ministry: 'Adult Ministry', remarks: '', isPresent: true },
    { id: 10, name: 'Linda Martinez', ministry: 'Kids Ministry', remarks: '', isPresent: false },
];

export const AttendanceChecklistModal: React.FC<AttendanceChecklistModalProps> = ({ isOpen, onClose }) => {
    const [employees, setEmployees] = useState(initialEmployees);
    const [searchTerm, setSearchTerm] = useState('');
    const [ministryFilter, setMinistryFilter] = useState('All');

    if (!isOpen) return null;

    const ministries = ['All', ...new Set(initialEmployees.map(emp => emp.ministry))];

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMinistry = ministryFilter === 'All' || emp.ministry === ministryFilter;
        return matchesSearch && matchesMinistry;
    });

    const handleCheckboxChange = (id: number) => {
        setEmployees(employees.map(emp =>
            emp.id === id ? { ...emp, isPresent: !emp.isPresent } : emp
        ));
    };

    const handleRemarksChange = (id: number, value: string) => {
        setEmployees(employees.map(emp =>
            emp.id === id ? { ...emp, remarks: value } : emp
        ));
    };

    const handleSave = () => {
        console.log('Saved Attendance:', employees);
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container checklist-modal">
                <div className="modal-header">
                    <h2>Attendance Checklist</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="checklist-controls">
                    <div className="search-bar">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-dropdown">
                        <Filter size={20} className="filter-icon" />
                        <select
                            value={ministryFilter}
                            onChange={(e) => setMinistryFilter(e.target.value)}
                        >
                            {ministries.map(ministry => (
                                <option key={ministry} value={ministry}>{ministry}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="checklist-body">
                    <table className="checklist-table">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>Employee Name</th>
                                <th style={{ width: '25%' }}>Ministry</th>
                                <th style={{ width: '35%' }}>Remarks</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>Present</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(emp => (
                                <tr key={emp.id}>
                                    <td className="employee-info">{emp.name}</td>
                                    <td className="employee-ministry">{emp.ministry}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="remarks-input"
                                            placeholder="Add remarks..."
                                            value={emp.remarks}
                                            onChange={(e) => handleRemarksChange(emp.id, e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <div className="checkbox-wrapper">
                                            <input
                                                type="checkbox"
                                                className="checklist-checkbox"
                                                checked={emp.isPresent}
                                                onChange={() => handleCheckboxChange(emp.id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save" onClick={handleSave}>
                        Save Attendance
                    </button>
                </div>
            </div>
        </div>
    );
};
