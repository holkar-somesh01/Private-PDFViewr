import express from 'express';
import { streamPDF, getThumbnail } from '../controllers/pdfController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Thumbnail is public because <img> tags cannot send Bearer tokens
router.get('/thumbnail/:id', getThumbnail);

router.use(protect);
router.get('/stream/:id', streamPDF);

export default router;
