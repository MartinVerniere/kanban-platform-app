import { Component, inject, input, resource } from '@angular/core';
import { ProjectService } from '../services/project-service';
import { firstValueFrom } from 'rxjs';

@Component({
	selector: 'app-board-list',
	imports: [],
	templateUrl: './board-list.html',
	styleUrl: './board-list.css',
})
export class BoardList {
	projectService = inject(ProjectService);

	projectId = input.required<number>();

	boardList = resource({ loader: () => firstValueFrom(this.projectService.getBoards(this.projectId())) });

	async onDeleteBoard(event: Event, boardId: number): Promise<void> {
		event.preventDefault();

		//await firstValueFrom(this.projectService.deleteBoard(boardId));
		this.boardList.reload();
	}
}
