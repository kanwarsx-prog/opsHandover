import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const Login = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { signInWithEmail } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await signInWithEmail(email);
            setMessage('Check your email for the magic link!');
            setEmail('');
        } catch (err) {
            setError(err.message || 'Failed to send magic link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <div className="auth-header">
                    <div className="app-logo">
                        <div className="logo-icon-box">OH</div>
                        <span className="logo-text">OpsHandover</span>
                    </div>
                    <h2>Welcome Back</h2>
                    <p>Enter your email to receive a sign-in link</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            ⚠️ {error}
                        </div>
                    )}

                    {message && (
                        <div className="alert alert-success">
                            ✅ {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Sending...' : 'Send Magic Link'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <button
                            className="link-button"
                            onClick={() => onNavigate('signup')}
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>

            <div className="auth-info">
                <p>🔐 Passwordless authentication</p>
                <p>We'll send you a secure link to sign in</p>
            </div>
        </div>
    );
};

export default Login;
