import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectForm } from './project-form';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/projects/project-service';
import { of } from 'rxjs';

describe('ProjectForm', () => {
	let fixture: ComponentFixture<ProjectForm>;
	let component: ProjectForm;

	let projectServiceMock = { createProject: vi.fn() };
	let routerMock = { navigate: vi.fn().mockResolvedValue(true) };

	const activatedRouteMock = {
		snapshot: {
			paramMap: {
				get: (key: string) => {
					return null;
				}
			}
		}
	}

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(ProjectForm);
		component = fixture.componentInstance;

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [ProjectForm],
			providers: [
				{ provide: ProjectService, useValue: projectServiceMock },
				{ provide: Router, useValue: routerMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock }
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should create project when valid form data, then redirect to /projects and clear form', async () => {
		projectServiceMock.createProject.mockReturnValue(of({}));

		await createComponent();

		component.projectModel.set({
			name: 'Project A',
			key: 'PRO',
			description: ''
		});

		await component.onSubmit(new Event('submit'));

		expect(projectServiceMock.createProject).toHaveBeenCalledWith({ name: 'Project A', key: 'PRO', description: '' });
		expect(routerMock.navigate).toHaveBeenCalledWith(['/projects']);
		expect(component.projectModel()).toEqual({ name: '', key: '', description: '' });
	});

	it('should not create project when invalid form data', async () => {
		await createComponent();

		await component.onSubmit(new Event('submit'));

		await fixture.whenStable();

		expect(projectServiceMock.createProject).not.toHaveBeenCalled();
	});
});
