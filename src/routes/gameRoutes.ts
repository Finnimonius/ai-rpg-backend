import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { gameController } from "../controllers/gameController";

const router = Router();

router.get('/', authMiddleware, gameController.getGame);
router.post('/', authMiddleware, gameController.createGame);
router.delete('/', authMiddleware, gameController.deleteGame);

router.post('/move', authMiddleware, gameController.moveToLocation);

export default router