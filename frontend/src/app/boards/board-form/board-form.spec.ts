import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardForm } from './board-form';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProjectService } from '../../services/projects/project-service';

describe('BoardForm', () => {
	let fixture: ComponentFixture<BoardForm>;
	let component: BoardForm;
	let html: HTMLElement;

	let projectServiceMock = { createBoard: vi.fn() };
	let routerMock = { navigate: vi.fn().mockResolvedValue(true) };

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

	async function createComponent(shouldAwait: boolean = true) {
		fixture = TestBed.createComponent(BoardForm);
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
			imports: [BoardForm],
			providers: [
				{ provide: ProjectService, useValue: projectServiceMock },
				{ provide: ActivatedRoute, useValue: activatedRouteMock },
				{ provide: Router, useValue: routerMock }
			]
		}).compileComponents();
	});

	it('should create', async () => {
		await createComponent();

		expect(component).toBeTruthy();
	});

	it('should create board when valid form data, then redirect to /projects/projectId and clear form', async () => {
		projectServiceMock.createBoard.mockReturnValue(of({}));

		await createComponent();

		component.boardModel.set({ name: 'Board A' });

		await component.onSubmit(new Event('submit'));

		expect(projectServiceMock.createBoard).toHaveBeenCalledWith(1, { name: 'Board A' });
		expect(routerMock.navigate).toHaveBeenCalledWith(['/projects', 1]);
		expect(component.boardModel()).toEqual({ name: '' });
	});

	it('should not create board when invalid form data', async () => {
		await createComponent();

		await component.onSubmit(new Event('submit'));

		await fixture.whenStable();

		expect(projectServiceMock.createBoard).not.toHaveBeenCalled();
	});

	it('should set error when creating board fails', async () => {
		projectServiceMock.createBoard.mockReturnValue(throwError(() => ({
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
