"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogPostById = exports.getAllBlogPosts = exports.createBlogPost = void 0;
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
