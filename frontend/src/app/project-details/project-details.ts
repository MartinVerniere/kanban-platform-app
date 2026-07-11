import { Component, inject, resource } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MemberForm } from '../member-form/member-form';
import { ProjectService } from '../services/project-service';

@Component({
	selector: 'app-project-details',
	imports: [RouterLink, MemberForm],
	templateUrl: './project-details.html',
	styleUrl: './project-details.css',
})

export class ProjectDetails {
	route = inject(ActivatedRoute);
	projectService = inject(ProjectService);

	addMemberFormEnabled = false;

	projectId = Number(this.route.snapshot.paramMap.get("id")!);

	project = resource({ loader: () => firstValueFrom(this.projectService.getProject(this.projectId)) });

	onEnableAddMember() { this.addMemberFormEnabled = true; }
	onCancelAddMember() { this.addMemberFormEnabled = false; }

	async onMemberAdded() {
		this.project.reload();
		this.addMemberFormEnabled = false;
	}

	async onRemoveMember(event: Event, userId: number) {
		event.preventDefault();

		await firstValueFrom(this.projectService.removeMember(this.projectId, userId));
		this.project.reload();
	}
}
