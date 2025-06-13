import multer from 'multer';

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname); // You can also add timestamp to avoid name collisions
    }
});

function fileFilter(req, file, cb) {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only images are allowed"), false);
    }

    cb(null, true);
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

export default upload;
