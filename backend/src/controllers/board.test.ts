import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';

import { prisma } from '../prisma.js';
import { SECRET } from '../utils/config.js';
import { app } from '../app.js';
import { clearDatabase } from '../helpers/database.js';

describe('Board API', () => {
	beforeEach(async () => {
		await clearDatabase();
	});

	describe('when at least one user exists in database', () => {
		let johnUserId: number;
		let aliceUserId: number;
		let authToken: string;

		beforeEach(async () => {
			let response = await request(app)
				.post('/api/auth/register')
				.send({
					username: 'john',
					email: 'john@test.com',
					password: 'password123',
				});

			johnUserId = response.body.id;

			response = await request(app)
				.post('/api/auth/register')
				.send({
					username: 'alice',
					email: 'alice@test.com',
					password: 'password123',
				});

			aliceUserId = response.body.id;
		});

		describe('and a user is logged in', () => {
			beforeEach(async () => {
				const response = await request(app)
					.post('/api/auth/login')
					.send({
						username: 'john',
						password: 'password123',
					});

				authToken = response.body.token;
			});

			describe('and at least one project exist in database', () => {
				let projectId: number;

				beforeEach(async () => {
					const responseA = await request(app)
						.post('/api/projects')
						.set('Authorization', `Bearer ${authToken}`)
						.send({
							name: 'Test 1',
							key: 'TEST1',
							description: 'test desc'
						});

					projectId = responseA.body.id;
				});

				describe('and project has at least one board', () => {
					let boardId: number;

					beforeEach(async () => {
						const response = await request(app)
							.post(`/api/projects/${projectId}/boards`)
							.set('Authorization', `Bearer ${authToken}`)
							.send({ name: 'Board A' });

						boardId = response.body.id;
					});

					describe('on get board by id', async () => {
						it('returns board', async () => {
							const response = await request(app)
								.get(`/api/boards/${boardId}`)
								.set('Authorization', `Bearer ${authToken}`);

							expect(response.status).toBe(200);
							expect(response.body.name).toBe('Board A');
						});

						it('returns 400 if invalid board id', async () => {
							const response = await request(app)
								.get(`/api/boards/abc`)
								.set('Authorization', `Bearer ${authToken}`);

							expect(response.status).toBe(400);
							expect(response.body.error.message).toBe("Invalid board id.");
						});

						it('returns 404 if board not found', async () => {
							const response = await request(app)
								.get(`/api/boards/9999`)
								.set('Authorization', `Bearer ${authToken}`);

							expect(response.status).toBe(404);
							expect(response.body.error.message).toBe("Board not found.");
						});

						it('returns 401 if token is invalid', async () => {
							const response = await request(app)
								.get(`/api/boards/${boardId}`)
								.set('Authorization', `Bearer INVALID_TOKEN`);

							expect(response.status).toBe(401);
							expect(response.body.error.message).toBe("Authentication token is invalid.");
						});

						it('returns 401 if token is missing', async () => {
							const response = await request(app)
								.get(`/api/boards/${boardId}`);

							expect(response.status).toBe(401);
							expect(response.body.error.message).toBe("Authentication token is missing.");
						});
					});

					describe('on update board', async () => {
						it('updates board', async () => {
							const response = await request(app)
								.put(`/api/boards/${boardId}`)
								.set('Authorization', `Bearer ${authToken}`)
								.send({ name: "Updated Board A" });

							expect(response.status).toBe(200);
							expect(response.body.name).toBe('Updated Board A');
						});

						it('returns 400 if invalid board id', async () => {
							const response = await request(app)
								.put(`/api/boards/abc`)
								.set('Authorization', `Bearer ${authToken}`)
								.send({ name: "Updated Board A" });

							expect(response.status).toBe(400);
							expect(response.body.error.message).toBe("Invalid board id.");
						});

						it('returns 404 if board not found', async () => {
							const response = await request(app)
								.put(`/api/boards/9999`)
								.set('Authorization', `Bearer ${authToken}`)
								.send({ name: "Updated Board A" });

							expect(response.status).toBe(404);
							expect(response.body.error.message).toBe("Board not found.");
						});

						it('returns 400 when missing field name in request', async () => {
							const response = await request(app)
								.put(`/api/boards/${boardId}`)
								.set('Authorization', `Bearer ${authToken}`)
								.send({});
								
							expect(response.status).toBe(400);
							expect(response.body.error.message).toBe("Board name is required.");
						});

						it('returns 400 when field name is invalid', async () => {
							const response = await request(app)
								.put(`/api/boards/${boardId}`)
								.set('Authorization', `Bearer ${authToken}`)
								.send({ name: 5 });

							expect(response.status).toBe(400);
							expect(response.body.error.message).toBe("Board name must be a string.");
						});

						it('returns 400 when name is empty string', async () => {
							const response = await request(app)
								.put(`/api/boards/${boardId}`)
								.set('Authorization', `Bearer ${authToken}`)
								.send({ name: "" });

							expect(response.status).toBe(400);
							expect(response.body.error.message).toBe("Board name is required.");
						});

						it('returns 401 if token is invalid', async () => {
							const response = await request(app)
								.put(`/api/boards/${boardId}`)
								.set('Authorization', `Bearer INVALID_TOKEN`)
								.send({ name: "Updated Board A" });

							expect(response.status).toBe(401);
							expect(response.body.error.message).toBe("Authentication token is invalid.");
						});

						it('returns 401 if token is missing', async () => {
							const response = await request(app)
								.put(`/api/boards/${boardId}`)

							expect(response.status).toBe(401);
							expect(response.body.error.message).toBe("Authentication token is missing.");
						});
					});

					describe('on delete board', async () => {
						it('deletes board', async () => {
							const response = await request(app)
								.delete(`/api/boards/${boardId}`)
								.set('Authorization', `Bearer ${authToken}`);

							expect(response.status).toBe(204);
						});

						it('returns 400 if invalid board id', async () => {
							const response = await request(app)
								.delete(`/api/boards/abc`)
								.set('Authorization', `Bearer ${authToken}`);

							expect(response.status).toBe(400);
							expect(response.body.error.message).toBe("Invalid board id.");
						});

						it('returns 404 if board not found', async () => {
							const response = await request(app)
								.delete(`/api/boards/9999`)
								.set('Authorization', `Bearer ${authToken}`);

							expect(response.status).toBe(404);
							expect(response.body.error.message).toBe("Board not found.");
						});

						it('returns 401 if token is invalid', async () => {
							const response = await request(app)
								.delete(`/api/boards/${boardId}`)
								.set('Authorization', `Bearer INVALID_TOKEN`);

							expect(response.status).toBe(401);
							expect(response.body.error.message).toBe("Authentication token is invalid.");
						});

						it('returns 401 if token is missing', async () => {
							const response = await request(app)
								.delete(`/api/boards/${boardId}`);

							expect(response.status).toBe(401);
							expect(response.body.error.message).toBe("Authentication token is missing.");
						});
					});

					describe('and non-MEMBER is logged in', () => {
						beforeEach(async () => {
							const response = await request(app)
								.post('/api/auth/login')
								.send({
									username: 'alice',
									password: 'password123',
								});

							authToken = response.body.token;
						});

						describe('on get project by id', () => {
							it('returns 403 if user is not a member of the project that contains the board', async () => {
								const response = await request(app)
									.get(`/api/boards/${boardId}`)
									.set('Authorization', `Bearer ${authToken}`);

								expect(response.status).toBe(403);
								expect(response.body.error.message).toBe("You do not have access to this project.");
							});
						});

						describe('on update board', () => {
							it('returns 403 if user is not a member of the project that contains the board', async () => {
								const response = await request(app)
									.put(`/api/boards/${boardId}`)
									.set('Authorization', `Bearer ${authToken}`)
									.send({ name: "Updated Board A" });

								expect(response.status).toBe(403);
								expect(response.body.error.message).toBe("You do not have access to this project.");
							});
						});

						describe('on delete board', () => {
							it('returns 403 if user is not a member of the project that contains the board', async () => {
								const response = await request(app)
									.delete(`/api/boards/${boardId}`)
									.set('Authorization', `Bearer ${authToken}`);

								expect(response.status).toBe(403);
								expect(response.body.error.message).toBe("You do not have access to this project.");
							});
						});
					});

					describe('and project has at least one non-ADMIN member', () => {
						beforeEach(async () => {
							await request(app)
								.post(`/api/projects/${projectId}/members`)
								.set('Authorization', `Bearer ${authToken}`)
								.send({ userId: aliceUserId })
						});

						describe('and non-ADMIN member is logged in', () => {
							beforeEach(async () => {
								const response = await request(app)
									.post('/api/auth/login')
									.send({
										username: 'alice',
										password: 'password123',
									});

								authToken = response.body.token;
							});

							describe('on delete board', () => {
								it('returns 403 if user is not an admin of the project that contains the board', async () => {
									const response = await request(app)
										.delete(`/api/boards/${boardId}`)
										.set('Authorization', `Bearer ${authToken}`);

									expect(response.status).toBe(403);
									expect(response.body.error.message).toBe("You must be a project admin to perform this action.");
								});
							});
						});
					});
				});
			});
		});
	});
});