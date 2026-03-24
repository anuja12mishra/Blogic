import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import r2Client from '../config/cloudeflare.config.js';
import dotenv from 'dotenv';

dotenv.config();

export interface UploadResult {
    url: string;
    key: string;
    bucket: string;
    size: number;
    contentType: string;
}

export const uploadToR2 = async (file: any, folder: string = 'uploads'): Promise<UploadResult> => {
    try {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const key = `${folder}/${fileName}`;

        const uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            CacheControl: 'max-age=31536000',
            Metadata: {
                'uploaded-by': 'user-service',
                'upload-date': new Date().toISOString()
            }
        };

        const command = new PutObjectCommand(uploadParams);
        await r2Client.send(command);

        const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
        
        return {
            url: publicUrl,
            key: key,
            bucket: process.env.R2_BUCKET_NAME!,
            size: file.size,
            contentType: file.mimetype
        };

    } catch (error: any) {
        console.error('R2 upload error:', error);
        throw new Error(`Failed to upload to R2: ${error.message}`);
    }
};

export const deleteFromR2 = async (key: string) => {
    try {
        if (!key) {
            throw new Error('File key is required for deletion');
        }

        const deleteParams = {
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await r2Client.send(command);

        return { success: true, key };

    } catch (error: any) {
        console.error('R2 delete error:', error);
        throw new Error(`Failed to delete from R2: ${error.message}`);
    }
};
