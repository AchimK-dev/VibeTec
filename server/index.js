import 'dotenv/config';
import './db/index.js';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import artistRouter from './routes/artistRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import userRouter from './routes/userRouter.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { initializeDemoData, simulateRandomActivity } from './utils/demoDataGenerator.js';

const app = express();
const port = process.env.PORT || 8000;
import path from 'path';
import { fileURLToPath } from 'url';
app.use(cookieParser());
/**
 * The `credentials: true` option in the CORS middleware is set to allow cookies and authentication headers
 * to be sent and received between the client and server. This is necessary for handling sessions or JWT tokens
 * stored in cookies, enabling secure cross-origin authentication.
 */
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/artists', artistRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/users', userRouter);
// this need to be after all routes
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  //*Set static folder up in production
  const buildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(buildPath));

  app.get('*splat', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
} else {
  // THIS SHOULD BE BEFORE THE ERROR HANDLERs - only in development
  app.use((req, res) => res.status(404).json({ error: 'Not found' }));
}
app.use(errorHandler);

// Initialize demo data when server starts
const startDemoDataSystem = async () => {
  // Initial demo data on startup
  await initializeDemoData();

  // Simulate activity only every 60 minutes (instead of 5-15 minutes)
  setInterval(async () => {
    await simulateRandomActivity();
  }, 60 * 60 * 1000); // Every hour (60 minutes)
};

app.listen(port, async () => {
  // Start demo data system after server startup
  setTimeout(() => {
    startDemoDataSystem();
  }, 2000); // 2 seconds delay for DB connection
});
