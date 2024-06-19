import express from "express"
import { getAllFirstTimers, registerFirstTimer } from "../controller/FirstTimercontroller";
import uploadBlogImage from "../config/multer";
import { createBlogPost, getAllBlogPosts, getBlogPostById } from "../controller/BlogController";


const blogRouter = express.Router()


blogRouter.post("/creatblog", uploadBlogImage, createBlogPost);
blogRouter.get("/allblogs", getAllBlogPosts);
blogRouter.get("/getoneblog/:id", getBlogPostById);


export default blogRouter;