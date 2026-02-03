import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import './Login.css';

export const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.message === 'Failed to fetch') {
                toast.error('Connection failed. Please check your internet or Supabase configuration (.env file).');
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
                <div className="login-header">
                    <h1>Welcome</h1>
                    <p>Please enter your credentials to log in</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Email Address</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <input type="text" id="username" placeholder="Enter your email" />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="••••••••"
                            />
                            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <label className="checkbox-container">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
                        Don't have an account? <Link to="/signup" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
                    </div>
                </form>

                <div className="support-text">
                    Need assistance? <a href="#">Contact Support</a>
                </div>
            </div>

            {/* Right Side - Image & Branding */}
            <div className="login-right">
                <div className="glass-card">
                    <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18h6"></path>
                        <path d="M10 22h4"></path>
                        <path d="M12 2v1"></path>
                        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"></path>
                    </svg>
                    <h2 className="brand-title">LAMPKONEK</h2>
                    <p className="brand-slogan">Connecting Ministry, Impacting Lives.</p>
                </div>

                <div className="right-footer">
                    © 2024 MINISTRY MANAGEMENT SYSTEM
                </div>

                <div className="moon-icon-wrapper">
                    <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Login;
