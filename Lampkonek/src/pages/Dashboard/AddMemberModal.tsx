import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Copy, Check, Save } from 'lucide-react';
import './AddMemberModal.css';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Member {
    id?: string;
    full_name: string;
    email: string;
    phone?: string;
    cluster: string;
    ministry: string;
    status: string;
    role?: string;
    address?: string;
    birthday?: string;
    created_at?: string; // Join Date
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
}

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member?: Member | null;
    onSuccess?: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, member, onSuccess }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        birthDate: '',
        address: '',
        cluster: '',
        ministry: '',
        status: '',
        joinDate: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);
    const [clusterOptions, setClusterOptions] = useState<string[]>([]);
    const [ministryOptions, setMinistryOptions] = useState<string[]>([]);

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(generatedPassword);
        setCopied(true);
        toast.success('Password copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        if (member) {
            setFormData({
                fullName: member.full_name || '',
                email: member.email || '',
                phone: member.phone || '',
                birthDate: member.birthday || '', // Assuming 'birthday' column
                address: member.address || '',    // Assuming 'address' column
                cluster: member.cluster || '',
                ministry: member.ministry || '',
                status: member.status?.toLowerCase() || '',
                joinDate: member.created_at ? new Date(member.created_at).toISOString().split('T')[0] : '', // Format YYYY-MM-DD
                emergencyContactName: member.emergency_contact_name || '',
                emergencyContactPhone: member.emergency_contact_phone || ''
            });
            setGeneratedPassword('');
        } else {
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                birthDate: '',
                address: '',
                cluster: 'Unassigned',
                ministry: '',
                status: '',
                joinDate: new Date().toISOString().split('T')[0],
                emergencyContactName: '',
                emergencyContactPhone: ''
            });
            setGeneratedPassword('');
        }
        setShowPassword(false);
        fetchOptions();
    }, [member, isOpen]);

    const fetchOptions = async () => {
        try {
            const { data: clusters } = await supabase
                .from('clusters')
                .select('name')
                .neq('name', 'Unassigned')
                .order('name');

            if (clusters) setClusterOptions(clusters.map(c => c.name));

            const { data: ministries } = await supabase
                .from('ministries')
                .select('name')
                .order('name');

            if (ministries && ministries.length > 0) {
                setMinistryOptions(ministries.map(m => m.name));
            } else {
                setMinistryOptions(['Worship Team', 'Kids Ministry', 'Ushering', 'Multimedia', 'None']);
            }

        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.email || !formData.status) {
            toast.error('Please fill in required fields (Name, Email, Status)');
            return;
        }

        setIsSubmitting(true);

        try {
            const capitalizedStatus = formData.status.charAt(0).toUpperCase() + formData.status.slice(1);

            const profileData = {
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                birthday: formData.birthDate || null, // Ensure date format matches DB if needed
                address: formData.address,
                cluster: formData.cluster || 'Unassigned',
                ministry: formData.ministry || 'None',
                status: capitalizedStatus,
                created_at: formData.joinDate ? new Date(formData.joinDate).toISOString() : new Date().toISOString(),
                emergency_contact_name: formData.emergencyContactName,
                emergency_contact_phone: formData.emergencyContactPhone
            };

            if (member?.id) {
                // Update existing member
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update(profileData)
                    .eq('id', member.id);

                if (updateError) throw updateError;
                toast.success('Member updated successfully!');
            } else {
                // Add new member
                const tempPassword = `Temp${Math.random().toString(36).slice(-8)}!`;

                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: tempPassword,
                    options: {
                        data: {
                            full_name: formData.fullName,
                            role: 'member'
                        },
                        emailRedirectTo: window.location.origin
                    }
                });

                if (authError) {
                    if (authError.message.includes('already registered')) {
                        throw new Error('A user with this email already exists');
                    }
                    throw authError;
                }

                if (!authData.user) throw new Error('Failed to create user account');

                // Refresh session for admin
                await supabase.auth.refreshSession();

                // Wait for trigger
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Update profile with extra fields
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update(profileData)
                    .eq('id', authData.user.id);

                if (profileError) console.error('Profile update error:', profileError);

                setGeneratedPassword(tempPassword);
                toast.success('Member added successfully! Password is displayed below.');
                setIsSubmitting(false);
                return;
            }

            onClose();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error('Error saving member:', error);
            toast.error(error.message || 'Failed to save member');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>{member ? 'Edit Member' : 'Add Member'}</h2>
                    {/* Back button logic could go here if needed to behave like "Back" in prototype */}
                </div>

                <div className="modal-scroll-content">
                    <form id="member-form" onSubmit={handleSubmit}>

                        {/* Basic Information */}
                        <div className="form-section">
                            <h3 className="section-title">Basic Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Full Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="john.doe@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            {generatedPassword && (
                                <div className="form-group" style={{ marginBottom: '1rem' }}>
                                    <label>Generated Password <span style={{ color: '#10b981', fontSize: '0.8rem' }}>(Copy this!)</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-input"
                                            value={generatedPassword}
                                            readOnly
                                            style={{
                                                width: '100%',
                                                paddingRight: '80px',
                                                backgroundColor: '#fef3c7',
                                                border: '2px solid #fbbf24',
                                                fontWeight: 600
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCopyPassword}
                                            style={{
                                                position: 'absolute',
                                                right: '40px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: copied ? '#10b981' : '#92400e',
                                                padding: '4px'
                                            }}
                                        >
                                            {copied ? <Check size={18} /> : <Copy size={18} />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '8px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#92400e',
                                                padding: '4px'
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Phone <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="+63 912 345 6789"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Birthdate</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.birthDate}
                                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                            style={{ width: '100%' }}
                                        />
                                        {/* <Calendar size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} /> */}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Address</label>
                                <textarea
                                    className="form-input"
                                    placeholder="Enter complete address"
                                    rows={2}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Church Information */}
                        <div className="form-section">
                            <h3 className="section-title">Church Information</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Cluster <span className="required">*</span></label>
                                    <select
                                        className="form-input"
                                        value={formData.cluster}
                                        onChange={(e) => setFormData({ ...formData, cluster: e.target.value })}
                                    >
                                        <option value="" disabled>Select Cluster</option>
                                        <option value="Unassigned">Unassigned</option>
                                        {clusterOptions.map((opt, idx) => (
                                            <option key={idx} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Ministry <span className="required">*</span></label>
                                    <select
                                        className="form-input"
                                        value={formData.ministry}
                                        onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                                    >
                                        <option value="" disabled>Select Ministry</option>
                                        <option value="None">None</option>
                                        {ministryOptions.map((opt, idx) => (
                                            <option key={idx} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Status <span className="required">*</span></label>
                                    <select
                                        className="form-input"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="" disabled>Select Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                        <option value="semi-active">Semi Active</option>
                                        <option value="visitor">Visitor</option>
                                        <option value="transferred">Transferred</option>
                                        <option value="deceased">Deceased</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Join Date <span className="required">*</span></label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.joinDate}
                                            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                            style={{ width: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="form-section">
                            <h3 className="section-title">Emergency Contact</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Contact Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter emergency contact name"
                                        value={formData.emergencyContactName}
                                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact Phone</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="+63 912 345 6789"
                                        value={formData.emergencyContactPhone}
                                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="modal-footer">
                    <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" form="member-form" className="save-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : (
                            <>
                                <Save size={18} />Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
