import { Component, inject, input, output, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Column } from '../services/column-service';
import { ColumnElement } from '../column-element/column-element';

@Component({
	selector: 'app-column-list',
	imports: [RouterLink, ColumnElement],
	templateUrl: './column-list.html',
	styleUrl: './column-list.css',
})
export class ColumnList {
	router = inject(Router);
	route = inject(ActivatedRoute);
	
	columnList = input.required<Column[]>();

	projectId = Number(this.route.snapshot.paramMap.get('projectId'));
	boardId = Number(this.route.snapshot.paramMap.get('boardId'));

	columnDeleted = output<void>();

	error = signal<string | null>(null);

	onRemoveColumn() {
		this.columnDeleted.emit();
	}
}
