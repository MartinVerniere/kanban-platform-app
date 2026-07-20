import { Component, inject, input, resource } from '@angular/core';
import { Board, BoardService } from '../services/board-service';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
	selector: 'app-board-details',
	imports: [],
	templateUrl: './board-details.html',
	styleUrl: './board-details.css',
})
export class BoardDetails {
	route = inject(ActivatedRoute);
	boardService = inject(BoardService);

	boardId = Number(this.route.snapshot.paramMap.get("boardId")!);

	board = resource({ loader: () => firstValueFrom(this.boardService.getBoard(this.boardId)) });
}
