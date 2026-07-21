import { Component, inject, resource } from "@angular/core";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { BoardList } from "../../boards/board-list/board-list";
import { MemberList } from "../../members/member-list/member-list";
import { ProjectService } from "../../services/projects/project-service";

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

	async onMemberRemoved() {
		this.project.reload();
	}
}
