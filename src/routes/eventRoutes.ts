import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { treasureController } from "../controllers/treasureController";
import { combatController } from "../controllers/combatController";

const router = Router()

// Treasure
router.post('/treasure/open', authMiddleware, treasureController.openTreasure);
router.post('/treasure/take', authMiddleware, treasureController.takeReward);
router.post('/treasure/skip', authMiddleware, treasureController.skipReward);

// Combat
router.post('/combat/action', authMiddleware, combatController.performAction);
router.post('/combat/flee', authMiddleware, combatController.flee)

export default router