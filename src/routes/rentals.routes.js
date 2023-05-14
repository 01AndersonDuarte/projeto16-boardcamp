import { Router } from "express";

import { postRental, getRentals, finishRent, deleteRent } from "../controllers/rentals.controller.js"
import { addRental } from "../schemas/addRental.schema.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", schemaValidation(addRental), postRental);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals/:id/return", finishRent);
rentalsRouter.delete("/rentals/:id", deleteRent);

export default rentalsRouter;