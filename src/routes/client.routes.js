import { Router } from "express";

import { postClient, getClients, getOneClient, updateOneClient } from "../controllers/client.controller.js";
import { addClient } from "../schemas/addClient.schema.js";
import schemaValidation from "../middlewares/schemaValidation.middleware.js";

const clientRouter = Router();

clientRouter.post("/customers", schemaValidation(addClient), postClient);
clientRouter.get("/customers", getClients);
clientRouter.get("/customers/:id", getOneClient);
clientRouter.put("/customers/:id", schemaValidation(addClient), updateOneClient);

export default clientRouter;