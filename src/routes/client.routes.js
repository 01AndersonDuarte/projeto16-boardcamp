import { Router } from "express";

import { postClient } from "../controllers/client.controller.js";
import { addClient } from "../schemas/addClient.schema.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";

const clientRouter = Router();

clientRouter.post("/client", schemaValidation(addClient), postClient);

export default clientRouter;