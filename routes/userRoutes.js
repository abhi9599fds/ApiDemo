import { Router } from "express";
import { jwtTokenAuth } from "../middleware/authMiddleware.js";
import { createUser , login , deleteAll ,deleteOne , getUserAll } from "../controllers/UserControllers.js";

const UserRoutes = Router();

UserRoutes.post("/create",createUser);
UserRoutes.post("/login" ,login );
UserRoutes.delete("/deleteAll",jwtTokenAuth ,deleteAll );
UserRoutes.delete("/deleteOne",jwtTokenAuth ,deleteOne );
UserRoutes.get("/getUserAll",getUserAll);

export { UserRoutes };