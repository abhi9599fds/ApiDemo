import * as PostControllers from "../controllers/PostControllers.js";
import { Router } from "express";

const PostRouter = Router();
PostRouter.post("/createPost",PostControllers.createPost );
PostRouter.post("/getContestPost", PostControllers.getContestPost);
PostRouter.get("/getPostAll", PostControllers.getPostAll);
PostRouter.delete("/deletePost", PostControllers.deletePost);
PostRouter.post("/loadPost",PostControllers.loadPost )

export { PostRouter };