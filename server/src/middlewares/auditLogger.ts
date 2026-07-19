import { Request, Response, NextFunction } from 'express';
import { ActivityLog } from '../models/index.js';

const getReadableAction = (method: string, url: string, body: any): string => {
  if (url.includes('/auth/login')) return 'User logged in';
  if (url.includes('/auth/register')) return 'User registered';
  if (url.includes('/auth/logout')) return 'User logged out';
  
  if (url.includes('/admin/users') && method === 'POST') return 'Admin created a user';
  if (url.includes('/admin/users') && method === 'PUT') return 'Admin updated a user';
  if (url.includes('/admin/users') && method === 'DELETE') return 'Admin deleted a user';
  
  if (url.includes('/admin/pdfs') && method === 'POST') return 'Admin uploaded a PDF';
  if (url.includes('/admin/pdfs') && method === 'DELETE') return 'Admin deleted a PDF';
  
  if (url.includes('/admin/phases') && method === 'POST') return 'Admin created a phase';
  
  if (url.includes('/permissions/assign') && method === 'POST') return 'Admin assigned phases to user';

  if (url.includes('/audit/track-pdf') && method === 'POST') {
    return `User read ${body.pagesViewed || '?'} pages of PDF: "${body.pdfTitle || 'Unknown'}"`;
  }
  
  return `${method} ${url}`; // Fallback
};

export const auditLogger = (req: Request | any, res: Response, next: NextFunction) => {
  res.on('finish', async () => {
    try {
      // Exclude all GET requests to prevent log spam when navigating the dashboard
      if (req.method === 'GET') return;
      if (req.method === 'OPTIONS') return;

      const userId = req.user ? req.user._id : undefined;
      const action = getReadableAction(req.method, req.originalUrl, req.body);
      const method = req.method;
      const endpoint = req.originalUrl;
      
      let detailsObj = { ...req.body };
      if (detailsObj.password) detailsObj.password = '***';
      if (detailsObj.oldPassword) detailsObj.oldPassword = '***';
      
      // If unauthenticated but provided an email (like login/register), log the email in details
      if (!userId && detailsObj.email) {
        detailsObj.unauthenticatedEmail = detailsObj.email;
      }

      const details = Object.keys(detailsObj).length ? JSON.stringify(detailsObj) : '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      await ActivityLog.create({
        userId,
        action,
        method,
        endpoint,
        details,
        ipAddress,
      });
    } catch (error) {
      console.error('Audit Logger Error:', error);
    }
  });

  next();
};

