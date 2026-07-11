import { Component, inject, resource } from '@angular/core';
import { Project, ProjectsService } from '../services/projects-service';
import { ProjectElement } from '../project-element/project-element';
import { firstValueFrom, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-project-list',
	imports: [ProjectElement, RouterLink],
	templateUrl: './project-list.html',
	styleUrl: './project-list.css',
})

export class ProjectList {
	projectService = inject(ProjectsService);

	projectList = resource({ loader: () => firstValueFrom(this.projectService.getProjects()) });

	onDeleteProject(event: Event, projectId: number): void {
		event.preventDefault();

		firstValueFrom(this.projectService.deleteProject(projectId));
		this.projectList.reload();
	}
}
