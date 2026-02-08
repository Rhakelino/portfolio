import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file based on the specified options.
 * @param {File} file - The image file to compress.
 * @param {Object} options - custom options for compression
 * @returns {Promise<File>} - The compressed image file.
 */
export const handleImageCompression = async (file, options = {}) => {
    const defaultOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    };

    const combinedOptions = { ...defaultOptions, ...options };

    try {
        const compressedFile = await imageCompression(file, combinedOptions);
        return compressedFile;
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
    }
};

export const projectImageOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: 'image/webp'
};

export const certificateImageOptions = {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 1024, // Reasonable size for certificates
    useWebWorker: true,
    fileType: 'image/webp'
};

export const skillImageOptions = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 300, // Small size for icons
    useWebWorker: true,
    fileType: 'image/webp'
};
