import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemberList } from './member-list';
import { Project } from '../services/project-service';

describe('MemberList', () => {
	let fixture: ComponentFixture<MemberList>;
	let component: MemberList;

	const project: Project = {
		id: 1,
		name: 'Project A',
		key: 'PRA',
		description: '',
		members: [
			{
				id: 1,
				role: 'ADMIN',
				user: {
					id: 10,
					username: 'john',
					email: 'john@email.com'
				}
			}
		]
	};

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(MemberList);
		component = fixture.componentInstance;

		fixture.componentRef.setInput('project', project);

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();


		await TestBed.configureTestingModule({
			imports: [MemberList],
			providers: []
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should enable add member form', async () => {
		await createComponent();

		component.onEnableAddMember();

		expect(component.addMemberFormEnabled()).toBe(true);
	});

	it('should disable add member form on cancel', async () => {
		await createComponent();

		component.onEnableAddMember();
		component.onCancelAddMember();

		expect(component.addMemberFormEnabled()).toBe(false);
	});

	it('should emit memberAdded when member is added', async () => {
		await createComponent();

		component.onEnableAddMember();

		const emitSpy = vi.spyOn(component.memberAdded, 'emit');

		component.onMemberAdded();

		expect(component.addMemberFormEnabled()).toBe(false);
		expect(emitSpy).toHaveBeenCalled();
	});

	it('should emit memberRemoved when "remove member" button is clicked', async () => {
		await createComponent();

		const emitSpy = vi.spyOn(component.memberRemoved, 'emit');

		component.onRemoveMember(10);

		expect(emitSpy).toHaveBeenCalledWith(10);
	});
});
