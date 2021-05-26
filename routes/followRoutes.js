import { Router } from "express"
import * as FollowControllers from "../controllers/FollowControllers.js";

import { jwtTokenAuth } from "../middleware/authMiddleware.js";
const FollowRouter = Router();


FollowRouter.post('/create', jwtTokenAuth ,FollowControllers.createFollow);
FollowRouter.post('/getFollowing_mid' ,FollowControllers.getFollowing);
FollowRouter.post('/getFollowers_mid',FollowControllers.getFollower);


export { FollowRouter };