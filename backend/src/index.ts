import express from 'express';
import cors from 'cors';
import authRouter from './controllers/auth.js';
import dotenv from 'dotenv';
import { PORT } from './utils/config.js';
import { loggerMiddleware } from './utils/middleware.js';
import projectRouter from './controllers/project.js';

dotenv.config();

export const app: express.Application = express();

app.use(loggerMiddleware);
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/projects', projectRouter);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});