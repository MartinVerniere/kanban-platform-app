import { Component, inject, resource } from '@angular/core';
import { ProjectElement } from '../project-element/project-element';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../services/project-service';

@Component({
	selector: 'app-project-list',
	imports: [ProjectElement, RouterLink],
	templateUrl: './project-list.html',
	styleUrl: './project-list.css',
})

export class ProjectList {
	projectService = inject(ProjectService);

	projectList = resource({ loader: () => firstValueFrom(this.projectService.getProjects()) });

	async onDeleteProject(event: Event, projectId: number): Promise<void> {
		event.preventDefault();

		await firstValueFrom(this.projectService.deleteProject(projectId));
		this.projectList.reload();
	}
}
