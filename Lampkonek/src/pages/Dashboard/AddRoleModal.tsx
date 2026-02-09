import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AddRoleModal.css';

interface AddRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (roleData: { name: string; description: string; permissions: string[] }) => Promise<void>;
    initialData?: { name: string; description: string; permissions: string[] } | null;
}

export const AddRoleModal = ({ isOpen, onClose, onSave, initialData }: AddRoleModalProps) => {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setRoleName(initialData.name);
                setDescription(initialData.description || '');
            } else {
                setRoleName('');
                setDescription('');
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!roleName.trim()) return;

        setLoading(true);
        try {
            await onSave({
                name: roleName,
                description,
                permissions: [] // Permissions removed from UI but kept in schema for compatibility
            });
            onClose();
        } catch (error) {
            console.error('Failed to save role:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="role-modal-overlay">
            <div className="role-modal-content">
                <div className="role-modal-header">
                    <h3>{initialData ? 'Edit Role' : 'Create New Role'}</h3>
                    <button className="role-close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="role-modal-body">
                    <div className="role-form-group">
                        <label className="role-label" htmlFor="roleName">Role Name</label>
                        <input
                            id="roleName"
                            type="text"
                            className="role-input"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="e.g. Ministry Treasurer"
                            autoFocus
                        />
                    </div>

                    <div className="role-form-group">
                        <label className="role-label" htmlFor="roleDesc">Description</label>
                        <textarea
                            id="roleDesc"
                            className="role-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the responsibilities and access level for this role..."
                            rows={3}
                        />
                    </div>
                </div>

                <div className="role-modal-footer">
                    <button className="role-btn-cancel" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>
                    <button
                        className="role-btn-save"
                        onClick={handleSave}
                        disabled={loading || !roleName.trim()}
                    >
                        {loading ? 'Saving...' : (initialData ? 'Save Changes' : 'Create Role')}
                    </button>
                </div>
            </div>
        </div>
    );
};
