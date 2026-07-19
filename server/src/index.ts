import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import pdfRoutes from './routes/pdf.js';
import userRoutes from './routes/user.js';
import auditRoutes from './routes/audit.js';
import { auditLogger } from './middlewares/auditLogger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
// @ts-ignore - TS NodeNext typing issue with helmet default export
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({ origin: true, credentials: true })); // Update origin for production
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));

// Audit Logger Middleware
app.use(auditLogger);

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  skip: (req: express.Request) => req.originalUrl.startsWith('/api/admin') || req.originalUrl.startsWith('/api/audit'),
});
app.use('/api/', apiLimiter);

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit', auditRoutes);

app.get('/', (req, res) => {
  res.send('Secure PDF Reader API is running with MongoDB');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
