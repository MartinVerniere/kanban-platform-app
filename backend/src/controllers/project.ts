import { Router, type Request, type Response } from 'express';
import { userExtractor } from '../utils/middleware.js';
import { prisma } from '../prisma.js';
import { ProjectRole } from '../generated/prisma/client.js';

const projectRouter = Router();

projectRouter.get('/', userExtractor, async (request: Request, response: Response) => {
	const userId = request.user.id;
	const filteredProjects = await prisma.project.findMany({
		where: {
			members: {
				some: {
					userId: userId
				}
			}
		}
	});

	return response.status(200).json(filteredProjects);
});

projectRouter.get('/:id', userExtractor, async (request: Request, response: Response) => {
	const requestProjectId = Number(request.params.id);
	if (Number.isNaN(requestProjectId)) {
		response.status(400).json({ message: 'Invalid project id' });
		return;
	}

	const userId = request.user.id;

	const project = await prisma.project.findUnique({ where: { id: requestProjectId }, include: { members: true } });

	if (!project) {
		response.status(404).json({ message: 'Error: No project found with that id' });
		return;
	}

	const isMemberOfProject = project.members.some(member => member.userId === userId);

	if (!isMemberOfProject) {
		response.status(403).json({ message: 'Unauthorized: User doesnt have access to this project' });
		return;
	}

	return response.status(200).json(project);
})

projectRouter.post('/', userExtractor, async (request: Request, response: Response) => {
	const userId = request.user.id;
	const { name, key, description } = request.body;

	const newProject = await prisma.$transaction(async (tx) => {
		const project = await tx.project.create({
			data: {
				name,
				key,
				description
			}
		});

		await tx.projectMember.create({
			data: {
				userId: userId,
				projectId: project.id,
				role: ProjectRole.ADMIN
			}
		});

		return project;
	});

	return response.status(201).json(newProject);
});

projectRouter.put('/:id', userExtractor, async (request: Request, response: Response) => {
	const requestProjectId = Number(request.params.id);
	if (Number.isNaN(requestProjectId)) {
		response.status(400).json({ message: 'Invalid project id' });
		return;
	}

	const userId = request.user.id;
	const { name, description } = request.body;

	const project = await prisma.project.findUnique({ where: { id: requestProjectId }, include: { members: true } });

	if (!project) {
		response.status(404).json({ message: 'Error: No project found with that id' });
		return;
	}

	const isAdminOfProject = project.members.some(member => member.userId === userId && member.role === ProjectRole.ADMIN);

	if (!isAdminOfProject) {
		response.status(403).json({ message: 'Unauthorized: User doesnt have permission to edit this project' });
		return;
	}

	const updatedProject = await prisma.project.update({
		where: {
			id: project.id
		},
		data: {
			name,
			description: description.trim() === ''
				? null
				: description
		}
	});

	return response.status(200).json(updatedProject);
});

projectRouter.delete('/:id', userExtractor, async (request: Request, response: Response) => {
	const requestProjectId = Number(request.params.id);
	if (Number.isNaN(requestProjectId)) {
		response.status(400).json({ message: 'Invalid project id' });
		return;
	}

	const userId = request.user.id;

	const project = await prisma.project.findUnique({ where: { id: requestProjectId }, include: { members: true } });

	if (!project) {
		response.status(404).json({ message: 'Error: No project found with that id' });
		return;
	}

	const isAdminOfProject = project.members.some(member => member.userId === userId && member.role === ProjectRole.ADMIN);

	if (!isAdminOfProject) {
		response.status(403).json({ message: 'Unauthorized: User doesnt have permission to delete this project' });
		return;
	}

	await prisma.project.delete({ where: { id: requestProjectId } })

	return response.status(200).json({ message: 'Project deleted' });
});

export default projectRouter;