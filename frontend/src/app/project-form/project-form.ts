import { Component, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';

export interface ProjectModel {
	name: string;
	key: string;
	description: string | null;
}

@Component({
	selector: 'app-project-form',
	imports: [FormField, RouterLink],
	templateUrl: './project-form.html',
	styleUrl: './project-form.css',
})
export class ProjectForm {
	projectModel = signal<ProjectModel>({
		name: '',
		key: '',
		description: ''
	});
	error = signal<string | null>(null);

	projectForm = form(this.projectModel, (fieldPath) => {
		required(fieldPath.name, { message: 'Name is required' });
		required(fieldPath.key, { message: 'Key is required' });
	});

	async onSubmit(event: Event) {
		event.preventDefault();

		submit(this.projectForm, async () => {
		});
	}

	resetForm() {
		this.projectModel.set({
			name: '',
			key: '',
			description: ''
		});
		this.projectForm().reset();
	}
}
