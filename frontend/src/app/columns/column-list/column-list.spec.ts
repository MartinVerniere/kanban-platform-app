import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnList } from './column-list';
import { BoardService } from '../../services/boards/board-service';
import { ActivatedRoute } from '@angular/router';
import { Column } from '../../services/columns/column-service';
import { of } from 'rxjs';

describe('ColumnList', () => {
	let fixture: ComponentFixture<ColumnList>;
	let component: ColumnList;
	let html: HTMLElement;

	const boardServiceMock = { changeColumnOrder: vi.fn() };

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
	};

	const columnList = [
		{ id: 1, name: "Column A" },
		{ id: 2, name: "Column B" }
	];

	async function createComponent(shouldAwait: boolean = true, columnList: Column[] = []) {
		fixture = TestBed.createComponent(ColumnList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		fixture.componentRef.setInput('columnList', columnList);

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [ColumnList],
			providers: [
				{ provide: BoardService, useValue: boardServiceMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock },
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent(true, columnList);

		expect(component).toBeTruthy();
	});

	it('should render boards', async () => {
		await createComponent(true, columnList);

		expect(html.textContent).toContain('Column A');
		expect(html.textContent).toContain('Column B');
	});

	it('should render empty message when no column exists', async () => {
		await createComponent(true);

		expect(html.textContent).toContain('No columns in this project');
	});

	it('should change column order when column is moved left and emit columnMoved', async () => {
		const expectedOrder = [
			{ id: 2, order: 0 },
			{ id: 1, order: 1 },
		];

		boardServiceMock.changeColumnOrder.mockReturnValue(of({}));

		await createComponent(true, columnList);

		const emitSpy = vi.spyOn(component.columnMoved, 'emit');

		component.onMoveLeft(2);

		expect(boardServiceMock.changeColumnOrder).toHaveBeenCalledWith(1, { columnOrder: expectedOrder });
		expect(emitSpy).toHaveBeenCalled();
		expect(component.error()).toBeNull();
	});

	it('should change column order when column is moved right and emit columnMoved', async () => {
		const expectedOrder = [
			{ id: 2, order: 0 },
			{ id: 1, order: 1 },
		];

		boardServiceMock.changeColumnOrder.mockReturnValue(of({}));

		await createComponent(true, columnList);

		const emitSpy = vi.spyOn(component.columnMoved, 'emit');

		component.onMoveRight(1);

		expect(boardServiceMock.changeColumnOrder).toHaveBeenCalledWith(1, { columnOrder: expectedOrder });
		expect(emitSpy).toHaveBeenCalled();
		expect(component.error()).toBeNull();
	});

	it('should emit columnDeleted when column is deleted', async () => {
		await createComponent(true, columnList);

		const emitSpy = vi.spyOn(component.columnDeleted, 'emit');

		component.onRemoveColumn();

		expect(emitSpy).toHaveBeenCalled();
	});
});
