import React, { useState } from 'react';
import { X } from 'lucide-react';
import './AttendanceChecklistModal.css';

interface AttendanceChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Mock Data for the checklist
const initialEmployees = [
    { id: 1, name: 'John Doe', remarks: '', isPresent: false },
    { id: 2, name: 'Jane Smith', remarks: '', isPresent: true },
    { id: 3, name: 'Alice Johnson', remarks: 'Late', isPresent: true },
    { id: 4, name: 'Robert Brown', remarks: '', isPresent: false },
    { id: 5, name: 'Michael White', remarks: 'Sick leave', isPresent: false },
    { id: 6, name: 'Emily Davis', remarks: '', isPresent: true },
    { id: 7, name: 'David Wilson', remarks: '', isPresent: true },
    { id: 8, name: 'Sarah Miller', remarks: '', isPresent: true },
];

export const AttendanceChecklistModal: React.FC<AttendanceChecklistModalProps> = ({ isOpen, onClose }) => {
    const [employees, setEmployees] = useState(initialEmployees);

    if (!isOpen) return null;

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

                <div className="checklist-body">
                    <table className="checklist-table">
                        <thead>
                            <tr>
                                <th style={{ width: '35%' }}>Employee Name</th>
                                <th style={{ width: '45%' }}>Remarks</th>
                                <th style={{ width: '20%', textAlign: 'center' }}>Present</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td className="employee-info">{emp.name}</td>
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
