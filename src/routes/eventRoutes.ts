import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { eventController } from "../controllers/eventController";

const router = Router()

router.post('/treasure/open', authMiddleware, eventController.openTreasure);
router.post('/treasure/take', authMiddleware, eventController.takeReward);
router.post('/treasure/skip', authMiddleware, eventController.skipReward);

export default router