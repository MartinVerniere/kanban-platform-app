import { prisma } from '../../src/prisma.js';

export const clearDatabase = async () => {
	await prisma.projectMember.deleteMany();
	await prisma.project.deleteMany();
	await prisma.user.deleteMany();
};