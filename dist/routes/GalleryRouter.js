"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multerImage_1 = __importDefault(require("../config/multerImage"));
const GalleryController_1 = require("../controller/GalleryController");
const galleryRouter = express_1.default.Router();
galleryRouter.post('/uploadimage', multerImage_1.default, GalleryController_1.createGalleryItem);
galleryRouter.get('/getimages', GalleryController_1.getGalleryItems);
galleryRouter.get('/deleteimage', GalleryController_1.deleteGalleryItem);
exports.default = galleryRouter;
