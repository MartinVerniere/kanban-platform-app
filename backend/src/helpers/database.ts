import { prisma } from '../../src/prisma.js';

export const clearDatabase = async () => {
	await prisma.board.deleteMany();
	await prisma.projectMember.deleteMany();
	await prisma.project.deleteMany();
	await prisma.user.deleteMany();
};