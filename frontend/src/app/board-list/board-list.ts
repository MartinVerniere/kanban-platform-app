import { Component, inject, input, resource } from '@angular/core';
import { ProjectService } from '../services/project-service';
import { firstValueFrom } from 'rxjs';
import { RouterLink } from '@angular/router';
import { BoardElement } from '../board-element/board-element';
import { BoardService } from '../services/board-service';

@Component({
	selector: 'app-board-list',
	imports: [BoardElement, RouterLink],
	templateUrl: './board-list.html',
	styleUrl: './board-list.css',
})
export class BoardList {
	projectService = inject(ProjectService);
	boardService = inject(BoardService);

	projectId = input.required<number>();

	boardList = resource({ loader: () => firstValueFrom(this.projectService.getBoards(this.projectId())) });

	async onDeleteBoard(event: Event, boardId: number): Promise<void> {
		event.preventDefault();

		await firstValueFrom(this.boardService.deleteBoard(boardId));
		this.boardList.reload();
	}
}
