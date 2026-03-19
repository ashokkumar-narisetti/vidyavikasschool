import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { GraduationCap, Lock, Mail, Eye, EyeOff, Globe } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (err) {
            setError('Invalid email or password. Please try again.');
        } else {
            navigate('/admin-dashboard');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                {/* Logo */}
                <div className="admin-login-logo">
                    <div className="admin-login-logo-icon">
                        <GraduationCap size={32} color="#fff" />
                    </div>
                    <div>
                        <div className="admin-login-school">Vidya Vikas School</div>
                        <div className="admin-login-sub">Admin Portal</div>
                    </div>
                </div>

                <h1 className="admin-login-title">Welcome Back</h1>
                <p className="admin-login-desc">Sign in to manage your school website</p>

                {error && (
                    <div className="admin-error-banner" style={{ marginBottom: 16 }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="admin-form-group">
                        <label>Email Address</label>
                        <div className="admin-input-wrap">
                            <Mail size={16} className="admin-input-icon" />
                            <input
                                type="email"
                                placeholder="admin@vidyavikasschool.edu.in"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="admin-form-group">
                        <label>Password</label>
                        <div className="admin-input-wrap">
                            <Lock size={16} className="admin-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="admin-input-eye"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? <span className="admin-btn-spinner" /> : null}
                        {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                    </button>
                </form>

                {/* Go to Website button */}
                <button
                    type="button"
                    className="admin-btn-secondary"
                    style={{ width: '100%', marginTop: 14, justifyContent: 'center', gap: 8 }}
                    onClick={() => navigate('/')}
                >
                    <Globe size={16} />
                    Go to Website
                </button>

                <p className="admin-login-footer">
                    🔒 Secure admin access only. Unauthorized access is prohibited.
                </p>
            </div>
        </div>
    );
}
