import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnDetails } from './column-details';
import { ColumnService } from '../../services/columns/column-service';
import { ActivatedRoute } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';

describe('ColumnDetails', () => {
	let component: ColumnDetails;
	let fixture: ComponentFixture<ColumnDetails>;
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

	let columnServiceMock = { getColumn: vi.fn() };

	const column = {
		id: 1,
		name: 'Todo'
	};

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(ColumnDetails);
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
			imports: [ColumnDetails],
			providers: [
				{ provide: ColumnService, useValue: columnServiceMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock }
			]
		}).compileComponents();
	});

	it('should create', async () => {
		columnServiceMock.getColumn.mockReturnValue(of(column));

		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should load column', async () => {
		columnServiceMock.getColumn.mockReturnValue(of(column));

		await createComponent();

		expect(columnServiceMock.getColumn).toHaveBeenCalledWith(1);
	});

	it('should show loading state', async () => {
		columnServiceMock.getColumn.mockReturnValue(NEVER);

		await createComponent(false);

		expect(html.textContent).toContain('Loading...');
	});


	it('should show error state', async () => {
		columnServiceMock.getColumn.mockReturnValue(throwError(() => new Error()));

		await createComponent();

		expect(html.textContent).toContain('Error loading column');
	});

	it('should render column information', async () => {
		columnServiceMock.getColumn.mockReturnValue(of(column));
		
		await createComponent();

		expect(html.textContent).toContain('Todo');
	});
});
