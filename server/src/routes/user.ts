import express from 'express';
import { getAssignedPhases, getPDFsForPhase } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/phases', getAssignedPhases);
router.get('/phases/:phaseId/pdfs', getPDFsForPhase);

export default router;
