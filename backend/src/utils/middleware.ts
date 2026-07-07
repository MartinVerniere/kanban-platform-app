import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { SECRET } from './config.js';
import { prisma } from '../prisma.js';
import { ProjectRole, type User } from '../generated/prisma/client.js';

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

export const projectExtractor = async (
	request: Request,
	response: Response,
	next: NextFunction
): Promise<void> => {
	const requestProjectId = Number(request.params.id);
	if (Number.isNaN(requestProjectId)) {
		response.status(400).json({ message: 'Invalid project id' });
		return;
	}

	const project = await prisma.project.findUnique({ where: { id: requestProjectId }, include: { members: true } });

	if (!project) {
		response.status(404).json({ message: 'Error: No project found with that id' });
		return;
	}

	request.project = project;

	next();
};

export const requireProjectMember = async (
	request: Request,
	response: Response,
	next: NextFunction
): Promise<void> => {
	const userId = request.user.id;
	const project = request.project!;

	const membership = project.members.find(member => member.userId === userId);

	if (!membership) {
		response.status(403).json({ message: 'Forbidden: User does not have access to this project' });
		return;
	}

	request.projectMember = membership;

	next();
}

export const requireProjectAdminRole = async (
	request: Request,
	response: Response,
	next: NextFunction
): Promise<void> => {
	const projectMember = request.projectMember!;

	if (projectMember.role !== ProjectRole.ADMIN) {
		response.status(403).json({ message: 'Forbidden: User does not own this project' });
		return;
	}

	next();
};