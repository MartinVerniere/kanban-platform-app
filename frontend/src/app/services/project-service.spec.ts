import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProjectService } from './project-service';

const projectA = {
	id: 1,
	name: 'Project A',
	key: 'PRA',
	description: 'Project A',
	members: [
		{
			id: 1,
			role: 'ADMIN',

			user: {
				id: 1,
				username: 'john',
				email: 'john@email.com',
			},
		},
		{
			id: 2,
			role: 'MEMBER',

			user: {
				id: 2,
				username: 'alice',
				email: 'alice@email.com',
			},
		}
	],
}

const projectB = {
	id: 2,
	name: 'Project B',
	key: 'PRB',
	description: 'Project B',
	members: [
		{
			id: 3,
			role: 'ADMIN',

			user: {
				id: 2,
				username: 'alice',
				email: 'alice@email.com',
			},
		}
	],
}

describe('ProjectService', () => {
	let service: ProjectService;
	let httpMock: HttpTestingController;

	const routerMock = { navigate: vi.fn() };

	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
				{ provide: Router, useValue: routerMock },
			]
		});

		httpMock = TestBed.inject(HttpTestingController);
		service = TestBed.inject(ProjectService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should get projects', () => {
		const expectedResponse = [projectA, projectB];

		service.getProjects().subscribe();

		const request: TestRequest = httpMock.expectOne('http://localhost:3000/api/projects');

		expect(request.request.method).toBe('GET');

		request.flush(expectedResponse);
	});

	it('should get project by id', () => {
		const expectedResponse = projectA;

		service.getProject(1).subscribe();

		const request: TestRequest = httpMock.expectOne('http://localhost:3000/api/projects/' + 1);

		expect(request.request.method).toBe('GET');

		request.flush(expectedResponse);
	});

	it('should create project', () => {

	});

	it('should delete project', () => { });

	it('should add member to project', () => { });

	it('should remove member from project', () => { });
});
