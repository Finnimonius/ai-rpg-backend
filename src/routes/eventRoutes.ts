import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { eventService } from "../services/eventService";
import { eventController } from "../controllers/eventController";

const router = Router()

router.post('/treasure/open', authMiddleware, eventController.openTreasure);
router.post('/treasure/take', authMiddleware, eventController.takeReward);

export default router