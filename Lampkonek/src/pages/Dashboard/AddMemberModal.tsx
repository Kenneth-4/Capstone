import React, { useEffect, useState } from 'react';
import { X, PlusCircle, Calendar, Eye, EyeOff, Copy, Check } from 'lucide-react';
import './AddMemberModal.css';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface Member {
    id?: string;
    full_name: string;
    email: string;
    cluster: string;
    ministry: string;
    status: string;
    role?: string;
}

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    member?: Member | null;
    onSuccess?: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, member, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        gender: '',
        country: '',
        cluster: '',
        status: '',
        joinDate: '',
        ministry: ''
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
            // Split full name for form (simple split)
            const nameParts = member.full_name?.split(' ') || ['', ''];
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            setFormData({
                firstName,
                lastName,
                email: member.email || '',
                birthDate: '',
                gender: '',
                country: '',
                cluster: member.cluster || '',
                status: member.status?.toLowerCase() || '',
                joinDate: '',
                ministry: member.ministry || ''
            });
            setGeneratedPassword(''); // Clear password when editing
        } else {
            // Reset for add mode
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                birthDate: '',
                gender: '',
                country: '', // Country
                cluster: 'Unassigned',
                status: '',
                joinDate: '',
                ministry: ''
            });
            setGeneratedPassword(''); // Clear password
        }
        setShowPassword(false); // Reset password visibility
        fetchOptions();
    }, [member, isOpen]);

    const fetchOptions = async () => {
        try {
            // Fetch Clusters
            const { data: clusters } = await supabase
                .from('clusters')
                .select('name')
                .neq('name', 'Unassigned') // Ensure Unassigned is not fetched
                .order('name');

            if (clusters) {
                setClusterOptions(clusters.map(c => c.name));
            } else {
                setClusterOptions([]);
            }

            // Fetch Ministries
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

        // Basic validation
        if (!formData.firstName || !formData.lastName || !formData.email) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!formData.status) {
            toast.error('Please select a member status');
            return;
        }

        setIsSubmitting(true);

        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();


            // Capitalize status to match database format
            const capitalizedStatus = formData.status.charAt(0).toUpperCase() + formData.status.slice(1);

            if (member?.id) {
                // Update existing member
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        full_name: fullName,
                        email: formData.email,
                        cluster: formData.cluster || 'Unassigned',
                        ministry: formData.ministry || 'None',
                        status: capitalizedStatus
                    })
                    .eq('id', member.id);

                if (updateError) throw updateError;

                toast.success('Member updated successfully!');
            } else {
                // Add new member - create auth user and profile
                // Generate a temporary password (user should reset it on first login)
                const tempPassword = `Temp${Math.random().toString(36).slice(-8)}!`;

                // Create the new user account WITHOUT auto-login
                // We use signUp but the user won't be logged in if email confirmation is required
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: tempPassword,
                    options: {
                        data: {
                            full_name: fullName,
                            role: 'member'
                        },
                        emailRedirectTo: window.location.origin
                    }
                });

                if (authError) {
                    // Check if user already exists
                    if (authError.message.includes('already registered')) {
                        throw new Error('A user with this email already exists');
                    }
                    throw authError;
                }

                if (!authData.user) {
                    throw new Error('Failed to create user account');
                }

                // The user is created but we need to ensure we stay logged in as admin
                // Force refresh the current session to ensure admin stays logged in
                const { error: refreshError } = await supabase.auth.refreshSession();

                if (refreshError) {
                    console.error('Session refresh error:', refreshError);
                }

                // Wait for the trigger to create the profile
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Update the profile with additional information
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                        cluster: formData.cluster || 'Unassigned',
                        ministry: formData.ministry || 'None',
                        status: capitalizedStatus
                    })
                    .eq('id', authData.user.id);

                if (profileError) {
                    console.error('Profile update error:', profileError);
                    // Don't throw here - the user was created successfully
                }

                // Store the password in state to display in the modal
                setGeneratedPassword(tempPassword);

                toast.success('Member added successfully! Password is displayed below.', {
                    duration: 5000,
                    icon: '✅'
                });

                // Don't close the modal yet - let admin copy the password
                setIsSubmitting(false);
                return; // Exit early to keep modal open
            }

            // Close modal first, then refresh to avoid state conflicts
            onClose();

            // Call success callback to refresh the list after a brief delay
            // This ensures the modal state is cleared before fetching
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 100);
            }
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
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="section-title">Personal Information</div>

                    <form id="member-form" onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. John"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name <span className="required">*</span></label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Doe"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Email Address <span className="required">*</span></label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="john.doe@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {/* Show generated password field only after member is created */}
                            {generatedPassword && (
                                <div className="form-group">
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
                                                display: 'flex',
                                                alignItems: 'center',
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
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '4px'
                                            }}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Birth Date <span className="required">*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="mm/dd/yyyy"
                                        style={{ width: '100%' }}
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    />
                                    <Calendar size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                                </div>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Gender</label>
                                <select
                                    className="form-input"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="" disabled>Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <select
                                    className="form-input"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                >
                                    <option value="" disabled>Select Country</option>
                                    <option value="ph">Philippines</option>
                                    <option value="us">United States</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Cluster</label>
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
                                <label>Member Status <span className="required">*</span></label>
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
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Join Date</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="mm/dd/yyyy"
                                        style={{ width: '100%' }}
                                        value={formData.joinDate}
                                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                    />
                                    <Calendar size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Ministry</label>
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

                        <a href="#" className="add-secondary-email">
                            <PlusCircle size={16} />
                            Add Secondary Email Address
                        </a>
                    </form>
                </div>

                <div className="modal-footer">
                    <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" form="member-form" className="save-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : (member ? 'Update Member' : 'Save Member')}
                    </button>
                </div>
            </div>
        </div>
    );
};
