import React from 'react';
import ThemeToggle from './ThemeToggle';
import '../styles/layout.css';

const Layout = ({ children, title, actions, currentView, onNavigate }) => {
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
                        className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); onNavigate('settings'); }}
                    >
                        <span className="icon">⚙</span> Settings
                    </a>
                </nav>

                <div className="user-profile">
                    <div className="avatar">AM</div>
                    <div className="user-info">
                        <div className="name">Alex Morgan</div>
                        <div className="role">Admin</div>
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
                        <ThemeToggle />
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
