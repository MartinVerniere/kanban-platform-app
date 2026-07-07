import { Router, type NextFunction, type Request, type Response } from 'express';
import { userExtractor } from '../utils/middleware.js';
import { prisma } from '../prisma.js';
import { ProjectRole } from '../generated/prisma/client.js';

const projectRouter = Router();

const projectExtractor = async (
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

const requireProjectMember = async (
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

const requireProjectAdminRole = async (
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

projectRouter.get('/:id', userExtractor, projectExtractor, requireProjectMember, async (request: Request, response: Response) => {
	const project = request.project;

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

projectRouter.put('/:id', userExtractor, projectExtractor, requireProjectMember, requireProjectAdminRole, async (request: Request, response: Response) => {
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

projectRouter.delete('/:id', userExtractor, projectExtractor, requireProjectMember, requireProjectAdminRole, async (request: Request, response: Response) => {
	const project = request.project!;

	await prisma.project.delete({ where: { id: project.id } })

	return response.status(200).json({ message: 'Project deleted' });
});

export default projectRouter;