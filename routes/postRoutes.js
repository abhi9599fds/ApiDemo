import { createPost, getContestPost, getPostAll, deletePost ,loadPost } from "../controllers/PostControllers.js";
import { Router } from "express";

const PostRouter = Router();
PostRouter.post("/createPost",createPost );
PostRouter.post("/getContestPost", getContestPost);
PostRouter.get("/getPostAll", getPostAll);
PostRouter.delete("/deletePost", deletePost);
PostRouter.post("/loadPost",loadPost )

export { PostRouter };