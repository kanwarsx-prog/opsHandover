import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import storageService from '../services/storageService';
import '../styles/fileUpload.css';

const FileUpload = ({ onFileUpload, handoverId, checkId, disabled = false }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        setError(null);
        setUploading(true);
        setUploadProgress(0);

        try {
            const file = acceptedFiles[0]; // Handle one file at a time for now

            // Validate file
            const validation = storageService.validateFile(file);
            if (!validation.valid) {
                setError(validation.errors.join(', '));
                setUploading(false);
                return;
            }

            // Simulate progress (since Supabase doesn't provide upload progress)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            // Upload file
            const uploadResult = await storageService.uploadFile(file, handoverId, checkId);

            // Generate and upload thumbnail if image
            let thumbnailPath = null;
            if (storageService.isImage(file.type)) {
                try {
                    const thumbnailBlob = await storageService.generateThumbnail(file);
                    thumbnailPath = await storageService.uploadThumbnail(thumbnailBlob, uploadResult.path);
                } catch (thumbError) {
                    console.warn('Failed to generate thumbnail:', thumbError);
                }
            }

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Call parent callback with upload result
            if (onFileUpload) {
                onFileUpload({
                    ...uploadResult,
                    thumbnailPath
                });
            }

            // Reset after short delay
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
            }, 1000);

        } catch (err) {
            setError(err.message || 'Failed to upload file');
            setUploading(false);
            setUploadProgress(0);
        }
    }, [handoverId, checkId, onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        disabled: disabled || uploading,
        multiple: false,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/plain': ['.txt'],
            'text/csv': ['.csv']
        }
    });

    return (
        <div className="file-upload-container">
            <div
                {...getRootProps()}
                className={`dropzone ${isDragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''} ${disabled ? 'disabled' : ''}`}
            >
                <input {...getInputProps()} />

                {uploading ? (
                    <div className="upload-progress">
                        <div className="spinner"></div>
                        <p>Uploading... {uploadProgress}%</p>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    </div>
                ) : (
                    <div className="dropzone-content">
                        <div className="upload-icon">📁</div>
                        {isDragActive ? (
                            <p className="dropzone-text">Drop the file here...</p>
                        ) : (
                            <>
                                <p className="dropzone-text">
                                    Drag & drop a file here, or click to select
                                </p>
                                <p className="dropzone-hint">
                                    Supported: Images, PDFs, Documents (max {storageService.MAX_FILE_SIZE / 1024 / 1024}MB)
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="upload-error">
                    <span className="error-icon">⚠️</span>
                    {error}
                </div>
            )}
        </div>
    );
};

export default FileUpload;
