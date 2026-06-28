import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import dns from 'dns';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? (process.env.RENDER_EXTERNAL_URL || process.env.CORS_ORIGIN || 'https://college-resource-sharing.onrender.com')
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-resource-platform');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;
