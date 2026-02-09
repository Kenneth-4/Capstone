import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AddClusterModal.css';

interface AddClusterModalProps {
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

export const AddClusterModal = ({
    isOpen,
    onClose,
    onSave,
    initialData
}: AddClusterModalProps) => {
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
        <div className="cluster-modal-overlay">
            <div className="cluster-modal-content">
                <div className="cluster-modal-header">
                    <h3>{isEditing ? 'Edit Cluster' : 'Add New Cluster'}</h3>
                    <button className="cluster-close-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="cluster-modal-body">
                    <div className="cluster-form-group">
                        <label className="cluster-label">Cluster Name</label>
                        <input
                            type="text"
                            className="cluster-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. North Cluster"
                            disabled={loading}
                        />
                    </div>
                    <div className="cluster-form-group">
                        <label className="cluster-label">Assigned Leader</label>
                        <input
                            type="text"
                            className="cluster-input"
                            value={leader}
                            onChange={(e) => setLeader(e.target.value)}
                            placeholder="Full name of leader"
                            disabled={loading}
                        />
                    </div>
                    <div className="cluster-form-group">
                        <label className="cluster-label">Meeting Schedule (Optional)</label>
                        <input
                            type="text"
                            className="cluster-input"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            placeholder="e.g. Fridays 7:00 PM"
                            disabled={loading}
                        />
                    </div>
                    <div className="cluster-form-group">
                        <label className="cluster-label">Description (Optional)</label>
                        <textarea
                            className="cluster-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this cluster..."
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="cluster-modal-footer">
                    <button
                        className="cluster-btn-cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="cluster-btn-save"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Cluster')}
                    </button>
                </div>
            </div>
        </div>
    );
};
