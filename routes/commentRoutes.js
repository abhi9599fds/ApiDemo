import * as CommentControllers from "../controllers/CommentControllers.js";
import { Router } from "express";
import { jwtTokenAuth } from "../middleware/authMiddleware.js";

const CommentRouter = Router();


CommentRouter.post('/create',jwtTokenAuth , CommentControllers.createComment);
CommentRouter.post('/getCommentsByPostId' , CommentControllers.getCommentPost);
CommentRouter.post('/getComments_mid' , CommentControllers.getCommentPost);


export { CommentRouter };

