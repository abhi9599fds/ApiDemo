import { Router } from "express";
import { jwtTokenAuth } from "../middleware/authMiddleware.js";
import { createUser , login ,
    deleteAll ,deleteOne } from "../controllers/UserControllers.js";
const UserRoutes = Router();

UserRoutes.post("/create",createUser);
UserRoutes.post("/login" ,login );
UserRoutes.delete("/deleteAll",jwtTokenAuth ,deleteAll );
UserRoutes.delete("/deleteOne",jwtTokenAuth ,deleteOne );

export { UserRoutes };