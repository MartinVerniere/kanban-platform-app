import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';

import { prisma } from '../prisma.js';
import { SECRET } from '../utils/config.js';
import { app } from '../app.js';

vi.mock('../prisma.js', () => ({
	prisma: {
		user: {
			findUnique: vi.fn(),
			create: vi.fn(),
		},
	},
}));

describe('Auth API', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('POST /api/auth/register', () => {
		it('returns 400 when username is missing', async () => {
			const response = await request(app)
				.post('/api/auth/register')
				.send({
					email: 'test@test.com',
					password: 'password123',
				});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Username is required');
		});

		it('returns 400 when email is missing', async () => {
			const response = await request(app)
				.post('/api/auth/register')
				.send({
					username: 'john',
					password: 'password123',
				});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Email is required');
		});

		it('returns 400 when password is missing', async () => {
			const response = await request(app)
				.post('/api/auth/register')
				.send({
					username: 'john',
					email: 'test@test.com',
				});

			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Password is required');
		});

		it('returns 400 when password too short', async () => {
			const response = await request(app)
				.post('/api/auth/register')
				.send({
					username: 'john',
					email: 'test@test.com',
					password: '123',
				});

			expect(response.status).toBe(400);
		});

		it('creates user successfully', async () => {
			(prisma.user.findUnique as any)
				.mockResolvedValueOnce(null) // username check
				.mockResolvedValueOnce(null); // email check

			(prisma.user.create as any).mockResolvedValue({
				id: 1,
				username: 'john',
				email: 'john@test.com',
			});

			const response = await request(app)
				.post('/api/auth/register')
				.send({
					username: 'john',
					email: 'john@test.com',
					password: 'password123',
				});

			expect(response.status).toBe(201);
			expect(response.body.username).toBe('john');
		});

		it('blocks duplicate username', async () => {
			(prisma.user.findUnique as any)
				.mockResolvedValueOnce({
					id: 1,
					username: 'john',
					email: 'john@test.com',
				});

			const response = await request(app)
				.post('/api/auth/register')
				.send({
					username: 'john',
					email: 'other@test.com',
					password: 'password123',
				});

			expect(response.status).toBe(400);
		});

		it('blocks duplicate email', async () => {
			(prisma.user.findUnique as any)
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce({
					id: 1,
					username: 'john',
					email: 'test@test.com',
				});

			const response = await request(app)
				.post('/api/auth/register')
				.send({
					username: 'alice',
					email: 'test@test.com',
					password: 'password123',
				});

			expect(response.status).toBe(400);
		});
	});

	describe('POST /api/auth/login', () => {
		it('returns 401 when user not found', async () => {
			(prisma.user.findUnique as any).mockResolvedValue(null);

			const response = await request(app)
				.post('/api/auth/login')
				.send({
					username: 'thomas',
					password: 'password123',
				});

			expect(response.status).toBe(401);
		});

		it('returns 401 when password is wrong', async () => {
			const hash = await bcrypt.hash('correctpassword', 10);

			(prisma.user.findUnique as any).mockResolvedValue({
				id: 1,
				username: 'john',
				email: 'john@test.com',
				passwordHash: hash,
			});

			const response = await request(app)
				.post('/api/auth/login')
				.send({
					username: 'john',
					password: 'wrongpassword',
				});

			expect(response.status).toBe(401);
		});

		it('returns token on success', async () => {
			const hash = await bcrypt.hash('password123', 10);

			(prisma.user.findUnique as any).mockResolvedValue({
				id: 1,
				username: 'john',
				email: 'john@test.com',
				passwordHash: hash,
			});

			const response = await request(app)
				.post('/api/auth/login')
				.send({
					username: 'john',
					password: 'password123',
				});

			expect(response.status).toBe(200);
			expect(response.body.token).toBeDefined();

			const decoded = jwt.verify(response.body.token, SECRET!);
			expect((decoded as any).username).toBe('john');
		});
	});

	describe('GET /api/auth/me', () => {

		it('returns current user', async () => {
			const token = jwt.sign(
				{ id: 1, username: 'john' },
				SECRET!,
				{ expiresIn: '1h' }
			);

			const response = await request(app)
				.get('/api/auth/me')
				.set('Authorization', `Bearer ${token}`);

			expect(response.status).toBe(200);
			expect(response.body.id).toBe(1);
			expect(response.body.username).toBe('john');
		});

		it('fails when no token provided', async () => {
			const response = await request(app)
				.get('/api/auth/me');

			expect(response.status).toBe(401);
			expect(response.body.error).toBe('token missing');
		});
	});
});