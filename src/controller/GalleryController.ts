
import galleryModel from '../model/GalleryModel';
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

// create image
export const createGalleryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'gallery' // Optional: Folder in Cloudinary where images will be stored
        });

        // Create new gallery item with Cloudinary URL
        const newGalleryItem = new galleryModel({ gacImage: result.secure_url });
        await newGalleryItem.save();

        // Fetch all gallery items sorted by createdAt timestamp in descending order
        const allGalleryItems = await galleryModel.find().sort({ createdAt: -1 });

        res.status(201).json(allGalleryItems);
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
};


// get all images
export const getGalleryItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const galleryItems = await galleryModel.find();
        res.status(200).json(galleryItems);
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
};


// get one image
export const getGalleryItemById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const galleryItem = await galleryModel.findById(id);
        if (galleryItem) {
            res.status(200).json(galleryItem);
        } else {
            res.status(404).json({ message: 'Gallery item not found' });
        }
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
};


// update image
export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { pics } = req.body;
    try {
        const updatedGalleryItem = await galleryModel.findByIdAndUpdate(id, { pics }, { new: true });
        if (updatedGalleryItem) {
            res.status(200).json(updatedGalleryItem);
        } else {
            res.status(404).json({ message: 'Gallery item not found' });
        }
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
};


// delete image
export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const deletedGalleryItem = await galleryModel.findByIdAndDelete(id);
        if (deletedGalleryItem) {
            res.status(200).json({ message: 'Gallery item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Gallery item not found' });
        }
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
};
