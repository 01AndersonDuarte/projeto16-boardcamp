import { Router } from "express";

import { postGames, getGames } from "../controllers/games.controller.js";
import { addGames } from "../schemas/addGames.schema.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";

const gamesRouter = Router();

gamesRouter.post("/games", schemaValidation(addGames), postGames);
gamesRouter.get("/games", getGames);
export default gamesRouter;