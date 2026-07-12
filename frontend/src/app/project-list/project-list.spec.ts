import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectList } from './project-list';
import { provideRouter, Router } from '@angular/router';
import { ProjectService } from '../services/project-service';
import { NEVER, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
	template: ''
})
class DummyComponent { }

describe('ProjectList', () => {
	let fixture: ComponentFixture<ProjectList>;
	let component: ProjectList;
	let html: HTMLElement;
	let router: Router;
	let navigateSpy: any;
	let reloadSpy: any;

	let projectServiceMock = {
		getProjects: vi.fn(),
		deleteProject: vi.fn()
	};

	const projects = [
		{
			id: 1,
			name: 'Project One'
		},
		{
			id: 2,
			name: 'Project Two'
		}
	];

	beforeEach(async () => {
		vi.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [ProjectList],
			providers: [
				{ provide: ProjectService, useValue: projectServiceMock },
				provideRouter([
					{
						path: 'projects/create',
						component: DummyComponent
					}
				])
			]
		}).compileComponents();
	});

	it('should create', async () => {
		projectServiceMock.getProjects.mockReturnValue(of(projects));
		projectServiceMock.deleteProject.mockReturnValue(of({}));

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(ProjectList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		navigateSpy = vi.spyOn(router, 'navigate');
		reloadSpy = vi.spyOn(component.projectList, 'reload');

		await fixture.whenStable();

		expect(component).toBeTruthy();
	});

	it('should fetch projects', async () => {
		projectServiceMock.getProjects.mockReturnValue(of(projects));
		projectServiceMock.deleteProject.mockReturnValue(of({}));

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(ProjectList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		navigateSpy = vi.spyOn(router, 'navigate');
		reloadSpy = vi.spyOn(component.projectList, 'reload');

		await fixture.whenStable();

		expect(projectServiceMock.getProjects).toHaveBeenCalledTimes(1);
	});

	it('should render all projects', async () => {
		projectServiceMock.getProjects.mockReturnValue(of(projects));
		projectServiceMock.deleteProject.mockReturnValue(of({}));

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(ProjectList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		navigateSpy = vi.spyOn(router, 'navigate');
		reloadSpy = vi.spyOn(component.projectList, 'reload');

		await fixture.whenStable();

		expect(html.textContent).toContain('Project One');
		expect(html.textContent).toContain('Project Two');
	});

	it('should call deleteProject when clicking delete button', async () => {
		projectServiceMock.getProjects.mockReturnValue(of(projects));
		projectServiceMock.deleteProject.mockReturnValue(of({}));

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(ProjectList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		navigateSpy = vi.spyOn(router, 'navigate');
		reloadSpy = vi.spyOn(component.projectList, 'reload');

		await fixture.whenStable();

		const deleteButtons = fixture.debugElement.queryAll(By.css('button'));

		deleteButtons[0].nativeElement.click();

		await fixture.whenStable();

		expect(projectServiceMock.deleteProject).toHaveBeenCalledWith(1);
		expect(reloadSpy).toHaveBeenCalled();
	});

	it('should redirect to form page on "Create project" button click', async () => {
		projectServiceMock.getProjects.mockReturnValue(of(projects));
		projectServiceMock.deleteProject.mockReturnValue(of({}));

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(ProjectList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		navigateSpy = vi.spyOn(router, 'navigate');
		reloadSpy = vi.spyOn(component.projectList, 'reload');

		await fixture.whenStable();

		const buttons = Array.from(html.querySelectorAll('button'));
		const createButton = buttons.find((button) => button.textContent?.trim() === 'Create new project');

		expect(createButton).toBeTruthy();

		createButton!.click();

		await fixture.whenStable();

		expect(router.url).toBe('/projects/create');
	});

	it('should render empty list message', async () => {
		projectServiceMock.getProjects.mockReturnValue(of([]));
		projectServiceMock.deleteProject.mockReturnValue(of({}));

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(ProjectList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		navigateSpy = vi.spyOn(router, 'navigate');
		reloadSpy = vi.spyOn(component.projectList, 'reload');

		await fixture.whenStable();

		expect(html.textContent).toContain('No projects yet.');
	});

	it('should render loading message', async () => {
		projectServiceMock.getProjects.mockReturnValue(NEVER);
		projectServiceMock.deleteProject.mockReturnValue(of({}));

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(ProjectList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		navigateSpy = vi.spyOn(router, 'navigate');
		reloadSpy = vi.spyOn(component.projectList, 'reload');

		fixture.detectChanges();

		expect(html.textContent).toContain('Loading...');
	});

	it('should render error message', async () => {
		projectServiceMock.getProjects.mockReturnValue(throwError(() => new Error()));
		projectServiceMock.deleteProject.mockReturnValue(of({}));

		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(ProjectList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		navigateSpy = vi.spyOn(router, 'navigate');
		reloadSpy = vi.spyOn(component.projectList, 'reload');

		await fixture.whenStable();

		expect(html.textContent).toContain('Error loading projects');
	});
});
