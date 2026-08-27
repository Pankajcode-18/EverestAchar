import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import apiRouter from './routes/api';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow localhost on any port in development
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);

// Logging
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiter for Chat & Order endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use('/api', apiLimiter);

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api', apiRouter);

// Centralized error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`🏔️ Everest Nepali Achar Server running on http://localhost:${ENV.PORT}`);
  });
};

startServer();
