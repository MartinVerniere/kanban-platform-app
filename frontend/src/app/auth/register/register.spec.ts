import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../services/auth-service';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

describe('Register', () => {
	let fixture: ComponentFixture<Register>;
	let component: Register;
	let router: Router;
	let navigateSpy: any;

	let authServiceMock: { register: ReturnType<typeof vi.fn> }; // Injected service

	beforeEach(async () => {
		authServiceMock = { register: vi.fn() }

		await TestBed.configureTestingModule({
			imports: [Register],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				provideRouter([])
			]
		}).compileComponents();
		
		router = TestBed.inject(Router);
		navigateSpy = vi.spyOn(router, 'navigate');

		fixture = TestBed.createComponent(Register);
		component = fixture.componentInstance;

		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should register on submit', () => {
		authServiceMock.register.mockReturnValue(of({
			id: '1',
			username: 'john',
			email: 'john@test.com',
		}));

		component.registerModel.set({
			username: 'john',
			email: 'john@test.com',
			password: '123',
		});

		component.onSubmit(new Event('submit'));

		expect(authServiceMock.register).toHaveBeenCalledWith({
			username: 'john',
			email: 'john@test.com',
			password: '123',
		});

		expect(navigateSpy).toHaveBeenCalledWith(['/login']);
	});

	it('should not submit when form is invalid', () => {
		component.registerModel.set({
			username: '',
			email: '',
			password: '',
		});

		component.onSubmit(new Event('submit'));

		expect(authServiceMock.register).not.toHaveBeenCalled();
	});
});
