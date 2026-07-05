import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../services/auth-service';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

describe('Login', () => {
	let fixture: ComponentFixture<Login>;
	let component: Login;
	let router: Router;
	let navigateSpy: any;

	let authServiceMock: { login: ReturnType<typeof vi.fn> }; // Injected service

	beforeEach(async () => {
		authServiceMock = { login: vi.fn() };

		await TestBed.configureTestingModule({
			imports: [Login],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				provideRouter([])
			]
		}).compileComponents();

		router = TestBed.inject(Router);
		navigateSpy = vi.spyOn(router, 'navigate');

		fixture = TestBed.createComponent(Login);
		component = fixture.componentInstance;

		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should login on submit', () => {
		authServiceMock.login.mockReturnValue(of({
			user: {
				id: '1',
				username: 'john',
				email: 'john@test.com'
			}
		}));

		component.loginModel.set({
			username: 'john',
			password: '123',
		});

		component.onSubmit(new Event('submit'));

		expect(authServiceMock.login).toHaveBeenCalledWith({
			username: 'john',
			password: '123',
		});

		expect(navigateSpy).toHaveBeenCalledWith(['/']);
	});

	it('should not submit when form is invalid', () => {
		component.loginModel.set({
			username: '',
			password: '',
		});

		component.onSubmit(new Event('submit'));

		expect(authServiceMock.login).not.toHaveBeenCalled();
	});
});
