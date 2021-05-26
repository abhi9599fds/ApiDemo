import { Router } from "express";
import { jwtTokenAuth } from "../middleware/authMiddleware.js";
import * as UserControllers from "../controllers/UserControllers.js";

const UserRoutes = Router();

UserRoutes.post("/create",UserControllers.createUser);
UserRoutes.post("/createOrg" , UserControllers.createAdminUser)
UserRoutes.post("/login" ,UserControllers.login );
UserRoutes.post("/usernameExists",UserControllers.usernameExists)
UserRoutes.post("/editPic" ,jwtTokenAuth ,UserControllers.editProfilePic );
UserRoutes.post('/getById' ,UserControllers.getById);
UserRoutes.post('/getByPid' ,UserControllers.getByPostId);
UserRoutes.delete("/deleteAll",jwtTokenAuth ,UserControllers.deleteAll );
UserRoutes.delete("/deleteOne",jwtTokenAuth ,UserControllers.deleteOne );
UserRoutes.get("/getUserAll",UserControllers.getUserAll);
UserRoutes.post("/getBrandProfile",UserControllers.getBrandProfile);

export { UserRoutes };