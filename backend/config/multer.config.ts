import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

const storage = multer.memoryStorage();

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only images are allowed") as any, false);
    }
    
    cb(null, true);
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    }
});

export default upload;
