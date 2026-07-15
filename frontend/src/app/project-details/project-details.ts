import { Component, inject, resource } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProjectService } from '../services/project-service';
import { MemberList } from '../member-list/member-list';
import { BoardList } from '../board-list/board-list';

@Component({
	selector: 'app-project-details',
	imports: [RouterLink, MemberList, BoardList],
	templateUrl: './project-details.html',
	styleUrl: './project-details.css',
})

export class ProjectDetails {
	route = inject(ActivatedRoute);
	projectService = inject(ProjectService);

	projectId = Number(this.route.snapshot.paramMap.get("id")!);

	project = resource({ loader: () => firstValueFrom(this.projectService.getProject(this.projectId)) });

	async onMemberAdded() {
		this.project.reload();
	}

	async onRemoveMember(userId: number) {
		await firstValueFrom(this.projectService.removeMember(this.projectId, userId));
		this.project.reload();
	}
}
