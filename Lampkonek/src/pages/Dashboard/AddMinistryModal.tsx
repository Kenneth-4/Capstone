import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AddMinistryModal.css';

interface AddMinistryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; leader: string; description: string; schedule: string }) => Promise<void>;
    initialData?: {
        name: string;
        leader: string;
        description: string;
        schedule?: string;
    };
}

export const AddMinistryModal = ({
    isOpen,
    onClose,
    onSave,
    initialData
}: AddMinistryModalProps) => {
    const [name, setName] = useState('');
    const [leader, setLeader] = useState('');
    const [description, setDescription] = useState('');
    const [schedule, setSchedule] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name);
                setLeader(initialData.leader);
                setDescription(initialData.description);
                setSchedule(initialData.schedule || '');
            } else {
                setName('');
                setLeader('');
                setDescription('');
                setSchedule('');
            }
        }
    }, [isOpen, initialData]);

    const handleSave = async () => {
        if (!name.trim()) return;

        try {
            setLoading(true);
            await onSave({ name, leader, description, schedule });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isEditing = !!initialData;

    if (!isOpen) return null;

    return (
        <div className="ministry-modal-overlay">
            <div className="ministry-modal-content">
                <div className="ministry-modal-header">
                    <h3>{isEditing ? 'Edit Ministry' : 'Add New Ministry'}</h3>
                    <button className="ministry-close-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="ministry-modal-body">
                    <div className="ministry-form-group">
                        <label className="ministry-label">Ministry Name</label>
                        <input
                            type="text"
                            className="ministry-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Worship Team"
                            disabled={loading}
                        />
                    </div>
                    <div className="ministry-form-group">
                        <label className="ministry-label">Ministry Head</label>
                        <input
                            type="text"
                            className="ministry-input"
                            value={leader}
                            onChange={(e) => setLeader(e.target.value)}
                            placeholder="Full name of leader"
                            disabled={loading}
                        />
                    </div>
                    <div className="ministry-form-group">
                        <label className="ministry-label">Rehearsal/Meeting Schedule (Optional)</label>
                        <input
                            type="text"
                            className="ministry-input"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            placeholder="e.g. Saturdays 5:00 PM"
                            disabled={loading}
                        />
                    </div>
                    <div className="ministry-form-group">
                        <label className="ministry-label">Description (Optional)</label>
                        <textarea
                            className="ministry-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this ministry..."
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="ministry-modal-footer">
                    <button
                        className="ministry-btn-cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="ministry-btn-save"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Ministry')}
                    </button>
                </div>
            </div>
        </div>
    );
};
