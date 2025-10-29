import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authValidateRegister } from "../middleware/authValidateRegister"

const router = Router();

router.post('/register', authValidateRegister, userController.register);
router.post('/login', userController.login);
router.post('/profile', authMiddleware, userController.getProfile);

export default router