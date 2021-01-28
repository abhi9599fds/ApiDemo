import { Router } from "express";
import { jwtTokenAuth } from "../middleware/authMiddleware.js";
import * as UserControllers from "../controllers/UserControllers.js";

const UserRoutes = Router();

UserRoutes.post("/create",UserControllers.createUser);
UserRoutes.post("/login" ,UserControllers.login );
UserRoutes.delete("/deleteAll",jwtTokenAuth ,UserControllers.deleteAll );
UserRoutes.delete("/deleteOne",jwtTokenAuth ,UserControllers.deleteOne );
UserRoutes.get("/getUserAll",UserControllers.getUserAll);

export { UserRoutes };