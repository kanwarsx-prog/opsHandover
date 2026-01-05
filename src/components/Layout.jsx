import React from 'react';
import '../styles/layout.css';

const Layout = ({ children, title, actions }) => {
    return (
        <div className="layout-container">
            <aside className="sidebar glass-panel">
                <div className="logo-area">
                    <div className="logo-icon">OH</div>
                    <h1>OpsHandover</h1>
                </div>

                <nav className="nav-menu">
                    <a href="#" className="nav-item active">
                        <span className="icon">⊞</span> Handovers
                    </a>
                    <a href="#" className="nav-item">
                        <span className="icon">⚙</span> Settings
                    </a>
                </nav>

                <div className="user-profile">
                    <div className="avatar">SK</div>
                    <div className="user-info">
                        <div className="name">Sushil Kanwar</div>
                        <div className="role">Admin</div>
                    </div>
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
