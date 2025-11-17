import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { treasureController } from "../controllers/treasureController";

const router = Router()

// Treasure
router.post('/treasure/open', authMiddleware, treasureController.openTreasure);
router.post('/treasure/take', authMiddleware, treasureController.takeReward);
router.post('/treasure/skip', authMiddleware, treasureController.skipReward);

// Combat
router.post('/combat', authMiddleware)

export default router