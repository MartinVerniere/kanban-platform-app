import express from 'express';
import cors from 'cors';

import authRouter from './controllers/auth.js';
import { loggerMiddleware } from './utils/middleware.js';
import projectRouter from './controllers/project.js';
import userRouter from './controllers/user.js';

export const app = express();

app.use(loggerMiddleware);
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);