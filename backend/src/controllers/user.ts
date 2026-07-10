import { Router, type Request, type Response } from 'express';
import { tokenExtractor, userExtractor } from '../utils/middleware.js';
import { prisma } from '../prisma.js';

const userRouter = Router();

userRouter.get('/', tokenExtractor, userExtractor, async (request: Request, response: Response) => {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			username: true,
			email: true
		}
	});

	return response.status(200).json(users);
});

userRouter.get('/:id', tokenExtractor, userExtractor, async (request: Request, response: Response) => {
	const userId = Number(request.params.id);

	if (!Number.isInteger(userId)) return response.status(400).json({ message: 'Invalid user id' });

	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) return response.status(404).json({ message: 'Couldnt find user with that id' });

	return response.status(200).json(user);
})

export default userRouter;