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

projectRouter.get('/:id/members', tokenExtractor, userExtractor, projectExtractor, requireProjectMember, async (request: Request, response: Response) => {
	const project = request.project!;
	const members = await prisma.projectMember.findMany({
		where: {
			projectId: project.id
		},
		include: {
			user: {
				select: {
					id: true,
					username: true,
					email: true
				}
			}
		}
	});

	return response.status(200).json(members);
});

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

projectRouter.post('/:id/members', tokenExtractor, userExtractor, projectExtractor, requireProjectMember, requireProjectAdminRole, async (request: Request, response: Response) => {
	const memberUserId = Number(request.body.userId);
	const project = request.project!;

	if (Number.isNaN(memberUserId)) return response.status(400).json({ message: 'Invalid user id' });

	const user = await prisma.user.findUnique({ where: { id: memberUserId } });
	if (!user) return response.status(404).json({ message: 'No user found with the provided id' });

	const existingMembership = project.members.find(member => member.userId === memberUserId);
	if (existingMembership) return response.status(409).json({ message: 'User is already a member of this project' });

	const newMember = await prisma.projectMember.create({
		data: {
			projectId: project.id,
			userId: memberUserId,
			role: ProjectRole.MEMBER
		}
	});

	return response.status(201).json(newMember);
});

projectRouter.delete('/:id/members/:userId', tokenExtractor, userExtractor, projectExtractor, requireProjectMember, requireProjectAdminRole, async (request: Request, response: Response) => {
	const memberUserId = Number(request.params.userId);
	if (Number.isNaN(memberUserId)) return response.status(400).json({ message: 'Invalid member id' });

	const project = request.project!;

	const member = project.members.find(member => member.userId === memberUserId);
	if (!member) return response.status(404).json({ message: 'User is not a member of this project' });

	if (member.userId === request.user.id) return response.status(400).json({ message: 'You cannot remove yourself from the project' });

	await prisma.projectMember.delete({ where: { id: member.id } });

	return response.status(200).json({ message: 'Member removed from project successfully' });
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