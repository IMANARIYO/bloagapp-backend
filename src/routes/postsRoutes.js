import express from "express";
import { createPost, deletePost, getPost, getPosts, getUserPosts, updatePost } from "../controllers/postsControllers.js";
import { uploadMiddleware } from "../middlewares/uploadMiddlewareMulter.js";
import { Authenticate } from "../utils/jwtfunctions.js";

const postsRouter = express.Router();
postsRouter.get('/', getPosts);
postsRouter.get('/:id', getPost);
postsRouter.get('/user/:userId', getUserPosts);
postsRouter.use(Authenticate)
postsRouter.post('/',uploadMiddleware, createPost);
postsRouter.put('/:id',uploadMiddleware, updatePost);
postsRouter.delete('/:id', deletePost);
export default postsRouter;
