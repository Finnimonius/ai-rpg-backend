import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authValidateRegister } from "../middleware/authValidateRegister"

const router = Router();

router.post('/register', authValidateRegister, userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile',authMiddleware, userController.updateProfile)

export default router