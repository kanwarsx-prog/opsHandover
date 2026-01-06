import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../styles/settings.css';

const Settings = ({ onNavigate }) => {
    const [notifications, setNotifications] = useState({
        email: true,
        slack: true,
        push: false
    });

    const [integrations, setIntegrations] = useState({
        jira: true,
        servicenow: false,
        slack: true
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleIntegration = (key) => {
        setIntegrations(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Layout
            title="Settings"
            currentView="settings"
            onNavigate={onNavigate}
        >
            <div className="settings-container">

                {/* Profile Section */}
                <section className="settings-section glass-panel">
                    <h3>User Profile</h3>
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="loading-avatar">AM</div>
                            <div className="profile-details">
                                <span className="profile-name">Alex Morgan</span>
                                <span className="profile-role">Global Administrator</span>
                                <span className="profile-email">alex.morgan@everydaysystems.com</span>
                            </div>
                        </div>
                        <button className="btn-secondary">Edit Profile</button>
                    </div>
                </section>

                {/* Integrations Section */}
                <section className="settings-section glass-panel">
                    <h3>Integrations</h3>
                    <div className="integrations-list">
                        <div className="integration-item">
                            <div className="int-icon jira">J</div>
                            <div className="int-info">
                                <span className="int-name">Jira Cloud</span>
                                <span className="int-desc">Sync tasks and blockers</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={integrations.jira}
                                    onChange={() => toggleIntegration('jira')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="integration-item">
                            <div className="int-icon snow">S</div>
                            <div className="int-info">
                                <span className="int-name">ServiceNow</span>
                                <span className="int-desc">Create Change Records</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={integrations.servicenow}
                                    onChange={() => toggleIntegration('servicenow')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="integration-item">
                            <div className="int-icon slack">#</div>
                            <div className="int-info">
                                <span className="int-name">Slack</span>
                                <span className="int-desc">Channel notifications</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={integrations.slack}
                                    onChange={() => toggleIntegration('slack')}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Notifications Section */}
                <section className="settings-section glass-panel">
                    <h3>Notifications</h3>
                    <div className="notification-options">
                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={notifications.email}
                                onChange={() => toggleNotification('email')}
                            />
                            <span>Email Digests (Daily)</span>
                        </label>
                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={notifications.slack}
                                onChange={() => toggleNotification('slack')}
                            />
                            <span>Slack Alerts (Real-time)</span>
                        </label>
                        <label className="checkbox-row">
                            <input
                                type="checkbox"
                                checked={notifications.push}
                                onChange={() => toggleNotification('push')}
                            />
                            <span>Browser Push Notifications</span>
                        </label>
                    </div>
                </section>

                {/* Audit Log Preview */}
                <section className="settings-section glass-panel">
                    <h3>Recent Audit Log</h3>
                    <table className="audit-table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>User</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Logged in</td>
                                <td>Alex Morgan</td>
                                <td>Just now</td>
                            </tr>
                            <tr>
                                <td>Updated 'Crane Automation'</td>
                                <td>Marco V.</td>
                                <td>30 mins ago</td>
                            </tr>
                            <tr>
                                <td>Approved 'SAP Migration'</td>
                                <td>Sarah Jones</td>
                                <td>2 hours ago</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

            </div>
        </Layout>
    );
};

export default Settings;
