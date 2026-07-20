import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardElement } from './board-element';
import { provideRouter } from '@angular/router';

describe('BoardElement', () => {
	let fixture: ComponentFixture<BoardElement>;
	let component: BoardElement;
	let html: HTMLElement;

	const board = {
		id: 1,
		name: 'Board A',
	};

	const projectId = 1;

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(BoardElement);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		fixture.componentRef.setInput('board', board);
		fixture.componentRef.setInput('projectId', projectId);

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [BoardElement],
			providers: [
				provideRouter([])
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should render board information', async () => {
		await createComponent();

		expect(html.textContent).toContain('Board A');
	});

	it('should emit boardDeleted on clicking "Delete" button', async () => {
		await createComponent();

		const emitSpy = vi.spyOn(component.boardDeleted, 'emit');

		component.onBoardDeleted(1);

		expect(emitSpy).toHaveBeenCalledWith(1);
	});
});
