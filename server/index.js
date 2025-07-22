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

  app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
} else {
  // THIS SHOULD BE BEFORE THE ERROR HANDLERs - only in development
  app.use((req, res) => res.status(404).json({ error: 'Not found' }));
}
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
