import { Request, Response } from 'express';
import { User, Phase, PDF, ActivityLog, LoginLog } from '../models/index.js';
import { sendCredentialsEmail } from '../utils/email.js';
import fs from 'fs';
import mongoose from 'mongoose';

// ---- DASHBOARD ----
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ role: 'User', isDeleted: { $ne: true } });
    const activeUsers = await User.countDocuments({ role: 'User', isBlocked: false, isDeleted: { $ne: true } });
    const blockedUsers = await User.countDocuments({ role: 'User', isBlocked: true, isDeleted: { $ne: true } });
    const totalPhases = await Phase.countDocuments();
    const totalPDFs = await PDF.countDocuments();

    // Recent Logins
    const recentLogins = await LoginLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Map populated user to match old response format
    const formattedLogins = recentLogins.map(log => {
      const logObj = log.toObject();
      return {
        ...logObj,
        user: logObj.userId
      };
    });

    res.json({
      totalUsers,
      activeUsers,
      blockedUsers,
      totalPhases,
      totalPDFs,
      recentLogins: formattedLogins,
      maxUsers: 500,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

// ---- USER MANAGEMENT ----
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const sortBy = req.query.sortBy as string || 'createdAt';
    const order = req.query.order as string === 'asc' ? 1 : -1;

    const query: any = { isDeleted: { $ne: true }, role: 'User' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, mobile, email, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const currentUsers = await User.countDocuments({ role: 'User', isDeleted: { $ne: true } });
    if (currentUsers >= 500) {
      res.status(403).json({ message: 'User limit reached. Cannot create more than 500 users.' });
      return;
    }

    // Auto-generate password: First 4 chars of email + @ + Last 4 digits of mobile
    const emailPrefix = email.split('@')[0].slice(0, 4);
    const mobileSuffix = mobile.slice(-4);
    const generatedPassword = `${emailPrefix}@${mobileSuffix}`;

    const user = await User.create({ name, mobile, email, password: generatedPassword, role });
    
    // Send email with credentials
    const appUrl = process.env.APP_URL || 'http://localhost:5173/login';
    await sendCredentialsEmail(email, generatedPassword, appUrl);

    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json(userObj);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.name = req.body.name || user.name;
    user.mobile = req.body.mobile || user.mobile;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    if (req.body.isBlocked !== undefined) {
      user.isBlocked = req.body.isBlocked;
    }
    const updated = await user.save();
    const updatedObj = updated.toObject();
    delete updatedObj.password;
    res.json(updatedObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    // Soft delete
    (user as any).isDeleted = true;
    await user.save();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    user.password = req.body.password;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ---- PHASE MANAGEMENT ----
export const getPhases = async (req: Request, res: Response): Promise<void> => {
  try {
    const phases = await Phase.find().sort({ order: 1 });
    res.json(phases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPhase = async (req: Request, res: Response): Promise<void> => {
  const { name, description, order } = req.body;
  try {
    let coverImagePath = null;
    if (req.file) {
      coverImagePath = req.file.path;
    }
    const phase = await Phase.create({ name, description, order: order || 0, coverImagePath });
    res.status(201).json(phase);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// ---- PDF MANAGEMENT ----
export const uploadPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files || !files.pdf || !files.thumbnail) {
      res.status(400).json({ message: 'Please provide both PDF and thumbnail' });
      return;
    }
    const { title, description, phaseId, order, subject } = req.body;

    let actualPhaseId = phaseId;
    if (!actualPhaseId) {
      const phaseName = subject || 'General Phase';
      let phase = await Phase.findOne({ name: phaseName });
      if (!phase) {
        phase = await Phase.create({ name: phaseName, description: phaseName, order: 0 });
      }
      actualPhaseId = phase._id;
    }

    const pdf = await PDF.create({
      title,
      description,
      phaseId: actualPhaseId,
      order: order || 0,
      filePath: files.pdf[0].path,
      thumbnailPath: files.thumbnail[0].path,
    });
    res.status(201).json(pdf);
  } catch (error) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files) {
      if (files.pdf && files.pdf[0] && fs.existsSync(files.pdf[0].path)) {
        fs.unlinkSync(files.pdf[0].path);
      }
      if (files.thumbnail && files.thumbnail[0] && fs.existsSync(files.thumbnail[0].path)) {
        fs.unlinkSync(files.thumbnail[0].path);
      }
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPDFs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phaseId } = req.query;
    const whereClause = phaseId ? { phaseId } : {};
    const pdfs = await PDF.find(whereClause).sort({ order: 1 });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ---- ACCESS MANAGEMENT ----
export const assignPhasesToUser = async (req: Request, res: Response): Promise<void> => {
  const { userId, phaseIds } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    // phaseIds should be an array of ObjectIds or valid string representations
    user.assignedPhases = phaseIds.map((id: string) => new mongoose.Types.ObjectId(id));
    await user.save();
    res.json({ message: 'Phases assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserPhases = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).populate('assignedPhases', 'id name');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user.assignedPhases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
