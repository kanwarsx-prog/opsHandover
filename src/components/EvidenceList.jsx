import React, { useState } from 'react';
import FileUpload from './FileUpload';
import TagInput from './TagInput';
import { getEvidenceTypeIcon, isValidEvidenceUrl } from '../utils/approvalUtils';
import storageService from '../services/storageService';
import '../styles/approval.css';
import '../styles/evidenceList.css';

/**
 * EvidenceList - Display and manage evidence attachments with file upload support
 * @param {Object} props
 * @param {Array} props.evidence - Array of evidence objects
 * @param {Function} props.onEvidenceAdded - Callback when evidence is added
 * @param {Function} props.onEvidenceRemoved - Callback when evidence is removed
 * @param {boolean} props.readOnly - Whether list is read-only
 * @param {string} props.handoverId - Handover ID for file uploads
 * @param {string} props.checkId - Check ID for file uploads
 */
const EvidenceList = ({
    evidence = [],
    onEvidenceAdded,
    onEvidenceRemoved,
    readOnly = false,
    handoverId,
    checkId
}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [uploadMode, setUploadMode] = useState('link'); // 'link' or 'file'
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        type: 'link',
        description: '',
        tags: []
    });
    const [errors, setErrors] = useState({});
    const [filterTag, setFilterTag] = useState(null);

    const handleAddEvidence = () => {
        // Validate form
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (uploadMode === 'link') {
            if (!formData.url.trim()) newErrors.url = 'URL is required';
            if (!isValidEvidenceUrl(formData.url)) newErrors.url = 'Invalid URL format';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Create new evidence object
        const newEvidence = {
            id: `e${Date.now()}`,
            title: formData.title,
            url: formData.url,
            type: formData.type,
            description: formData.description,
            tags: formData.tags,
            uploadedBy: 'Current User', // TODO: Get from auth context
            uploadedAt: new Date().toISOString()
        };

        onEvidenceAdded?.(newEvidence);

        // Reset form
        setFormData({ title: '', url: '', type: 'link', description: '', tags: [] });
        setErrors({});
        setShowAddForm(false);
    };

    const handleFileUpload = (uploadResult) => {
        // Create evidence from uploaded file
        const newEvidence = {
            id: `e${Date.now()}`,
            title: formData.title || uploadResult.name,
            url: uploadResult.url,
            filePath: uploadResult.path,
            fileSize: uploadResult.size,
            fileType: uploadResult.type,
            thumbnailPath: uploadResult.thumbnailPath,
            type: storageService.isImage(uploadResult.type) ? 'screenshot' : 'document',
            description: formData.description,
            tags: formData.tags,
            uploadedBy: 'Current User', // TODO: Get from auth context
            uploadedAt: new Date().toISOString()
        };

        onEvidenceAdded?.(newEvidence);

        // Reset form
        setFormData({ title: '', url: '', type: 'link', description: '', tags: [] });
        setErrors({});
        setShowAddForm(false);
    };

    const handleRemove = async (evidenceItem) => {
        if (window.confirm('Are you sure you want to remove this evidence?')) {
            // Delete file from storage if it exists
            if (evidenceItem.filePath) {
                try {
                    await storageService.deleteFile(evidenceItem.filePath);
                    if (evidenceItem.thumbnailPath) {
                        await storageService.deleteFile(evidenceItem.thumbnailPath);
                    }
                } catch (error) {
                    console.error('Error deleting file:', error);
                }
            }
            onEvidenceRemoved?.(evidenceItem.id);
        }
    };

    // Get all unique tags from evidence
    const allTags = [...new Set(evidence.flatMap(e => e.tags || []))];

    // Filter evidence by tag
    const filteredEvidence = filterTag
        ? evidence.filter(e => e.tags?.includes(filterTag))
        : evidence;

    return (
        <div className="evidence-list">
            <div className="evidence-header">
                <h4>Evidence ({filteredEvidence.length})</h4>
                {!readOnly && (
                    <button
                        className="btn-add-evidence"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? '✕ Cancel' : '+ Add Evidence'}
                    </button>
                )}
            </div>

            {/* Tag Filter */}
            {allTags.length > 0 && (
                <div className="evidence-tag-filter">
                    <button
                        className={`tag-filter-btn ${!filterTag ? 'active' : ''}`}
                        onClick={() => setFilterTag(null)}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            className={`tag-filter-btn ${filterTag === tag ? 'active' : ''}`}
                            onClick={() => setFilterTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            {showAddForm && (
                <div className="evidence-form">
                    {/* Upload Mode Toggle */}
                    <div className="upload-mode-toggle">
                        <button
                            className={`mode-btn ${uploadMode === 'link' ? 'active' : ''}`}
                            onClick={() => setUploadMode('link')}
                        >
                            🔗 Link
                        </button>
                        <button
                            className={`mode-btn ${uploadMode === 'file' ? 'active' : ''}`}
                            onClick={() => setUploadMode('file')}
                        >
                            📁 Upload File
                        </button>
                    </div>

                    {uploadMode === 'file' && (
                        <FileUpload
                            onFileUpload={handleFileUpload}
                            handoverId={handoverId}
                            checkId={checkId}
                        />
                    )}

                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Audit Report Q4 2025"
                        />
                        {errors.title && <span className="error">{errors.title}</span>}
                    </div>

                    {uploadMode === 'link' && (
                        <>
                            <div className="form-group">
                                <label>URL *</label>
                                <input
                                    type="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://..."
                                />
                                {errors.url && <span className="error">{errors.url}</span>}
                            </div>

                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="link">Link</option>
                                    <option value="document">Document</option>
                                    <option value="screenshot">Screenshot</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Optional description..."
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label>Tags</label>
                        <TagInput
                            tags={formData.tags}
                            onTagsChange={(tags) => setFormData({ ...formData, tags })}
                        />
                    </div>

                    {uploadMode === 'link' && (
                        <button className="btn-primary" onClick={handleAddEvidence}>
                            Add Evidence
                        </button>
                    )}
                </div>
            )}

            {filteredEvidence.length === 0 ? (
                <div className="evidence-empty">
                    <p>{filterTag ? `No evidence with tag "${filterTag}"` : 'No evidence attached yet'}</p>
                </div>
            ) : (
                <div className="evidence-items">
                    {filteredEvidence.map((item) => (
                        <div key={item.id} className="evidence-item">
                            {/* Thumbnail for images */}
                            {item.thumbnailPath ? (
                                <div className="evidence-thumbnail">
                                    <img src={item.url} alt={item.title} />
                                </div>
                            ) : (
                                <div className="evidence-icon">
                                    {getEvidenceTypeIcon(item.type)}
                                </div>
                            )}

                            <div className="evidence-content">
                                <div className="evidence-title">
                                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                                        {item.title}
                                    </a>
                                </div>

                                {item.description && (
                                    <div className="evidence-description">{item.description}</div>
                                )}

                                {item.tags && item.tags.length > 0 && (
                                    <div className="evidence-tags">
                                        {item.tags.map((tag, idx) => (
                                            <span key={idx} className="evidence-tag">{tag}</span>
                                        ))}
                                    </div>
                                )}

                                <div className="evidence-meta">
                                    Added by {item.uploadedBy} • {new Date(item.uploadedAt).toLocaleDateString()}
                                    {item.fileSize && (
                                        <> • {(item.fileSize / 1024).toFixed(1)} KB</>
                                    )}
                                </div>
                            </div>

                            {!readOnly && (
                                <button
                                    className="btn-remove-evidence"
                                    onClick={() => handleRemove(item)}
                                    title="Remove evidence"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EvidenceList;
