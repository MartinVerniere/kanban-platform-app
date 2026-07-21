import { Component, inject, input, resource } from "@angular/core";
import { RouterLink } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { BoardService } from "../../services/boards/board-service";
import { ProjectService } from "../../services/projects/project-service";
import { BoardElement } from "../board-element/board-element";

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

	async onDeleteBoard(boardId: number): Promise<void> {
		await firstValueFrom(this.boardService.deleteBoard(boardId));
		this.boardList.reload();
	}
}
