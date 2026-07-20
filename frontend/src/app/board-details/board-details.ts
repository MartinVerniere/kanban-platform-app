import { Component, inject, input, resource } from '@angular/core';
import { Board, BoardService } from '../services/board-service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ColumnList } from '../column-list/column-list';

@Component({
	selector: 'app-board-details',
	imports: [ColumnList],
	templateUrl: './board-details.html',
	styleUrl: './board-details.css',
})
export class BoardDetails {
	route = inject(ActivatedRoute);
	boardService = inject(BoardService);

	projectId = Number(this.route.snapshot.paramMap.get("projectId")!);
	boardId = Number(this.route.snapshot.paramMap.get("boardId")!);

	board = resource({ loader: () => firstValueFrom(this.boardService.getBoard(this.boardId)) });
}
