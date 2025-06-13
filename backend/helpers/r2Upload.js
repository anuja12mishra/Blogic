// helpers/r2Upload.js
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
//import {r2Client} from '../config/cloudeflare.config';
// Load environment variables from .env
dotenv.config();
// console.log(process.env.CLOUDFLARE_ENDPOINT,process.env.CLOUDFLARE_ACCESS_KEY_ID,process.env.CLOUDFLARE_SECRET_ACCESS_KEY)
// Configure R2 client
// console.log(process.env.R2_PUBLIC_URL , process.env.R2_BUCKET_NAME )
const r2Client = new S3Client({
    region: 'auto', // Cloudflare R2 uses 'auto'
    endpoint: process.env.CLOUDFLARE_ENDPOINT, // Your R2 endpoint URL
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
});

export const uploadToR2 = async (file, folder = 'uploads') => {
    try {
        // Generate unique filename
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const key = `${folder}/${fileName}`;

        // Prepare upload parameters
        const uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            // Optional: Set cache control
            CacheControl: 'max-age=31536000', // 1 year
            // Optional: Set metadata
            Metadata: {
                'uploaded-by': 'user-service',
                'upload-date': new Date().toISOString()
            }
        };

        // Upload to R2
        const command = new PutObjectCommand(uploadParams);
        await r2Client.send(command);

        // Return the public URL and key
        const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
        
        return {
            url: publicUrl,
            key: key,
            bucket: process.env.R2_BUCKET_NAME,
            size: file.size,
            contentType: file.mimetype
        };

    } catch (error) {
        console.error('R2 upload error:', error);
        throw new Error(`Failed to upload to R2: ${error.message}`);
    }
};

export const deleteFromR2 = async (key) => {
    try {
        if (!key) {
            throw new Error('File key is required for deletion');
        }

        const deleteParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        };

        const command = new DeleteObjectCommand(deleteParams);
        await r2Client.send(command);

        console.log(`Successfully deleted ${key} from R2`);
        return { success: true, key };

    } catch (error) {
        console.error('R2 delete error:', error);
        throw new Error(`Failed to delete from R2: ${error.message}`);
    }
};



// more feture----------------->

// // Optional: Function to get signed URL for private files
// export const getSignedUrl = async (key, expiresIn = 3600) => {
//     try {
//         const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
//         const { GetObjectCommand } = await import('@aws-sdk/client-s3');

//         const command = new GetObjectCommand({
//             Bucket: process.env.R2_BUCKET_NAME,
//             Key: key,
//         });

//         const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
//         return signedUrl;

//     } catch (error) {
//         console.error('Error generating signed URL:', error);
//         throw new Error(`Failed to generate signed URL: ${error.message}`);
//     }
// };

//old verion------------------------->

// // helpers/r2Upload.js
// import r2 from '../config/cloudeflare.config.js'
// import { v4 as uuidv4 } from 'uuid';

// export const uploadToR2 = async (file, folder = 'uploads') => {
//     try {
//         const fileExtension = file.originalname.split('.').pop();
//         const fileName = `${folder}/${uuidv4()}.${fileExtension}`;
        
//         const params = {
//             Bucket: process.env.R2_BUCKET_NAME,
//             Key: fileName,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//             // Optional: Add cache control
//             CacheControl: 'max-age=31536000', // 1 year
//             // Optional: Add metadata
//             Metadata: {
//                 originalName: file.originalname,
//                 uploadDate: new Date().toISOString()
//             }
//         };

//         const result = await r2.upload(params).promise();
        
//         // Construct public URL
//         const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileName}`;
        
//         return {
//             success: true,
//             url: publicUrl,
//             key: fileName,
//             bucket: process.env.R2_BUCKET_NAME,
//             etag: result.ETag
//         };
//     } catch (error) {
//         console.error('R2 Upload Error:', error);
//         throw new Error(`R2 upload failed: ${error.message}`);
//     }
// };

// export const deleteFromR2 = async (key) => {
//     try {
//         const params = {
//             Bucket: process.env.R2_BUCKET_NAME,
//             Key: key
//         };

//         await r2.deleteObject(params).promise();
//         return { success: true };
//     } catch (error) {
//         console.error('R2 Delete Error:', error);
//         throw new Error(`R2 delete failed: ${error.message}`);
//     }
// };

// export const getSignedUrl = async (key, expiresIn = 3600) => {
//     try {
//         const params = {
//             Bucket: process.env.R2_BUCKET_NAME,
//             Key: key,
//             Expires: expiresIn
//         };

//         const url = await r2.getSignedUrlPromise('getObject', params);
//         return { success: true, url };
//     } catch (error) {
//         console.error('R2 Signed URL Error:', error);
//         throw new Error(`R2 signed URL failed: ${error.message}`);
//     }
// };

