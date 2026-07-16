import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Project, ProjectService } from '../services/project-service';
import { MemberForm } from '../member-form/member-form';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-member-list',
	imports: [MemberForm],
	templateUrl: './member-list.html',
	styleUrl: './member-list.css',
})
export class MemberList {
	project = input.required<Project>();
	projectService = inject(ProjectService);

	members = computed(() => this.project().members);

	memberAdded = output<void>();
	memberRemoved = output<number>();

	addMemberFormEnabled = signal<boolean>(false);
	error = signal<string | null>(null);

	onEnableAddMember() { this.addMemberFormEnabled.set(true); }
	onCancelAddMember() { this.addMemberFormEnabled.set(false); }

	onMemberAdded() {
		this.addMemberFormEnabled.set(false);
		this.memberAdded.emit();
	}

	async onRemoveMember(userId: number) {
		this.projectService.removeMember(this.project().id, userId).subscribe({
			next: () => {
				this.memberRemoved.emit(userId);
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
