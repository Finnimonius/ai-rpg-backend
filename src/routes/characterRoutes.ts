import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { characterController } from "../controllers/characterController";

const router = Router();

router.post('/equip', authMiddleware, characterController.equip);
router.post('/', authMiddleware, characterController.create);

router.get('/', authMiddleware, characterController.get);

export default router