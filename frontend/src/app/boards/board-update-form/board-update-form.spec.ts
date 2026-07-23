import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardUpdateForm } from './board-update-form';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BoardService } from '../../services/boards/board-service';

describe('BoardUpdateForm', () => {
	let fixture: ComponentFixture<BoardUpdateForm>;
	let component: BoardUpdateForm;

	const currentBoard = {
		id: 1,
		name: "Board A"
	}

	const boardServiceMock = {
		getBoard: vi.fn().mockReturnValue(of(currentBoard)),
		updateBoard: vi.fn().mockReturnValue(of({}))
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
	
	let routerMock = { navigate: vi.fn().mockResolvedValue(true) };

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(BoardUpdateForm);
		component = fixture.componentInstance;

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [BoardUpdateForm],
			providers: [
				{ provide: BoardService, useValue: boardServiceMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock },
				{ provide: Router, useValue: routerMock },
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should load board', async () => {
		await createComponent();

		expect(boardServiceMock.getBoard).toHaveBeenCalledWith(1);
	});

	it('should load existing board into the form', async () => {
		await createComponent();

		expect(component.boardModel()).toEqual({ name: 'Board A' });
	});

	it('should update board when valid form data, then redirect to /projects/projectId and clear form', async () => {
		await createComponent();

		component.boardModel.set({ name: 'Updated A' });

		await component.onSubmit(new Event('submit'));

		expect(boardServiceMock.updateBoard).toHaveBeenCalledWith(currentBoard.id, { name: 'Updated A' });
		expect(routerMock.navigate).toHaveBeenCalledWith(['/projects', 1]);
		expect(component.boardModel()).toEqual({ name: '' });
	});

	it('should not update board when invalid form data', async () => {
		await createComponent();

		component.resetForm(); //Clear name loaded from fetch

		await component.onSubmit(new Event('submit'));

		await fixture.whenStable();

		expect(boardServiceMock.updateBoard).not.toHaveBeenCalled();
	});

	it('should set error when updating board fails', async () => {
		boardServiceMock.updateBoard.mockReturnValue(throwError(() => ({
			error: {
				error: {
					code: 'ERROR_MESSAGE',
					message: 'Error message'
				}
			}
		})));

		await createComponent();

		component.boardModel.set({ name: 'ERROR NAME' });

		await component.onSubmit(new Event('submit'));

		expect(component.error()).not.toBe('');
	});
});
