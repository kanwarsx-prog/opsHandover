import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const SignUp = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await signUp(email, { full_name: name });
            setMessage('Check your email for the sign-in link to complete sign-up!');
            setEmail('');
            setName('');
        } catch (err) {
            setError(err.message || 'Failed to send sign-in link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-panel">
                <div className="auth-header">
                    <div className="app-logo">
                        <img src="/logo.png" alt="OpsHandover" className="logo-image" />
                        <span className="logo-text">OpsHandover</span>
                    </div>
                    <h2>Create Account</h2>
                    <p>Get started with your free account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Alex Morgan"
                            required
                            disabled={loading}
                        />
                    </div>

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
                        Already have an account?{' '}
                        <button
                            className="link-button"
                            onClick={() => onNavigate('login')}
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </div>

            <div className="auth-info">
                <p>🔐 Passwordless authentication</p>
                <p>No password needed - we'll send you a secure link</p>
            </div>
        </div>
    );
};

export default SignUp;
