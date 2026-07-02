import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { users } from '../data/users.js';
import type { User } from '../models/user.js';
import { SECRET } from './config.js';

export const tokenExtractor: (request: Request, response: Response, next: NextFunction) => void = (request: Request, response: Response, next: NextFunction) => {
	const authorization: string | undefined = request.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		try {
			const secret: string | undefined = SECRET;
			if (!secret) throw new Error("JWT secret is not defined");

			request.decodedToken = jwt.verify(authorization.substring(7), secret) as jwt.JwtPayload;
		} catch {
			return response.status(401).json({ error: 'token invalid' });
		}
	} else {
		return response.status(401).json({ error: 'token missing' });
	}
	
	next();
}

export const userExtractor: (request: Request, response: Response, next: NextFunction) => void = (request: Request, response: Response, next: NextFunction) => {
	const userId: string = request.decodedToken.id;

	const user: User | undefined = users.find(user => user.id === userId);
	if (!user) return response.status(404).json({ message: 'User not found' });

	request.user = user;

	next();
}
