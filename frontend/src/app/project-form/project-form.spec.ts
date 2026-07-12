import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectForm } from './project-form';
import { Router, provideRouter } from '@angular/router';
import { ProjectService } from '../services/project-service';
import { of } from 'rxjs';

describe('ProjectForm', () => {
	let fixture: ComponentFixture<ProjectForm>;
	let component: ProjectForm;
	let html: HTMLElement;

	let projectServiceMock: { createProject: ReturnType<typeof vi.fn> }

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(ProjectForm);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		projectServiceMock = { createProject: vi.fn() };

		await TestBed.configureTestingModule({
			imports: [ProjectForm],
			providers: [
				{ provide: ProjectService, useValue: projectServiceMock },
				provideRouter([])
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

		const router = TestBed.inject(Router);
		const navigateSpy = vi.spyOn(router, 'navigate');

		component.projectModel.set({
			name: 'Project A',
			key: 'PRO',
			description: ''
		});

		await component.onSubmit(new Event('submit'));

		expect(projectServiceMock.createProject).toHaveBeenCalledWith({ name: 'Project A', key: 'PRO', description: '' });
		expect(navigateSpy).toHaveBeenCalledWith(['/projects']);
		expect(component.projectModel()).toEqual({ name: '', key: '', description: '' });
	});

	it('should not create project when invalid form data', async () => {
		await createComponent();

		const form = html.querySelector('form')!;

		form.dispatchEvent(new Event('submit'));

		await fixture.whenStable();

		expect(projectServiceMock.createProject).not.toHaveBeenCalled();
	});
});
