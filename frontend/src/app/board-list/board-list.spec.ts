import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardList } from './board-list';
import { NEVER, of, throwError } from 'rxjs';
import { ProjectService } from '../services/project-service';
import { BoardService } from '../services/board-service';
import { provideRouter } from '@angular/router';

describe('BoardList', () => {
	let fixture: ComponentFixture<BoardList>;
	let component: BoardList;
	let html: HTMLElement;

	const projectServiceMock = { getBoards: vi.fn() };
	const boardServiceMock = { deleteBoard: vi.fn() };

	const projectId = 1;

	const boards = [
		{
			id: 1,
			name: 'Board One'
		},
		{
			id: 2,
			name: 'Board Two'
		}
	];

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(BoardList);
		component = fixture.componentInstance;
		html = fixture.nativeElement;

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
			imports: [BoardList],
			providers: [
				{ provide: ProjectService, useValue: projectServiceMock },
				{ provide: BoardService, useValue: boardServiceMock },
				provideRouter([])
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should show loading state', async () => {
		projectServiceMock.getBoards.mockReturnValue(NEVER);

		await createComponent(false);

		expect(html.textContent).toContain('Loading...');
	});

	it('should render boards', async () => {
		projectServiceMock.getBoards.mockReturnValue(of(boards));

		await createComponent();

		expect(html.textContent).toContain('Board One');
		expect(html.textContent).toContain('Board Two');
	});

	it('should show empty state', async () => {
		projectServiceMock.getBoards.mockReturnValue(of([]));

		await createComponent();

		expect(html.textContent).toContain('No boards yet.');
	});

	it('should show error state', async () => {
		projectServiceMock.getBoards.mockReturnValue(throwError(() => new Error()));

		await createComponent();

		expect(html.textContent).toContain('Error loading boards');
	});

	it('should delete project and reload list', async () => {
		projectServiceMock.getBoards.mockReturnValue(of(boards));
		boardServiceMock.deleteBoard.mockReturnValue(of({}));

		await createComponent();

		const reloadSpy = vi.spyOn(component.boardList, 'reload');

		const deleteButton = Array
			.from(html.querySelectorAll('button'))
			.find(button => button.textContent?.includes('Delete'));

		expect(deleteButton).toBeTruthy();

		deleteButton!.click();

		await fixture.whenStable();

		expect(boardServiceMock.deleteBoard).toHaveBeenCalledWith(1);
		expect(reloadSpy).toHaveBeenCalled();
	});
});
