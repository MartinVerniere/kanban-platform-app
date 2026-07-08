import { Router, type Request, type Response } from 'express';
import { projectExtractor, requireProjectAdminRole, requireProjectMember, tokenExtractor, userExtractor } from '../utils/middleware.js';
import { prisma } from '../prisma.js';
import { ProjectRole, type Project } from '../generated/prisma/client.js';

const projectRouter = Router();

projectRouter.get('/', tokenExtractor, userExtractor, async (request: Request, response: Response) => {
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

projectRouter.get('/:id', tokenExtractor, userExtractor, projectExtractor, requireProjectMember, async (request: Request, response: Response) => {
	const project = request.project;

	return response.status(200).json(project);
})

projectRouter.post('/', tokenExtractor, userExtractor, async (request: Request, response: Response) => {
	const userId = request.user.id;
	const { name, key, description } = request.body;

	const projectKeyExists: Project | null = await prisma.project.findUnique({ where: { key } });
	if (projectKeyExists) return response.status(400).json({ message: 'An existing project already uses that key' });

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

projectRouter.put('/:id', tokenExtractor, userExtractor, projectExtractor, requireProjectMember, requireProjectAdminRole, async (request: Request, response: Response) => {
	const { name, description } = request.body;
	const project = request.project!;

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

projectRouter.delete('/:id', tokenExtractor, userExtractor, projectExtractor, requireProjectMember, requireProjectAdminRole, async (request: Request, response: Response) => {
	const project = request.project!;

	await prisma.project.delete({ where: { id: project.id } })

	return response.status(200).json({ message: 'Project deleted' });
});

export default projectRouter;