import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Column {
	id: number,
	name: string,
}

@Component({
  selector: 'app-column-list',
  imports: [RouterLink],
  templateUrl: './column-list.html',
  styleUrl: './column-list.css',
})
export class ColumnList {
	columnList = input.required<Column[]>();
	projectId = input.required<number>();
	boardId = input.required<number>();

	onRemoveColumn(columnId: number){
		console.log(columnId, "- removed");
	}
}
