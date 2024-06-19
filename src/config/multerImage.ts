
import multer from "multer";

// multer configuration for image
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadImage = multer({
    storage: imageStorage,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15 MB file size limit, adjust as necessary
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files (you can add more file types if needed)
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!') as any, false);
        }
        cb(null, true);
    }
}).single('gacImage'); 

export default uploadImage