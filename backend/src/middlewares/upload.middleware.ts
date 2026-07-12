import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { AppError } from '../helpers/error.helper';
import { HTTP_STATUS, ERROR_CODES } from '../constants';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type (${file.mimetype}). Only JPG, PNG, WEBP, and PDF files are allowed.`,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_CODES.VALIDATION_ERROR
      ) as any
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
});

export class CloudinaryHelper {
  public static async uploadBuffer(
    buffer: Buffer,
    folder: string,
    publicId?: string
  ): Promise<{ url: string; publicId: string; format: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `pharma_care/${folder}`,
          public_id: publicId,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload failed'));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
            });
          }
        }
      );
      uploadStream.end(buffer);
    });
  }

  public static async deleteFile(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
