import express from "express"
import { getAllFirstTimers, registerFirstTimer } from "../controller/FirstTimercontroller";
import uploadBlogImage from "../config/multer";
import { createBlogPost, deleteBlogPostByIdSimple, getAllBlogPosts, getBlogPostById, getBlogsSummary, updateBlogPost } from "../controller/BlogController";


const blogRouter = express.Router()


blogRouter.post("/creatblog", uploadBlogImage, createBlogPost);
blogRouter.get("/allblogs", getAllBlogPosts);
blogRouter.get("/getoneblog/:id", getBlogPostById);
blogRouter.get("/deleteoneblog/:id", deleteBlogPostByIdSimple);
blogRouter.get("/updateoneblog/:id", updateBlogPost);
blogRouter.get("/getblogsummary", getBlogsSummary);


export default blogRouter;