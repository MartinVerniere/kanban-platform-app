import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { provideRouter, Router } from '@angular/router';

import { ProjectList } from './project-list';
import { ProjectService } from '../../services/projects/project-service';

describe('ProjectList', () => {
	let fixture: ComponentFixture<ProjectList>;
	let component: ProjectList;
	let html: HTMLElement;

	const projectServiceMock = {
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

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(ProjectList);
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

		await TestBed.configureTestingModule({
			imports: [ProjectList],
			providers: [
				{
					provide: ProjectService,
					useValue: projectServiceMock
				},
				provideRouter([])
			]
		}).compileComponents();
	});

	it('should create', async () => {
		projectServiceMock.getProjects.mockReturnValue(of(projects));

		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should show loading state', async () => {
		projectServiceMock.getProjects.mockReturnValue(NEVER);

		await createComponent(false);

		expect(html.textContent).toContain('Loading...');
	});

	it('should render projects', async () => {
		projectServiceMock.getProjects.mockReturnValue(of(projects));

		await createComponent();

		expect(html.textContent).toContain('Project One');
		expect(html.textContent).toContain('Project Two');
	});

	it('should show empty state', async () => {
		projectServiceMock.getProjects.mockReturnValue(of([]));

		await createComponent();

		expect(html.textContent).toContain('No projects yet.');
	});

	it('should show error state', async () => {
		projectServiceMock.getProjects.mockReturnValue(
			throwError(() => new Error())
		);

		await createComponent();

		expect(html.textContent).toContain('Error loading projects');
	});

	it('should delete project and reload list', async () => {
		projectServiceMock.getProjects.mockReturnValue(of(projects));
		projectServiceMock.deleteProject.mockReturnValue(of({}));

		await createComponent();

		const reloadSpy = vi.spyOn(component.projectList, 'reload');

		const deleteButton = Array.from(html.querySelectorAll('button'))
			.find(button => button.textContent?.includes('Delete project'));

		expect(deleteButton).toBeTruthy();

		deleteButton!.click();

		await fixture.whenStable();

		expect(projectServiceMock.deleteProject).toHaveBeenCalledWith(1);
		expect(reloadSpy).toHaveBeenCalled();
	});
});