import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthService } from './services/auth-service';

describe('App', () => {
	let fixture: ComponentFixture<App>;
	let component: App;

	let authServiceMock: { initializeAuth: ReturnType<typeof vi.fn> }; // Injected service

	beforeEach(async () => {
		authServiceMock = {
			initializeAuth: vi.fn(),
		}

		await TestBed.configureTestingModule({
			imports: [App],
			providers: [
				{ provide: AuthService, useValue: authServiceMock },
			]
		}).compileComponents();

		fixture = TestBed.createComponent(App);
		component = fixture.componentInstance;

		await fixture.whenStable();
	});

	it('should create the app', () => {
		expect(component).toBeTruthy();
	});

	it('should call initializeAuth', async () => {
		expect(authServiceMock.initializeAuth).toHaveBeenCalledOnce();
	});
});
