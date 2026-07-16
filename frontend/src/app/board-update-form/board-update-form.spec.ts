import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardUpdateForm } from './board-update-form';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { BoardService } from '../services/board-service';

describe('BoardUpdateForm', () => {
	let fixture: ComponentFixture<BoardUpdateForm>;
	let component: BoardUpdateForm;

	let boardServiceMock: {
		getBoard: ReturnType<typeof vi.fn>,
		updateBoard: ReturnType<typeof vi.fn>
	};

	const activatedRouteMock = {
		snapshot: {
			paramMap: {
				get: (key: string) => {
					if (key === 'projectId') return '1';
					if (key === 'boardId') return '1';
					return null;
				}
			}
		}
	}

	const currentBoard = {
		id: 1,
		name: "Board A"
	}

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(BoardUpdateForm);
		component = fixture.componentInstance;

		console.log(component.boardId);

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		boardServiceMock = {
			getBoard: vi.fn().mockReturnValue(of(currentBoard)),
			updateBoard: vi.fn().mockReturnValue(of({}))
		};

		await TestBed.configureTestingModule({
			imports: [BoardUpdateForm],
			providers: [
				{ provide: BoardService, useValue: boardServiceMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock },
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('loads board on init', async () => {
		await createComponent(true);

		expect(boardServiceMock.getBoard).toHaveBeenCalledWith(1);
	});

	it('loads existing board into the form', async () => {
		await createComponent();

		expect(component.boardModel()).toEqual({ name: 'Board A' });
	});

	it('should update board when valid form data, then redirect to /projects/projectId and clear form', async () => {
		await createComponent();

		const router = TestBed.inject(Router);
		const navigateSpy = vi.spyOn(router, 'navigate');

		component.boardModel.set({
			name: 'Updated A',
		});

		await component.onSubmit(new Event('submit'));

		expect(boardServiceMock.updateBoard).toHaveBeenCalledWith(currentBoard.id, { name: 'Updated A' });
		expect(navigateSpy).toHaveBeenCalledWith(['/projects', 1]);
		expect(component.boardModel()).toEqual({ name: '' });
	});

	it('should not update board when invalid form data', async () => {
		await createComponent();

		component.resetForm();

		await component.onSubmit(new Event('submit'));

		await fixture.whenStable();

		expect(boardServiceMock.updateBoard).not.toHaveBeenCalled();
	});

	it('should navigate back on cancel', async () => {
		await createComponent();

		const router = TestBed.inject(Router);
		const navigateSpy = vi.spyOn(router, 'navigate');

		component.onCancel();

		expect(navigateSpy).toHaveBeenCalledWith(['/projects', 1]);
	});
});
