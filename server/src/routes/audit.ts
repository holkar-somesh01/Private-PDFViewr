import express from 'express';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { getAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

router.get('/', protect, admin, getAuditLogs);

// Telemetry endpoint for tracking PDF views.
// We only need 'protect' so normal users can call it.
// The auditLogger middleware will automatically intercept this and save the log!
router.post('/track-pdf', protect, async (req, res) => {
  try {
    const { PDF } = await import('../models/index.js');
    if (req.body.pdfId) {
      const pdfDoc = await PDF.findById(req.body.pdfId);
      if (pdfDoc) {
        req.body.pdfTitle = pdfDoc.title;
      }
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(200).json({ success: false });
  }
});

export default router;
