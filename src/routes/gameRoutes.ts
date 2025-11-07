import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post('/start', authMiddleware)

export default router