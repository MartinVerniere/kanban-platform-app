import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { SECRET } from './config.js';
import { prisma } from '../prisma.js';
import type { User } from '../generated/prisma/client.js';

interface TokenPayload {
	id: number;
	username: string;
}

export const loggerMiddleware = (
	request: Request,
	response: Response,
	next: NextFunction
): void => {
	const startedAt = new Date();

	console.log(`[${startedAt.toISOString()}] Started ${request.method} ${request.originalUrl}`);

	response.on("finish", () => {
		const endedAt = new Date();
		const duration: number = endedAt.getTime() - startedAt.getTime();

		console.log(`[${endedAt.toISOString()}] Finished ${request.method} ${request.originalUrl} ${response.statusCode} (${duration}ms)`);
	});

	next();
};

export const tokenExtractor = (
	request: Request,
	response: Response,
	next: NextFunction
): void => {
	const authorization: string | undefined = request.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		try {
			const secret: string | undefined = SECRET;
			if (!secret) throw new Error("JWT secret is not defined");

			request.decodedToken = jwt.verify(authorization.substring(7), secret) as TokenPayload;
		} catch {
			response.status(401).json({ error: 'token invalid' });
			return
		}
	} else {
		response.status(401).json({ error: 'token missing' });
		return
	}

	next();
}

export const userExtractor = async (
	request: Request,
	response: Response,
	next: NextFunction
): Promise<void> => {
	const userId: number = request.decodedToken.id;

	const user: User | null = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) {
		response.status(404).json({ message: 'User not found' });
		return;
	}

	request.user = user;

	next();
}
