import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { characterController } from "../controllers/characterController";

const router = Router();

// Character
router.get('/', authMiddleware, characterController.get);
router.post('/', authMiddleware, characterController.create);
router.delete('/', authMiddleware, characterController.delete);

//Equipment
router.post('/equip', authMiddleware, characterController.equip);
router.post('/unequip', authMiddleware, characterController.unequip);
router.post('/move-inventory', authMiddleware, characterController.moveInventory);
router.post('/swap-equipment', authMiddleware, characterController.swapEquipment);
router.post('/add-to-inventory', authMiddleware, characterController.addItemToInventory);


export default router