import { Component, input, output } from '@angular/core';
import { Board } from '../services/board-service';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-board-element',
	imports: [RouterLink],
	templateUrl: './board-element.html',
	styleUrl: './board-element.css',
})
export class BoardElement {
	board = input.required<Board>();
	projectId = input.required<number>();
	boardDeleted = output<number>();

	onBoardDeleted(event: Event, boardId: number) {
		event.preventDefault();
		this.boardDeleted.emit(boardId);
	}
}
