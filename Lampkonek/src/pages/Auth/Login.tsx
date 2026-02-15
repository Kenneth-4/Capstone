import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import UpdateModal from '../../components/UpdateModal';
import { User, Lock, Eye, EyeOff, RefreshCw, HelpCircle, Moon, LogIn } from 'lucide-react';
import './Login.css';

export const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const email = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.message === 'Failed to fetch') {
                toast.error('Connection failed. Please check your internet or Supabase configuration.');
            } else if (error.message === 'Invalid login credentials') {
                toast.error('Invalid email or password.');
            } else {
                toast.error(error.message || 'An error occurred during login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Form */}
            <div className="login-left">

                <UpdateModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} />

                <div className="login-content">
                    <div className="login-header">

                        <h1>Welcome Back</h1>
                        <p>Please enter your details to sign in.</p>
                    </div>

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <label htmlFor="username">Email Address</label>
                            <div className="input-wrapper">
                                <User className="input-icon" size={18} />
                                <input type="text" id="username" placeholder="Enter your email" />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                />
                                <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <label className="checkbox-container">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-password">Forgot password?</a>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                <>
                                    Sign In <LogIn size={18} style={{ marginLeft: '8px' }} />
                                </>
                            )}
                        </button>

                        <div className="signup-text">
                            Don't have an account? <Link to="/signup">Sign up for free</Link>
                        </div>
                    </form>

                    <div className="support-section">
                        <a href="#" className="support-link">
                            <HelpCircle size={16} />
                            <span>Need help logging in?</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Side - Image & Branding */}
            <div className="login-right">
                <div className="brand-logo">
                    <img src="/logo/lamp.png" alt="Lampkonek Logo" />
                </div>
                <div className="right-footer">
                    © 2026 MINISTRY MANAGEMENT SYSTEM
                </div>
                <button
                    className="update-icon-btn"
                    onClick={() => setShowUpdateModal(true)}
                    title="Updates & Version"
                >
                    <RefreshCw size={20} />
                </button>

                <button className="moon-icon-wrapper" aria-label="Toggle theme">
                    <Moon size={20} />
                </button>
            </div>
        </div>
    );
};

export default Login;
