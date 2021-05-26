import { Router } from "express";
import * as LikesControllers from "../controllers/LikesControllers.js";
import { jwtTokenAuth } from "../middleware/authMiddleware.js";


const LikeRouter = Router();

LikeRouter.post('/like',jwtTokenAuth,LikesControllers.like);


export { LikeRouter };