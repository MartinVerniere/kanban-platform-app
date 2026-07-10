import { Component, inject, signal } from '@angular/core';
import { Project, ProjectsService } from '../services/projects-service';
import { ProjectElement } from '../project-element/project-element';

@Component({
	selector: 'app-project-list',
	imports: [ProjectElement],
	templateUrl: './project-list.html',
	styleUrl: './project-list.css',
})

export class ProjectList {
	projectService = inject(ProjectsService);
	projectList = signal<Project[]>([]);

	constructor() {
		this.projectService.getProjects().subscribe(projects => {
			this.projectList.set(projects);
		});
	}
}
