import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnElement } from './column-element';
import { ActivatedRoute } from '@angular/router';
import { ColumnService } from '../../services/columns/column-service';
import { of } from 'rxjs';

describe('ColumnElement', () => {
	let fixture: ComponentFixture<ColumnElement>;
	let component: ColumnElement;
	let html: HTMLElement;

	const activatedRouteMock = {
		snapshot: {
			paramMap: {
				get: (key: string) => {
					if (key === 'projectId') return '1';
					if (key === 'boardId') return '1';
					if (key == 'columnId') return '1';
					return null;
				}
			}
		}
	};

	let columnServiceMock = { deleteColumn: vi.fn() };

	const column = {
		id: 1,
		name: 'Todo'
	};

	const projectId = 1;
	const boardId = 1;

	async function createComponent(shouldAwait: boolean = true, isFirst = false, isLast = false) {
		fixture = TestBed.createComponent(ColumnElement);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

		fixture.componentRef.setInput('column', column);
		fixture.componentRef.setInput('projectId', projectId);
		fixture.componentRef.setInput('boardId', boardId);
		fixture.componentRef.setInput('isFirst', isFirst);
		fixture.componentRef.setInput('isLast', isLast);

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		await TestBed.configureTestingModule({
			imports: [ColumnElement],
			providers: [
				{ provide: ColumnService, useValue: columnServiceMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock }
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should render column information', async () => {
		await createComponent();

		expect(html.textContent).toContain('Todo');
	});

	it('should have "move left" button disabled when it is the first column', async () => {
		await createComponent(true, true, false);

		const moveLeftButton = Array
			.from(html.querySelectorAll('button'))
			.find(button => button.textContent?.includes('Move left'));

		expect(moveLeftButton).toBeTruthy();
		expect(moveLeftButton!.hasAttribute('disabled')).toBe(true);
	});

	it('should have "move right" button disabled when it is the last column', async () => {
		await createComponent(true, false, true);

		const moveRightButton = Array
			.from(html.querySelectorAll('button'))
			.find(button => button.textContent?.includes('Move right'));

		expect(moveRightButton).toBeTruthy();
		expect(moveRightButton!.hasAttribute('disabled')).toBe(true);
	});

	it('should emit moveLeft on "Move left" button clicked', async () => {
		await createComponent();

		const emitSpy = vi.spyOn(component.moveLeft, 'emit');

		const moveLeftButton = Array
			.from(html.querySelectorAll('button'))
			.find(button => button.textContent?.includes('Move left'));

		expect(moveLeftButton).toBeTruthy();

		moveLeftButton!.click();

		await fixture.whenStable();

		expect(emitSpy).toHaveBeenCalledWith(1);
	});

	it('should emit moveRight on "Move right" button clicked', async () => {
		await createComponent();

		const emitSpy = vi.spyOn(component.moveRight, 'emit');

		const moveRightButton = Array
			.from(html.querySelectorAll('button'))
			.find(button => button.textContent?.includes('Move right'));

		expect(moveRightButton).toBeTruthy();

		moveRightButton!.click();

		await fixture.whenStable();

		expect(emitSpy).toHaveBeenCalledWith(1);
	});


	it('should remove column and emit columnRemoved when "Delete" button is clicked', async () => {
		columnServiceMock.deleteColumn.mockReturnValue(of({}));

		await createComponent();

		const emitSpy = vi.spyOn(component.columnDeleted, 'emit');

		const deletColumnButton = Array
			.from(html.querySelectorAll('button'))
			.find(button => button.textContent?.includes('Delete'));

		expect(deletColumnButton).toBeTruthy();

		deletColumnButton!.click();

		await fixture.whenStable();

		expect(columnServiceMock.deleteColumn).toHaveBeenCalledWith(1);
		expect(emitSpy).toHaveBeenCalled();
	});
});
