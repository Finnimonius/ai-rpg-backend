import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { gameController } from "../controllers/gameController";

const router = Router();

router.get('/', authMiddleware)
router.post('/', authMiddleware, gameController.createGame)

export default router