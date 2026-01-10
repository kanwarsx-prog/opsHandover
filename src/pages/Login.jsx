import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signIn } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signIn(email, name);
            // User will be automatically redirected by App.jsx
        } catch (err) {
            setError(err.message || 'Failed to sign in');
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
                    <h2>Welcome to OpsHandover</h2>
                    <p>Enter your details to get started</p>
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

                    <button
                        type="submit"
                        className="btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Get Started'}
                    </button>
                </form>
            </div>

            <div className="auth-info">
                <p>🚀 Start managing your operations handovers</p>
            </div>
        </div>
    );
};

export default Login;
