"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// multer configuration for image
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Uploads/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const uploadImage = (0, multer_1.default)({
    storage: imageStorage,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15 MB file size limit, adjust as necessary
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files (you can add more file types if needed)
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('gacImage');
exports.default = uploadImage;
