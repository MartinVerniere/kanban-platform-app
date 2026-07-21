import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetails } from './project-details';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project-service';
import { NEVER, of, throwError } from 'rxjs';

describe('ProjectDetails', () => {
	let fixture: ComponentFixture<ProjectDetails>;
	let component: ProjectDetails;
	let html: HTMLElement;

	const projectServiceMock = { getProject: vi.fn() };

	const activatedRouteMock = {
		snapshot: {
			paramMap: {
				get: () => '1'
			}
		}
	}

	const project = {
		id: 1,
		name: 'Project A',
		key: 'PRA',
		description: 'Description',
		members: [
			{
				id: 1,
				role: 'ADMIN',
				user: {
					id: 10,
					username: 'john'
				}
			}
		]
	};

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(ProjectDetails);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		projectServiceMock.getProject.mockReturnValue(of(project));

		await TestBed.configureTestingModule({
			imports: [ProjectDetails],
			providers: [
				{ provide: ProjectService, useValue: projectServiceMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock }
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should load project', async () => {
		await createComponent();

		expect(projectServiceMock.getProject).toHaveBeenCalledWith(1);
	});

	it('should show loading state', async () => {
		projectServiceMock.getProject.mockReturnValue(NEVER);

		await createComponent(false);

		expect(html.textContent).toContain('Loading...');
	});


	it('should show error state', async () => {
		projectServiceMock.getProject.mockReturnValue(throwError(() => new Error()));

		await createComponent();

		expect(html.textContent).toContain('Error loading project');
	});

	it('should reload project after member added', async () => {
		await createComponent();

		const reloadSpy = vi.spyOn(component.project, 'reload');

		await component.onMemberAdded();

		expect(reloadSpy).toHaveBeenCalled();
	});

	it('should reload project after member removed', async () => {
		await createComponent();

		const reloadSpy = vi.spyOn(component.project, 'reload');

		await component.onMemberRemoved();

		expect(reloadSpy).toHaveBeenCalled();
	});
});
