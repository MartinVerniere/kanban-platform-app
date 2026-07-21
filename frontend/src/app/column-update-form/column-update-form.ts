import { Component, effect, inject, resource, signal } from '@angular/core';
import { ColumnService } from '../services/column-service';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ColumnModel } from '../column-form/column-form';
import { HttpErrorResponse } from '@angular/common/http';
import { form, FormField, required, submit } from '@angular/forms/signals';

@Component({
	selector: 'app-column-update-form',
	imports: [FormField],
	templateUrl: './column-update-form.html',
	styleUrl: './column-update-form.css',
})
export class ColumnUpdateForm {
	router = inject(Router);
	columnService = inject(ColumnService);
	route = inject(ActivatedRoute);

	projectId = Number(this.route.snapshot.paramMap.get('projectId'));
	boardId = Number(this.route.snapshot.paramMap.get('boardId'));
	columnId = Number(this.route.snapshot.paramMap.get('columnId'));

	currentColumn = resource({ loader: () => firstValueFrom(this.columnService.getColumn(this.columnId)) });

	columnModel = signal<ColumnModel>({ name: '' });

	columnForm = form(this.columnModel, (fieldPath) => {
		required(fieldPath.name, { message: 'name is required' });
	});

	error = signal<string | null>(null);

	constructor() {
		effect(() => {
			const column = this.currentColumn.value();

			if (!column) return;

			this.columnModel.set({ name: column.name });
		});
	}

	async onSubmit(event: Event) {
		event.preventDefault();

		submit(this.columnForm, async () => {
			const value = this.columnForm().value();

			this.columnService.updateColumn(this.columnId, value).subscribe({
				next: () => {
					this.resetForm();
					this.error.set(null);
					this.router.navigate(['/projects', this.projectId, 'boards', this.boardId]);
				},
				error: (response: HttpErrorResponse) => {
					const errorObject = response.error.error;
					console.log(errorObject);
					this.error.set(errorObject.message);
				}
			});
		});
	}

	onCancel() {
		this.router.navigate(['/projects', this.projectId, 'boards', this.boardId]);
	}

	resetForm() {
		this.columnModel.set({ name: '' });
		this.columnForm().reset();
	}
}
