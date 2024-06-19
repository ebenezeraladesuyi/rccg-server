"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// multer configuration for audio
const blogImageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads/blogImage');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const uploadBlogImage = (0, multer_1.default)({
    storage: blogImageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 15 MB file size limit, adjust as necessary
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files (you can add more file types if needed)
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('blogImage');
exports.default = uploadBlogImage;
