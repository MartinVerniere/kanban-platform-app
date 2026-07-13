import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectElement } from './project-element';
import { provideRouter } from '@angular/router';
import { ProjectService } from '../services/project-service';

describe('ProjectElement', () => {
	let fixture: ComponentFixture<ProjectElement>;
	let component: ProjectElement;
	let html: HTMLElement;

	const projectServiceMock = {
		getProjects: vi.fn(),
		deleteProject: vi.fn()
	};

	const project = {
		id: 1,
		name: 'Project A',
		key: 'PRA',
		description: 'My project'
	};

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(ProjectElement);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		fixture.componentRef.setInput('project', project);

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [ProjectElement],
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
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should render project information', async () => {
		await createComponent();

		expect(html.textContent).toContain('Project A');
		expect(html.textContent).toContain('PRA');
		expect(html.textContent).toContain('My project');
	});
});
