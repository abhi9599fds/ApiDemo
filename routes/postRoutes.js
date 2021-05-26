import * as PostControllers from "../controllers/PostControllers.js";
import { Router } from "express";
import { jwtTokenAuth } from "../middleware/authMiddleware.js";

const PostRouter = Router();
PostRouter.post("/createPost",jwtTokenAuth,PostControllers.createPost );
PostRouter.post("/getContestPost", PostControllers.getContestPost);
PostRouter.get("/getPostAll", PostControllers.getPostAll);
PostRouter.delete("/deletePost", PostControllers.deletePost);
PostRouter.post("/loadPost",PostControllers.loadPost );
PostRouter.post('/getContestPost_mid_likes',PostControllers.getContestPostLikes);
PostRouter.post('/editCaption',PostControllers.editCaption);
PostRouter.post('/editPrivate',PostControllers.editPrivate);


export { PostRouter };