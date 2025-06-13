import multer from 'multer';

// Use memory storage - no temporary files needed
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only images are allowed"), false);
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