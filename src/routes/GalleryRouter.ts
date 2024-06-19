import express from "express";
import uploadImage from "../config/multerImage";
import { createGalleryItem, deleteGalleryItem, getGalleryItems } from "../controller/GalleryController";


const galleryRouter = express.Router();

galleryRouter.post('/uploadimage', uploadImage, createGalleryItem);
galleryRouter.get('/getimages', getGalleryItems);
galleryRouter.get('/deleteimage', deleteGalleryItem);



export default galleryRouter;
