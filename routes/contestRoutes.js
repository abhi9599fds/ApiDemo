import { Router } from "express";
import * as ContestControllers from "../controllers/ContestControllers.js"

const ContestRouter = Router();

ContestRouter.post("/createContest" ,ContestControllers.createContest);
ContestRouter.get("/getContestAll",ContestControllers.getContestAll);
ContestRouter.post("/getContestByAcademy",ContestControllers.getContestByAcademy);
ContestRouter.delete("/deleteContest",ContestControllers.deleteContest);
ContestRouter.post("/winner",ContestControllers.winner);
ContestRouter.post("/getWinnerAcademy", ContestControllers.getWinnerAcademy);
ContestRouter.post("/getWinner",ContestControllers.getWinner);
ContestRouter.post("/mywon",ContestControllers.getWinnerUser);
ContestRouter.post("/getAllMainMid",ContestControllers.getContestMid);


export { ContestRouter };