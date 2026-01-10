import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/drillDownModal.css';

const DrillDownModal = ({ isOpen, onClose, title, handovers, onNavigate }) => {
    const [sortBy, setSortBy] = useState('name'); // 'name', 'score', 'targetDate'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

    const handleSort = (field) => {
        if (sortBy === field) {
            // Toggle sort order
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const sortedHandovers = [...handovers].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'score':
                comparison = a.score - b.score;
                break;
            case 'targetDate':
                comparison = new Date(a.targetDate) - new Date(b.targetDate);
                break;
            default:
                comparison = 0;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });

    const getSortIcon = (field) => {
        if (sortBy !== field) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Ready': return 'status-ready';
            case 'At Risk': return 'status-risk';
            default: return 'status-not-ready';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="drill-down-modal">
                <div className="modal-header">
                    <h3>{title}</h3>
                    <p>{handovers.length} project{handovers.length !== 1 ? 's' : ''} found</p>
                </div>

                {handovers.length === 0 ? (
                    <div className="empty-state">
                        <p>No projects match this criteria</p>
                    </div>
                ) : (
                    <div className="handovers-table-container">
                        <table className="handovers-table">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('name')} className="sortable">
                                        Project Name {getSortIcon('name')}
                                    </th>
                                    <th onClick={() => handleSort('score')} className="sortable">
                                        Score {getSortIcon('score')}
                                    </th>
                                    <th>Status</th>
                                    <th onClick={() => handleSort('targetDate')} className="sortable">
                                        Target Date {getSortIcon('targetDate')}
                                    </th>
                                    <th>Owner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedHandovers.map(handover => (
                                    <tr
                                        key={handover.id}
                                        onClick={() => {
                                            onNavigate('workspace', handover.id);
                                            onClose();
                                        }}
                                        className="handover-row"
                                    >
                                        <td className="handover-name">{handover.name}</td>
                                        <td className="handover-score">
                                            <span className="score-badge">{handover.score}</span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(handover.status)}`}>
                                                {handover.status}
                                            </span>
                                        </td>
                                        <td className="handover-date">{handover.targetDate}</td>
                                        <td className="handover-owner">{handover.owner}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DrillDownModal;
