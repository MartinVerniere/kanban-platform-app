import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardList } from './board-list';
import { NEVER, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/projects/project-service';

describe('BoardList', () => {
	let fixture: ComponentFixture<BoardList>;
	let component: BoardList;
	let html: HTMLElement;

	const projectServiceMock = { getBoards: vi.fn() };

	const activatedRouteMock = {
		snapshot: {
			paramMap: {
				get: (key: string) => {
					if (key === 'id') return '1';
					return null;
				}
			}
		}
	}

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
				{ provide: ActivatedRoute, useValue: activatedRouteMock },
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

	it('should reload list on board deleted', async () => {
		projectServiceMock.getBoards.mockReturnValue(of(boards));

		await createComponent();

		const reloadSpy = vi.spyOn(component.boardList, 'reload');

		component.onDeleteBoard();

		expect(reloadSpy).toHaveBeenCalled();
	});
});
