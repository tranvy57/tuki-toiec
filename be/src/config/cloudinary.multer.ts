import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';

export const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: 'toiec-files',
    resource_type: file.mimetype.startsWith('audio') ? 'video' : 'image',
    public_id: file.originalname.split('.')[0],
  }),
});
