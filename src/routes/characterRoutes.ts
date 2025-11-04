import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { characterController } from "../controllers/characterController";

const router = Router();

router.get('/', authMiddleware, characterController.get);

router.post('/move-inventory', authMiddleware, characterController.moveInventory);
router.post('/swap-equipment', authMiddleware, characterController.swapEquipment);
router.post('/equip', authMiddleware, characterController.equip);
router.post('/unequip', authMiddleware, characterController.unequip);
router.post('/', authMiddleware, characterController.create);


export default router