import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import UpdateModal from '../../components/UpdateModal';
import { User, Mail, Lock, Eye, EyeOff, RefreshCw, Briefcase, BadgeCheck } from 'lucide-react';
import './Signup.css';

export const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);

    // Fetch available roles from the database
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const { data, error } = await supabase
                    .from('roles')
                    .select('id, name')
                    .order('name');

                if (error) throw error;

                // Filter out Admin and Pastor from signup options
                const filteredRoles = (data || []).filter(role =>
                    !['Admin', 'Pastor'].includes(role.name)
                );

                setRoles(filteredRoles);
            } catch (error) {
                console.error('Error fetching roles:', error);
                // Fallback to default roles if fetch fails
                setRoles([
                    { id: 1, name: 'Member' },
                    { id: 2, name: 'Volunteer' }
                ]);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { fullname, email, role, password, confirmPassword } = formData;

        // Basic Validation
        if (!fullname || !email || !role || !password || !confirmPassword) {
            toast.error("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullname,
                        role: role,
                    },
                },
            });

            if (error) throw error;

            toast.success('Signup successful! Please check your email for verification.');
            navigate('/login');
        } catch (error: any) {
            console.error('Signup error:', error);
            if (error.message === 'Failed to fetch') {
                toast.error('Connection failed. Please check your internet or Supabase configuration.');
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            {/* Left Side - Image & Branding */}
            <div className="signup-left">
                <div className="brand-logo">
                    <img src="/logo/lamp.png" alt="Lampkonek Logo" />
                </div>

                <div className="left-footer">
                    © 2026 MINISTRY MANAGEMENT SYSTEM
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="signup-right">

                <button
                    className="update-icon-btn"
                    onClick={() => setShowUpdateModal(true)}
                    title="Updates & Version"
                >
                    <RefreshCw size={20} />
                </button>
                <UpdateModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} />


                <div className="signup-content">
                    <div className="signup-header">

                        <h1>Create Account</h1>
                        <p>Sign up to get started with Lampkonek</p>
                    </div>

                    <form className="signup-form" onSubmit={handleSignup}>
                        <div className="input-group">
                            <label htmlFor="fullname">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input
                                    type="text"
                                    id="fullname"
                                    placeholder="John Doe"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="role">Role</label>
                            <div className="input-wrapper">
                                <Briefcase className="input-icon" size={18} />
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select your role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <div className="input-wrapper">
                                <BadgeCheck className="input-icon" size={18} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <div className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="login-link">
                        Already have an account? <Link to="/login">Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
