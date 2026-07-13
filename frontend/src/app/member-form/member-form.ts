import { Component, computed, inject, input, output, resource, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Project, ProjectService } from '../services/project-service';
import { UserService } from '../services/user-service';

export interface MemberModel {
	userId: string;
}

@Component({
	selector: 'app-member-form',
	imports: [FormField],
	templateUrl: './member-form.html',
	styleUrl: './member-form.css',
})

export class MemberForm {
	router = inject(Router);
	projectService = inject(ProjectService);
	userService = inject(UserService);

	project = input.required<Project>();
	memberAdded = output<void>();
	canceledMemberAdd = output<void>();

	users = resource({ loader: () => firstValueFrom(this.userService.getUsers()) });

	possibleUsers = computed(() => {
		const users = this.users.value();
		return users
			? users.filter(user => !(this.project().members.map(member => member.user.id).includes(user.id)))
			: [];
	});

	memberModel = signal<MemberModel>({
		userId: ''
	});
	error = signal<string | null>(null);

	memberForm = form(this.memberModel, (fieldPath) => {
		required(fieldPath.userId, { message: 'User is required' });
	});

	async onSubmit(event: Event) {
		event.preventDefault();

		submit(this.memberForm, async () => {
			if (this.memberModel().userId === '') return;

			const userId = Number(this.memberModel().userId);
			this.projectService.addMember(this.project().id, userId).subscribe({
				next: () => {
					this.resetForm();
					this.error.set(null);
					this.memberAdded.emit();
				},
				error: (error) => {
					this.error.set(error.error.message);
				}
			});

		});
	}

	onCancel() { this.canceledMemberAdd.emit(); }

	resetForm() {
		this.memberModel.set({ userId: '' });
		this.memberForm().reset();
	}
}
