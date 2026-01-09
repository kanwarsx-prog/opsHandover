import { supabase } from '../lib/supabaseClient';

/**
 * Storage Service for managing file uploads to Supabase Storage
 */

const BUCKET_NAME = 'evidence-files';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Allowed file types
const ALLOWED_TYPES = {
    images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
    text: ['text/plain', 'text/csv']
};

const ALL_ALLOWED_TYPES = [
    ...ALLOWED_TYPES.images,
    ...ALLOWED_TYPES.documents,
    ...ALLOWED_TYPES.spreadsheets,
    ...ALLOWED_TYPES.text
];

/**
 * Validate file before upload
 */
export const validateFile = (file) => {
    const errors = [];

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        errors.push(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Check file type
    if (!ALL_ALLOWED_TYPES.includes(file.type)) {
        errors.push(`File type ${file.type} is not allowed`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Upload file to Supabase Storage
 */
export const uploadFile = async (file, handoverId, checkId) => {
    try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '));
        }

        // Generate unique file path
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${handoverId}/${checkId}/${timestamp}_${sanitizedFileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        return {
            path: filePath,
            url: urlData.publicUrl,
            size: file.size,
            type: file.type,
            name: file.name
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

/**
 * Delete file from Supabase Storage
 */
export const deleteFile = async (filePath) => {
    try {
        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .remove([filePath]);

        if (error) throw error;

        return true;
    } catch (error) {
        console.error('Error deleting file:', error);
        throw error;
    }
};

/**
 * Get signed URL for private file access
 */
export const getSignedUrl = async (filePath, expiresIn = 3600) => {
    try {
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .createSignedUrl(filePath, expiresIn);

        if (error) throw error;

        return data.signedUrl;
    } catch (error) {
        console.error('Error getting signed URL:', error);
        throw error;
    }
};

/**
 * Check if file is an image
 */
export const isImage = (fileType) => {
    return ALLOWED_TYPES.images.includes(fileType);
};

/**
 * Generate thumbnail for image (client-side)
 */
export const generateThumbnail = async (file, maxWidth = 200, maxHeight = 200) => {
    return new Promise((resolve, reject) => {
        if (!isImage(file.type)) {
            reject(new Error('File is not an image'));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type, 0.8);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Upload thumbnail
 */
export const uploadThumbnail = async (thumbnailBlob, originalFilePath) => {
    try {
        const thumbnailPath = originalFilePath.replace(/\.[^/.]+$/, '_thumb.jpg');

        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(thumbnailPath, thumbnailBlob, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'image/jpeg'
            });

        if (error) throw error;

        return thumbnailPath;
    } catch (error) {
        console.error('Error uploading thumbnail:', error);
        throw error;
    }
};

export default {
    validateFile,
    uploadFile,
    deleteFile,
    getSignedUrl,
    isImage,
    generateThumbnail,
    uploadThumbnail,
    ALLOWED_TYPES,
    MAX_FILE_SIZE
};
