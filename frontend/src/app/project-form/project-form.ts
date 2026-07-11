import { Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../services/project-service';

export interface ProjectModel {
	name: string;
	key: string;
	description: string;
}

@Component({
	selector: 'app-project-form',
	imports: [FormField, RouterLink],
	templateUrl: './project-form.html',
	styleUrl: './project-form.css',
})

export class ProjectForm {
	router = inject(Router);
	projectService = inject(ProjectService);
	
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
			this.projectService.createProject(this.projectModel()).subscribe({
				next: () => {
					this.resetForm();
					this.error.set(null);
					this.router.navigate(['/projects']);
				},
				error: (error) => {
					this.error.set(error.error.message);
				}
			});

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
