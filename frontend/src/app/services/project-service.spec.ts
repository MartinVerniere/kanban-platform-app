import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
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

	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
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

		service.getProjects().subscribe(projects => { expect(projects).toEqual(expectedResponse); });

		const request = httpMock.expectOne(`http://localhost:3000/api/projects`);

		expect(request.request.method).toBe('GET');

		request.flush(expectedResponse);
	});

	it('should get project by id', () => {
		const expectedResponse = projectA;

		service.getProject(1).subscribe(project => { expect(project).toEqual(expectedResponse); });

		const request = httpMock.expectOne(`http://localhost:3000/api/projects/1`);

		expect(request.request.method).toBe('GET');

		request.flush(expectedResponse);
	});

	it('should create project', () => {
		const project = {
			name: 'Project A',
			key: 'PRA',
			description: 'Project A',
		};

		const expectedResponse = project;

		service.createProject(project).subscribe(created => { expect(created).toEqual(expectedResponse); });

		const request = httpMock.expectOne(`http://localhost:3000/api/projects`);

		expect(request.request.method).toBe('POST');
		expect(request.request.body).toEqual(expectedResponse);

		request.flush(expectedResponse);
	});

	it('should delete project', () => {
		service.deleteProject(1).subscribe(response => { expect(response).toEqual({}); });

		const request = httpMock.expectOne(`http://localhost:3000/api/projects/1`);

		expect(request.request.method).toBe('DELETE');

		request.flush({});
	});

	it('should add member to project', () => {
		const user = {
			id: 3,
			username: 'martin',
			email: 'martin@email.com',
		};

		service.addMember(projectA.id, user.id).subscribe();

		const request = httpMock.expectOne(`http://localhost:3000/api/projects/${projectA.id}/members`);

		expect(request.request.body).toEqual({ userId: 3 });
		expect(request.request.method).toBe('POST');

		request.flush({});
	});

	it('should remove member from project', () => {
		const user = {
			id: 1,
			username: 'john',
			email: 'john@email.com',
		};

		service.removeMember(projectA.id, user.id).subscribe();

		const request = httpMock.expectOne(`http://localhost:3000/api/projects/${projectA.id}/members/${user.id}`);

		expect(request.request.method).toBe('DELETE');

		request.flush({});
	});

	afterEach(() => {
		httpMock.verify();
	});
});
