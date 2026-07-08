import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';

import { prisma } from '../prisma.js';
import { app } from '../app.js';
import { ProjectRole } from '../generated/prisma/client.js';

describe('Project API', () => {
	beforeEach(async () => {
		//Clear database
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
		await prisma.user.deleteMany();
	});

	describe('when users exists in database', () => {
		beforeEach(async () => {
			await request(app)
				.post('/api/auth/register')
				.send({
					username: 'john',
					email: 'john@test.com',
					password: 'password123',
				});

			await request(app)
				.post('/api/auth/register')
				.send({
					username: 'alice',
					email: 'alice@test.com',
					password: 'password123',
				});
		});

		describe('and a user is logged in', () => {
			let authToken: string;

			beforeEach(async () => {
				const response = await request(app)
					.post('/api/auth/login')
					.send({
						username: 'john',
						password: 'password123',
					});

				authToken = response.body.token;
			});

			describe('on create project', () => {
				it('creates a project', async () => {
					const response = await request(app)
						.post(`/api/projects`)
						.set('Authorization', `Bearer ${authToken}`)
						.send({
							name: 'Test 1',
							key: 'TEST1',
							description: 'test desc'
						});

					expect(response.status).toBe(201);
					expect(response.body.key).toBe('TEST1');

					const projects = await prisma.project.findMany();

					expect(projects).toHaveLength(1);
					expect(projects[0]!.key).toBe("TEST1");
				});

				it('creates the creator as an ADMIN member', async () => {
					const response = await request(app)
						.post(`/api/projects`)
						.set('Authorization', `Bearer ${authToken}`)
						.send({
							name: 'Test 1',
							key: 'TEST1',
							description: 'test desc'
						});

					const createdProjectId = response.body.id;

					const member = await prisma.projectMember.findFirst({
						where: {
							projectId: createdProjectId
						}
					});

					expect(member).not.toBeNull();
					expect(member?.role).toBe(ProjectRole.ADMIN);
				});

				it('returns 400 when key used already exists in database', async () => {
					const response = await request(app)
						.post(`/api/projects`)
						.send({
							name: 'Test 1',
							key: 'TEST1',
							description: 'test desc'
						});

					expect(response.status).toBe(400);
					expect(response.body.error).toBe('An existing project already uses that key');
				});

				it('returns 401 when unauthenticated', async () => {
					const response = await request(app)
						.post(`/api/projects`)
						.send({
							name: 'Test 1',
							key: 'TEST1',
							description: 'test desc'
						});

					expect(response.status).toBe(401);
					expect(response.body.error).toBe('token invalid');
				});
			});

			describe('and the user has already created projects', () => {
				let firstProjectId: number;
				let secondProjectId: number;

				beforeEach(async () => {
					const responseA = await request(app)
						.post('/api/projects')
						.set('Authorization', `Bearer ${authToken}`)
						.send({
							name: 'Test 1',
							key: 'TEST1',
							description: 'test desc'
						});

					firstProjectId = responseA.body.id;

					const responseB = await request(app)
						.post('/api/projects')
						.set('Authorization', `Bearer ${authToken}`)
						.send({
							name: 'Test2',
							key: 'TEST2',
							description: 'test desc'
						});

					secondProjectId = responseB.body.id;
				});

				describe('on get projects', () => {
					it('returns the authenticated user projects', async () => {
						const response = await request(app)
							.get('/api/projects')
							.set('Authorization', `Bearer ${authToken}`)

						expect(response.status).toBe(200);
						expect(response.body).toHaveLength(2);
					});

					it('returns 401 when no token is provided', async () => {
						const response = await request(app)
							.get('/api/projects');

						expect(response.status).toBe(401);
						expect(response.body.message).toBe('token missing');
					});
				});

				describe('on get project by id', () => {
					it('returns the requested project', async () => {
						const response = await request(app)
							.get(`/api/projects/${secondProjectId}`)
							.set('Authorization', `Bearer ${authToken}`);

						expect(response.status).toBe(200);
						expect(response.body.key).toBe('TEST2');
					});

					it('returns 400 for an invalid id', async () => {
						const response = await request(app)
							.get(`/api/projects/abc`)
							.set('Authorization', `Bearer ${authToken}`);

						expect(response.status).toBe(400);
						expect(response.body.message).toBe('Invalid project id');
					});

					it('returns 404 when the project does not exist', async () => {
						const response = await request(app)
							.get(`/api/projects/9999`)
							.set('Authorization', `Bearer ${authToken}`);

						expect(response.status).toBe(404);
						expect(response.body.message).toBe('Error: No project found with that id');
					});

					it('returns 403 when the user is not a member', async () => {
						let response = await request(app)
							.post('/api/auth/login')
							.send({
								username: 'alice',
								password: 'password123',
							});

						authToken = response.body.token;

						response = await request(app)
							.get(`/api/projects/${firstProjectId}`)
							.set('Authorization', `Bearer ${authToken}`);

						expect(response.status).toBe(403);
						expect(response.body.message).toBe('Forbidden: User does not have access to this project');
					});
				});

				describe('on update project', () => {
					it('updates the project', async () => {
						const response = await request(app)
							.put(`/api/projects/${firstProjectId}`)
							.set('Authorization', `Bearer ${authToken}`)
							.send({
								name: 'Test 1',
								description: 'UPDATED desc'
							});

						expect(response.status).toBe(200);
						expect(response.body.description).toBe('UPDATED desc');

						const updated = await prisma.project.findUnique({
							where: {
								id: firstProjectId
							}
						});

						expect(updated?.description).toBe("UPDATED desc");
					});

					it('returns 400 for invalid id', async () => {
						const response = await request(app)
							.put(`/api/projects/abc`)
							.set('Authorization', `Bearer ${authToken}`)
							.send({
								name: 'Test 1',
								description: 'UPDATED desc'
							});

						expect(response.status).toBe(400);
						expect(response.body.message).toBe('Invalid project id');
					});

					it('returns 404 when project does not exist', async () => {
						const response = await request(app)
							.put(`/api/projects/9999`)
							.set('Authorization', `Bearer ${authToken}`)
							.send({
								name: 'Test 1',
								description: 'UPDATED desc'
							});

						expect(response.status).toBe(404);
						expect(response.body.message).toBe('Error: No project found with that id');
					});

					it('returns 403 when user is not the admin of the project', async () => {
						let response = await request(app)
							.post('/api/auth/login')
							.send({
								username: 'alice',
								password: 'password123',
							});

						authToken = response.body.token;

						response = await request(app)
							.put(`/api/projects/${firstProjectId}`)
							.set('Authorization', `Bearer ${authToken}`)
							.send({
								name: 'Test 1',
								description: 'UPDATED desc'
							});

						expect(response.status).toBe(403);
						expect(response.body.message).toBe('Forbidden: User does not own this project');
					});

					it('returns 401 when unauthenticated', async () => {
						const response = await request(app)
							.put(`/api/projects/${firstProjectId}`)
							.set('Authorization', `Bearer UNAUTHENTICATED`)
							.send({
								name: 'Test 1',
								description: 'UPDATED desc'
							});

						expect(response.status).toBe(401);
						expect(response.body.error).toBe('token invalid');
					});
				});

				describe('on delete project', () => {
					it('deletes the project', async () => {
						const response = await request(app)
							.delete(`/api/projects/${firstProjectId}`)
							.set('Authorization', `Bearer ${authToken}`);

						expect(response.status).toBe(200);
						expect(response.body.message).toBe('Project deleted');

						const project = await prisma.project.findUnique({
							where: {
								id: firstProjectId
							}
						});

						expect(project).toBeNull();
					});

					it('returns 400 for invalid id', async () => {
						const response = await request(app)
							.delete(`/api/projects/abc`)
							.set('Authorization', `Bearer ${authToken}`);

						expect(response.status).toBe(400);
						expect(response.body.message).toBe('Invalid project id');
					});

					it('returns 404 when project does not exist', async () => {
						const response = await request(app)
							.delete(`/api/projects/9999`)
							.set('Authorization', `Bearer ${authToken}`);

						expect(response.status).toBe(404);
						expect(response.body.message).toBe('Error: No project found with that id');
					});

					it('returns 403 when user is not an admin', async () => {
						let response = await request(app)
							.post('/api/auth/login')
							.send({
								username: 'alice',
								password: 'password123',
							});

						authToken = response.body.token;

						response = await request(app)
							.delete(`/api/projects/${firstProjectId}`)
							.set('Authorization', `Bearer ${authToken}`);

						expect(response.status).toBe(403);
						expect(response.body.message).toBe('Forbidden: User does not own this project');
					});

					it('returns 401 when unauthenticated', async () => {
						const response = await request(app)
							.delete(`/api/projects/${firstProjectId}`)
							.set('Authorization', `Bearer ${authToken}`);

						expect(response.status).toBe(401);
						expect(response.body.error).toBe('token invalid');
					});
				});
			})

			describe('and the user has not created projects', () => {
				describe('on get projects', () => {
					it('returns an empty array when the user has no projects', async () => {
						const response = await request(app)
							.get('/api/projects')
							.set('Authorization', `Bearer ${authToken}`)

						expect(response.status).toBe(200);
						expect(response.body).toHaveLength(0);
					});
				});
			});

			describe('and another user has created projects', () => {
				beforeEach(async () => {
					let response = await request(app)
						.post('/api/auth/login')
						.send({
							username: 'alice',
							password: 'password123',
						});

					authToken = response.body.token;

					await request(app)
						.post('/api/projects')
						.set('Authorization', `Bearer ${authToken}`)
						.send({
							name: 'Test 1',
							key: 'TEST1',
							description: 'test desc'
						});

					response = await request(app)
						.post('/api/auth/login')
						.send({
							username: 'john',
							password: 'password123',
						});

					authToken = response.body.token;

					await request(app)
						.post('/api/projects')
						.set('Authorization', `Bearer ${authToken}`)
						.send({
							name: 'Test2',
							key: 'TEST2',
							description: 'test desc'
						});
				});

				describe('on get projects', () => {
					it('returns only his projects', async () => {
						const response = await request(app)
							.get('/api/projects')
							.set('Authorization', `Bearer ${authToken}`)

						expect(response.status).toBe(200);
						expect(response.body).toHaveLength(1);
					});
				});
			});
		});
	});
});