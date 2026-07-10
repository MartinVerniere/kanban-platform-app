import { Component, inject, resource } from '@angular/core';
import { ProjectsService } from '../services/projects-service';
import { ProjectElement } from '../project-element/project-element';
import { firstValueFrom } from 'rxjs';

@Component({
	selector: 'app-project-list',
	imports: [ProjectElement],
	templateUrl: './project-list.html',
	styleUrl: './project-list.css',
})

export class ProjectList {
	projectService = inject(ProjectsService);

	projectList = resource({ loader: () => firstValueFrom(this.projectService.getProjects()) });
}
