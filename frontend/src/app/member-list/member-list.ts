import { Component, computed, input, output, signal } from '@angular/core';
import { Project } from '../services/project-service';
import { MemberForm } from '../member-form/member-form';

@Component({
	selector: 'app-member-list',
	imports: [MemberForm],
	templateUrl: './member-list.html',
	styleUrl: './member-list.css',
})
export class MemberList {
	project = input.required<Project>();

	members = computed(() => this.project().members);

	memberAdded = output<void>();
	memberRemoved = output<number>();

	addMemberFormEnabled = signal<boolean>(false);

	onEnableAddMember() { this.addMemberFormEnabled.set(true); }
	onCancelAddMember() { this.addMemberFormEnabled.set(false); }

	onMemberAdded() {
		this.addMemberFormEnabled.set(false);
		this.memberAdded.emit();
	}

	onRemoveMember(userId: number) {
		this.memberRemoved.emit(userId);
	}
}
