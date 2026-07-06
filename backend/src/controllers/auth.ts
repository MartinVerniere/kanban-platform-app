import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { Router } from 'express';
import { tokenExtractor, userExtractor } from '../utils/middleware.js';
import { SECRET } from '../utils/config.js';
import { prisma } from '../prisma.js';
import type { User } from '../generated/prisma/client.js';

const authRouter: Router = Router();

authRouter.post('/register', async (request: Request, response: Response) => {
	const { username, email, password } = request.body;

	if (!username) return response.status(400).json({ message: 'Username is required' });
	if (!email) return response.status(400).json({ message: 'Email is required' });
	if (!password) return response.status(400).json({ message: 'Password is required' });

	if (password.length < 8) return response.status(400).json({ message: 'Password must be at least 8 characters long' });

	const usernameTaken: User | null  = await prisma.user.findUnique({ where: { username } });
	if (usernameTaken) return response.status(400).json({ message: 'Username is already taken' });

	const emailTaken: User | null = await prisma.user.findUnique({ where: { email } });
	if (emailTaken) return response.status(400).json({ message: 'Email is already registered' });

	const hashedPassword: string = await bcrypt.hash(password, 10);

	const newUser: User = await prisma.user.create({
		data: {
			email,
			username,
			passwordHash: hashedPassword,
		},
	});

	return response.status(201).json({
		id: newUser.id,
		username: newUser.username,
		email: newUser.email,
	});
});

authRouter.post('/login', async (request: Request, response: Response) => {
	const { username, password } = request.body;

	if (!username) return response.status(400).json({ message: 'Username is required' });
	if (!password) return response.status(400).json({ message: 'Password is required' });

	const user: User | null  = await prisma.user.findUnique({ where: { username } });
	if (!user) return response.status(401).json({ message: 'Invalid username or password' });

	const passwordMatch: boolean = await bcrypt.compare(password, user.passwordHash);

	if (!passwordMatch) return response.status(401).json({ message: 'Invalid username or password' });

	const payload = { id: user.id, username: user.username };

	if (!SECRET) throw new Error("JWT secret is not defined");

	const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });

	return response.status(200).json({
		user: {
			id: user.id,
			username: user.username,
			email: user.email
		},
		token
	});
});

authRouter.get('/me', tokenExtractor, userExtractor, async (request: Request, response: Response) => {
	return response.json({
		id: request.user.id,
		username: request.user.username,
		email: request.user.email
	});
});

export default authRouter;