import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { blogModel } from '../model/BlogModel';



// Upload blog image to Cloudinary and create new blog post
export const createBlogPost = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blogs' // Optional: Folder in Cloudinary where images will be stored
        });

        // Create new blog post with Cloudinary URL
        const newBlogPost = new blogModel({
            blogImage: result.secure_url,
            author: req.body.author,
            title: req.body.title,
            details: req.body.details
        });

        await newBlogPost.save();

        // Fetch all blog posts sorted by createdAt timestamp in descending order
        const allBlogPosts = await blogModel.find().sort({ createdAt: -1 });

        res.status(201).json(allBlogPosts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// Get all blog posts
export const getAllBlogPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const blogPosts = await blogModel.find();
        res.status(200).json(blogPosts);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


// Get one blog post by ID
export const getBlogPostById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const blogPost = await blogModel.findById(id);
        if (blogPost) {
            res.status(200).json(blogPost);
        } else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
