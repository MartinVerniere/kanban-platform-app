import { Component, inject, resource } from '@angular/core';
import { ProjectsService } from '../services/projects-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
	selector: 'app-project-details',
	imports: [RouterLink],
	templateUrl: './project-details.html',
	styleUrl: './project-details.css',
})

export class ProjectDetails {
	route = inject(ActivatedRoute);
	projectService = inject(ProjectsService);

	projectId = Number(this.route.snapshot.paramMap.get("id")!);

	project = resource({ loader: () => firstValueFrom(this.projectService.getProject(this.projectId)) });
}
