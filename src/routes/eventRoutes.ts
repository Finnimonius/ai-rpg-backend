import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { eventService } from "../services/eventService";

const router = Router()

router.post('/treasure/open', authMiddleware, eventService.openTreasure);
router.post('/treasure/take', authMiddleware, eventService.takeReward);

export default router