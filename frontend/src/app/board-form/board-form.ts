import { Component, inject, output, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project-service';
import { HttpErrorResponse } from '@angular/common/http';

export interface BoardModel {
	name: string;
}

@Component({
	selector: 'app-board-form',
	imports: [FormField],
	templateUrl: './board-form.html',
	styleUrl: './board-form.css',
})
export class BoardForm {
	router = inject(Router);
	projectService = inject(ProjectService);
	route = inject(ActivatedRoute);

	projectId = Number(this.route.snapshot.paramMap.get('id'));
	boardAdded = output<void>();
	canceledBboardAdded = output<void>();

	boardModel = signal<BoardModel>({
		name: ''
	});
	error = signal<string | null>(null);

	boardForm = form(this.boardModel, (fieldPath) => {
		required(fieldPath.name, { message: 'name is required' });
	});

	async onSubmit(event: Event) {
		event.preventDefault();

		submit(this.boardForm, async () => {
			if (this.boardModel().name === '') return;

			this.projectService.createBoard(this.projectId, this.boardModel()).subscribe({
				next: () => {
					this.resetForm();
					this.error.set(null);
					this.router.navigate(['/projects', this.projectId]);
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
		this.router.navigate(['/projects']);
	}

	resetForm() {
		this.boardModel.set({ name: '' });
		this.boardForm().reset();
	}
}
