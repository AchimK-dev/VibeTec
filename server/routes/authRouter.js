import { Router } from 'express';
import validateZod from '../middlewares/validateZod.js';
import verifyToken from '../middlewares/verifyToken.js';
import { me, signin, signOut, signup } from '../controllers/auth.js';
import { userSchema, signInSchema } from '../zod/schemas.js';

const authRouter = Router();

authRouter.get('/me', verifyToken, me);
authRouter.post('/signin', validateZod(signInSchema), signin);
authRouter.post('/signup', validateZod(userSchema), signup);
authRouter.delete('/signout', signOut);

export default authRouter;
