import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PDF, User, Phase, ActivityLog } from '../models/index.js';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { Transform } from 'stream';
export const streamPDF = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      res.status(404).json({ message: 'PDF not found' });
      return;
    }
    
    // Check if user is assigned to the phase this PDF belongs to
    const user = await User.findById(req.user.id).populate('assignedPhases');
    const assignedPhaseIds = (user as any)?.assignedPhases.map((p: any) => p._id.toString()) || [];
    
    if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin' && !assignedPhaseIds.includes(pdf.phaseId.toString())) {
      res.status(403).json({ message: 'Not authorized to stream this PDF' });
      return;
    }

    const filePath = path.resolve(pdf.filePath);
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'File not found on server' });
      return;
    }

    // Log the PDF view
    await ActivityLog.create({
      userId: req.user.id,
      action: 'Viewed PDF',
      details: `PDF ID: ${pdf._id}, Title: ${pdf.title}`,
      ipAddress: req.ip || req.connection.remoteAddress || 'Unknown IP'
    });

    res.setHeader('Content-Type', 'application/octet-stream');
    // Important: Cache-Control prevents browser from caching the PDF to disk
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Content-Disposition', 'inline; filename="secure.dat"');
    
    const readStream = fs.createReadStream(filePath);
    
    // Simple XOR cipher to prevent casual network ripping
    const xorKey = Buffer.from('AYURDNYANAM_SECURE_KEY_2026');
    class XorTransform extends Transform {
      private keyIndex = 0;
      _transform(chunk: Buffer, encoding: string, callback: Function) {
        for (let i = 0; i < chunk.length; i++) {
          chunk[i] = chunk[i] ^ xorKey[this.keyIndex % xorKey.length];
          this.keyIndex++;
        }
        this.push(chunk);
        callback();
      }
    }
    
    readStream.pipe(new XorTransform()).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getThumbnail = async (req: Request, res: Response): Promise<void> => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf || !pdf.thumbnailPath) {
      res.status(404).send('Not found');
      return;
    }
    const filePath = path.resolve(pdf.thumbnailPath);
    if (!fs.existsSync(filePath)) {
      res.status(404).send('Not found');
      return;
    }
    res.sendFile(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
