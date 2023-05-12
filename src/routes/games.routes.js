import { Router } from "express";

import { postGames } from "../controllers/games.controller.js";
import { addGames } from "../schemas/addGames.schema.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";

const gamesRouter = Router();

gamesRouter.post("/games", schemaValidation(addGames), postGames);

export default gamesRouter;