import { Component, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Board } from "../../services/boards/board-service";

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

	onBoardDeleted(boardId: number) {
		this.boardDeleted.emit(boardId);
	}
}
