// src/cloudinary/cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'streamifier';

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new Error('No file provided');
        }
        console.log('File received:', file); // Log the file object

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { resource_type: 'image' },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        return reject(new Error('Image upload failed'));
                    }

                    const imageUrl = result?.secure_url || '';
                    if (!imageUrl) {
                        return reject(new Error('Failed to retrieve image URL'));
                    }

                    resolve(imageUrl);
                },
            );

            createReadStream(file.buffer).pipe(uploadStream);
        });
    }
}