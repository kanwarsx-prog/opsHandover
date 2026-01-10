import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: 'var(--color-bg-gradient)'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: 'var(--text-primary)'
                }}>
                    <div className="spinner" style={{
                        width: '48px',
                        height: '48px',
                        border: '4px solid var(--border-color)',
                        borderTop: '4px solid var(--color-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }}></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // User not authenticated - will be handled by App.jsx routing
        return null;
    }

    return children;
};

export default ProtectedRoute;
