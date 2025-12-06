import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UploadResponse {
    url: string;
    public_id: string;
    resource_type: string;
}

/**
 * Upload a file (audio or image) to the server
 * @param file - The file to upload
 * @returns Promise with the upload response containing the file URL
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post<{ statusCode: number; message: string; data: UploadResponse }>(
            `${API_URL}/upload/file`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        // Backend wraps response in { statusCode, message, data }
        return response.data.data;
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error('Failed to upload file');
    }
};

export const uploadApi = {
    uploadFile,
};
