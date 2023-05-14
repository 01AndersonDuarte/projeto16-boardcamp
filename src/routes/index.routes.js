import { Router } from "express";
import gamesRouter  from "./games.routes.js";
import clientRouter from "./client.routes.js";
import rentalsRouter from "../routes/rentals.routes.js";

const router = Router();

router.use(gamesRouter);
router.use(clientRouter);
router.use(rentalsRouter);

export default router;