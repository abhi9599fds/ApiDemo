import { Router } from "express";
import { createContest ,getContestAll ,getContestByAcademy ,
    deleteContest , winner ,getWinnerAcademy ,getWinnerUser } from "../controllers/ContestControllers.js";


const ContestRouter = Router();

ContestRouter.post("/createContest" ,createContest);
ContestRouter.get("/getContestAll",getContestAll);
ContestRouter.post("/getContestByAcademy",getContestByAcademy);
ContestRouter.delete("/deleteContest",deleteContest);
ContestRouter.put("/winnerInsert",winner);
ContestRouter.post("/getWinnerAcademy", getWinnerAcademy);
ContestRouter.post("/getWinner",getWinnerUser);

export { ContestRouter };