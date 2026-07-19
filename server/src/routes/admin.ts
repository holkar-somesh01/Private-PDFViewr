import express from 'express';

import { 
  getUsers, createUser, updateUser, deleteUser, resetPassword, 
  getPhases, createPhase,
  uploadPDF, getPDFs, updatePDF, deletePDF,
  assignPhasesToUser, getUserPhases, getDashboardStats 
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import { upload } from '../config/multer.js';

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);

router.route('/users')
  .get(getUsers)
  .post(createUser);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.route('/users/:id/reset-password')
  .put(resetPassword);

router.route('/phases')
  .get(getPhases)
  .post(upload.single('coverImage'), createPhase);

router.route('/pdfs')
  .get(getPDFs)
  .post(upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), uploadPDF);

router.route('/pdfs/:id')
  .put(upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), updatePDF)
  .delete(deletePDF);

router.route('/users/:id/phases')
  .get(getUserPhases);
  
router.post('/permissions/assign', assignPhasesToUser);

export default router;
