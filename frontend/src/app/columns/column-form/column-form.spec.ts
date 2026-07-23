import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnForm } from './column-form';
import { BoardService } from '../../services/boards/board-service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ColumnForm', () => {
	let fixture: ComponentFixture<ColumnForm>;
	let component: ColumnForm;
	let html: HTMLElement;

	let boardServiceMock = { createColumn: vi.fn() };
	let routerMock = { navigate: vi.fn().mockResolvedValue(true) };

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

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(ColumnForm);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [ColumnForm],
			providers: [
				{ provide: BoardService, useValue: boardServiceMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock },
				{ provide: Router, useValue: routerMock }
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should create column when valid form data, then redirect to /projects/projectId/boards/boardId and clear form', async () => {
		boardServiceMock.createColumn.mockReturnValue(of({}));

		await createComponent();

		component.columnModel.set({ name: 'Column A' });

		await component.onSubmit(new Event('submit'));

		expect(boardServiceMock.createColumn).toHaveBeenCalledWith(1, { name: 'Column A' });
		expect(routerMock.navigate).toHaveBeenCalledWith(['/projects', 1, 'boards', 1]);
		expect(component.columnModel()).toEqual({ name: '' });
	});

	it('should not create column when invalid form data', async () => {
		await createComponent();

		await component.onSubmit(new Event('submit'));

		await fixture.whenStable();

		expect(boardServiceMock.createColumn).not.toHaveBeenCalled();
	});

	it('should set error when creating board fails', async () => {
		boardServiceMock.createColumn.mockReturnValue(throwError(() => ({
			error: {
				error: {
					code: 'ERROR_MESSAGE',
					message: 'Error message'
				}
			}
		})));

		await createComponent();

		component.columnModel.set({ name: 'ERROR NAME' });

		await component.onSubmit(new Event('submit'));

		expect(component.error()).not.toBe('');
	});
});
