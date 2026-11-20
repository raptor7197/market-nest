import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
];

// Match tunnel hosts by hostname suffix only, so origins like
// "https://evil.com.ngrok.io.attacker.com" are rejected.
const allowedHostSuffixes = ['.ngrok.io', '.ngrok-free.app'];

const isAllowedOrigin = (origin) => {
  if (allowedOrigins.includes(origin)) return true;
  try {
    const url = new URL(origin);
    return (
      url.protocol === 'https:' &&
      allowedHostSuffixes.some((suffix) => url.hostname.endsWith(suffix))
    );
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin/server-to-server requests (no Origin header).
    if (!origin) return callback(null, true);
    return callback(null, isAllowedOrigin(origin));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
