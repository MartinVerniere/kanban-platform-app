import { Component, input } from '@angular/core';
import { Board } from '../services/board-service';

@Component({
  selector: 'app-board-element',
  imports: [],
  templateUrl: './board-element.html',
  styleUrl: './board-element.css',
})
export class BoardElement {
	board = input.required<Board>();
	projectId = input.required<number>();
}
