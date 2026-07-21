import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Column, ColumnService } from '../services/column-service';
import { HttpErrorResponse } from '@angular/common/http';

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
	columnDeleted = output<void>();
	error = signal<string | null>(null);

	columnService = inject(ColumnService);

	onRemoveColumn(columnId: number) {
		this.columnService.deleteColumn(columnId).subscribe({
			next: () => {
				this.columnDeleted.emit();
				this.error.set(null);
			},
			error: (response: HttpErrorResponse) => {
				const errorObject = response.error.error;
				console.log(errorObject);
				this.error.set(errorObject.message);
			}
		});
	}
}
