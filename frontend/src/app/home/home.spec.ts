import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { AuthService } from '../services/auth-service';
import { provideRouter } from '@angular/router';

describe('Home', () => {
	let fixture: ComponentFixture<Home>;
	let component: Home;

	let authServiceMock: { // Injected service 
		isLoggedIn: ReturnType<typeof vi.fn>,
		login: ReturnType<typeof vi.fn>
	};

	beforeEach(async () => {
		authServiceMock = {
			login: vi.fn(),
			isLoggedIn: vi.fn(),
		};

		await TestBed.configureTestingModule({
			imports: [Home],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
				provideRouter([])
			],
		}).compileComponents();

		fixture = TestBed.createComponent(Home);
		component = fixture.componentInstance;

		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
