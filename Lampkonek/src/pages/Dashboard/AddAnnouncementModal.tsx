import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AddAnnouncementModal.css';

interface AddAnnouncementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { title: string; status: string }) => Promise<void>;
    initialData?: {
        title: string;
        status: string;
    } | null;
}

export const AddAnnouncementModal = ({
    isOpen,
    onClose,
    onSave,
    initialData
}: AddAnnouncementModalProps) => {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('Active');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTitle(initialData.title);
                setStatus(initialData.status);
            } else {
                setTitle('');
                setStatus('Active');
            }
        }
    }, [isOpen, initialData]);

    const handleSave = async () => {
        if (!title.trim()) return; // Should be handled by parent or here. Let's let parent validate or do it here.
        // Actually Settings.tsx had validation. I'll pass the data to onSave and let it handle or handle validation here.
        // I will do validation inside Settings.tsx which is already there, but here I should probably block empty save if possible.
        // But for consistency with AddRoleModal, let's just call onSave.
        // Wait, AddRoleModal handles save internally? No, it calls onSave.
        // In Settings.tsx: handleAddAnnouncement checks validation.

        try {
            setLoading(true);
            await onSave({ title, status });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Determine isEditing based on initialData presence
    const isEditing = !!initialData;

    if (!isOpen) return null;

    return (
        <div className="announcement-modal-overlay">
            <div className="announcement-modal-content">
                <div className="announcement-modal-header">
                    <h3>{isEditing ? 'Edit Announcement' : 'New Announcement'}</h3>
                    <button className="announcement-close-btn" onClick={onClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="announcement-modal-body">
                    <div className="announcement-form-group">
                        <label className="announcement-label">Title</label>
                        <input
                            type="text"
                            className="announcement-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter announcement title"
                            disabled={loading}
                        />
                    </div>
                    <div className="announcement-form-group">
                        <label className="announcement-label">Status</label>
                        <select
                            className="announcement-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={loading}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="announcement-modal-footer">
                    <button
                        className="announcement-btn-cancel"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="announcement-btn-save"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Announcement')}
                    </button>
                </div>
            </div>
        </div>
    );
};
