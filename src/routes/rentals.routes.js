import { Router } from "express";

import { postRental } from "../controllers/rentals.controller.js"
import { addRental } from "../schemas/addRental.schema.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", schemaValidation(addRental), postRental);

export default rentalsRouter;