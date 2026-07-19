import { Request, Response } from 'express';
import { User, Phase, PDF } from '../models/index.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';

export const getAssignedPhases = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).populate('assignedPhases');

    let phases = (user as any)?.assignedPhases || [];
    // Sort by order
    phases.sort((a: any, b: any) => a.order - b.order);

    // map _id to id to maintain frontend compatibility
    const formattedPhases = phases.map((phase: any) => {
      const p = phase.toObject ? phase.toObject() : phase;
      p.id = p._id;
      return p;
    });

    res.json(formattedPhases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPDFsForPhase = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const phaseId = req.params.phaseId;

    // Check access
    const user = await User.findById(req.user.id).populate('assignedPhases');
    const assignedPhaseIds = (user as any)?.assignedPhases.map((p: any) => p._id.toString()) || [];

    if (!assignedPhaseIds.includes(phaseId)) {
      res.status(403).json({ message: 'Not authorized for this phase' });
      return;
    }

    const pdfs = await PDF.find({ phaseId, status: 'Active' })
      .select('_id title description thumbnailPath order')
      .sort({ order: 1 });

    // map _id to id to maintain frontend compatibility
    const formattedPdfs = pdfs.map(pdf => {
      const p = pdf.toObject();
      p.id = p._id;
      return p;
    });

    res.json(formattedPdfs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
