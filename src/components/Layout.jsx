import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import '../styles/layout.css';

const Layout = ({ children, title, actions, currentView, onNavigate }) => {
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (user?.user_metadata?.full_name) {
            const names = user.user_metadata.full_name.split(' ');
            return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return user?.email?.slice(0, 2).toUpperCase() || 'U';
    };

    return (
        <div className="layout-container">
            <aside className="sidebar glass-panel">
                <div className="logo-area">
                    <div className="logo-icon">OH</div>
                    <h1>OpsHandover</h1>
                </div>

                <nav className="nav-menu">
                    <a
                        href="#"
                        className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}
                    >
                        <span className="icon">⊞</span> Handovers
                    </a>
                    <a
                        href="#"
                        className={`nav-item ${currentView === 'analytics' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('analytics'); }}
                    >
                        <span className="icon">📊</span> Analytics
                    </a>
                    <a
                        href="#"
                        className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('settings'); }}
                    >
                        <span className="icon">⚙</span> Settings
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <ThemeToggle />
                </div>

                <div className="user-profile">
                    <div className="avatar">{getUserInitials()}</div>
                    <div className="user-info">
                        <div className="name">
                            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                        </div>
                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '20px', fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center' }}>
                    &copy; 2026 Everyday Systems
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <div className="page-title">
                        <h2>{title}</h2>
                    </div>
                    <div className="page-actions">
                        {actions}
                    </div>
                </header>

                <div className="content-scrollable">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
