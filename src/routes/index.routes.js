import { Router } from "express";
import gamesRouter  from "./games.routes.js";
import clientRouter from "./client.routes.js";

const router = Router();

router.use(gamesRouter);
router.use(clientRouter);

export default router;