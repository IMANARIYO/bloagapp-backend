import express from "express";
import { addComment, deleteComment, getALLCommentsForALLposts, getCommentById, getComments, getCommentsForUserPosts, updateComment } from "../controllers/commentController.js";
import { Authenticate } from "../utils/jwtfunctions.js";

// routes/commentRoutes.js

const CommentRouter = express.Router();
CommentRouter.get('/:postId', getComments);
CommentRouter.get('/', getALLCommentsForALLposts);

CommentRouter.get('/comment/:id', getCommentById);
CommentRouter.put('/comment/:id', updateComment);

CommentRouter.use(Authenticate);
CommentRouter.post('/:postId', addComment);
CommentRouter.delete('/comment/:id',deleteComment);
CommentRouter.get('/users/:userId/posts/comments', Authenticate, getCommentsForUserPosts);
export default CommentRouter;
