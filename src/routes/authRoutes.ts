import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authValidateRegister } from "../middleware/authValidateRegister"
import { authValidateChangePassword } from "../middleware/authValidateChangePassword";

const router = Router();

router.get('/profile', authMiddleware, userController.getProfile);

router.post('/register', authValidateRegister, userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.put('/profile',authMiddleware, userController.updateProfile);
router.put('/password', authMiddleware, authValidateChangePassword, userController.changePassword);

export default router