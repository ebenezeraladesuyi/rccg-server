"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogPost = exports.deleteBlogPostByIdSimple = exports.getBlogsSummary = exports.getBlogPostById = exports.getAllBlogPosts = exports.createBlogPost = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const BlogModel_1 = require("../model/BlogModel");
// Upload blog image to Cloudinary and create new blog post
const createBlogPost = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        // Upload image to Cloudinary
        const result = await cloudinary_1.default.uploader.upload(req.file.path, {
            folder: 'blogs' // Optional: Folder in Cloudinary where images will be stored
        });
        // Create new blog post with Cloudinary URL
        const newBlogPost = new BlogModel_1.blogModel({
            blogImage: result.secure_url,
            author: req.body.author,
            title: req.body.title,
            details: req.body.details
        });
        await newBlogPost.save();
        // Fetch all blog posts sorted by createdAt timestamp in descending order
        const allBlogPosts = await BlogModel_1.blogModel.find().sort({ createdAt: -1 });
        res.status(201).json(allBlogPosts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBlogPost = createBlogPost;
// Get all blog posts
const getAllBlogPosts = async (req, res) => {
    try {
        const blogPosts = await BlogModel_1.blogModel.find();
        res.status(200).json(blogPosts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllBlogPosts = getAllBlogPosts;
// Get one blog post by ID
const getBlogPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const blogPost = await BlogModel_1.blogModel.findById(id);
        if (blogPost) {
            res.status(200).json(blogPost);
        }
        else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBlogPostById = getBlogPostById;
// get all blog summary
const getBlogsSummary = async (req, res) => {
    try {
        const blogPosts = await BlogModel_1.blogModel.find()
            .select('_id title author createdAt blogImage')
            .sort({ createdAt: -1 });
        res.status(200).json(blogPosts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBlogsSummary = getBlogsSummary;
// delete one blog
const deleteBlogPostByIdSimple = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBlogPost = await BlogModel_1.blogModel.findByIdAndDelete(id);
        if (deletedBlogPost) {
            // Get updated list of blog posts
            const updatedBlogPosts = await BlogModel_1.blogModel.find().sort({ createdAt: -1 });
            res.status(200).json({
                message: 'Blog post deleted successfully',
                deletedBlogPost,
                blogPosts: updatedBlogPosts
            });
        }
        else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteBlogPostByIdSimple = deleteBlogPostByIdSimple;
// Update one blog post
const updateBlogPost = async (req, res) => {
    const { id } = req.params;
    const { author, title, details } = req.body;
    try {
        const updatedData = { author, title, details };
        // If there's a new image file, upload it to Cloudinary
        if (req.file) {
            // Upload new image to Cloudinary
            const result = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: 'blogs'
            });
            updatedData.blogImage = result.secure_url;
            // Optionally delete old image from Cloudinary
            // You can extract and delete old image if needed
        }
        const updatedBlogPost = await BlogModel_1.blogModel.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });
        if (updatedBlogPost) {
            res.status(200).json(updatedBlogPost);
        }
        else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateBlogPost = updateBlogPost;
