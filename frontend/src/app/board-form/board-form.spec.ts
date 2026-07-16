import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardForm } from './board-form';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../services/project-service';
import { of, throwError } from 'rxjs';

describe('BoardForm', () => {
	let fixture: ComponentFixture<BoardForm>;
	let component: BoardForm;

	let projectServiceMock: { createBoard: ReturnType<typeof vi.fn> };

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

		fixture.detectChanges();

		if (shouldAwait) {
			await fixture.whenStable();
			fixture.detectChanges();
		}
	}

	beforeEach(async () => {
		vi.clearAllMocks();

		projectServiceMock = { createBoard: vi.fn() };

		await TestBed.configureTestingModule({
			imports: [BoardForm],
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

	it('should create board when valid form data, then redirect to /projects/projectId and clear form', async () => {
		projectServiceMock.createBoard.mockReturnValue(of({}));

		await createComponent();

		const router = TestBed.inject(Router);
		const navigateSpy = vi.spyOn(router, 'navigate');

		component.boardModel.set({ name: 'Board A' });

		await component.onSubmit(new Event('submit'));

		expect(projectServiceMock.createBoard).toHaveBeenCalledWith(1, { name: 'Board A' });
		expect(navigateSpy).toHaveBeenCalledWith(['/projects', 1]);
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

	it('should navigate to /projects/projectId on cancel', async () => {
		await createComponent();

		const router = TestBed.inject(Router);
		const navigateSpy = vi.spyOn(router, 'navigate');

		component.onCancel();

		expect(navigateSpy).toHaveBeenCalledWith(['/projects', 1]);
	});
});
