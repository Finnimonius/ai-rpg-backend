import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post('/register', authMiddleware, userController.register);
router.post('/login', userController.login);
router.post('/profile', authMiddleware, userController.getProfile);

export default router