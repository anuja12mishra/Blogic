import dotenv from 'dotenv';
dotenv.config();

import { S3Client} from '@aws-sdk/client-s3';
// Configure AWS SDK for Cloudflare R2
const r2Client = new S3Client({
    region: 'auto', // Cloudflare R2 uses 'auto'
    endpoint: process.env.CLOUDFLARE_ENDPOINT, // Your R2 endpoint URL
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    },
});
export default r2Client;