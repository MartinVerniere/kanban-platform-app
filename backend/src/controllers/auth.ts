import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

const authRouter: Router = Router();

const userMiddleware = (request: Request, response: Response, next: NextFunction) => {
	console.log("Going trough userMiddleware");
	next();
}

authRouter.post('/register', async (request: Request, response: Response) => {
	response.status(201).json({ message: 'User registered successfully' });
});

authRouter.post('/login', userMiddleware, async (request: Request, response: Response) => {
	response.status(200).json({ message: 'Login successful' });
});

authRouter.get('/me', userMiddleware, async (request: Request, response: Response) => {
	response.status(200).json({ message: 'User information retrieved successfully' });
});

export default authRouter;