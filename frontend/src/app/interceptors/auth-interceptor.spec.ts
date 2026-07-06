import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { AuthService } from '../services/auth-service';

describe('authInterceptor', () => {
	const interceptor: HttpInterceptorFn = (request, next) => TestBed.runInInjectionContext(() => authInterceptor(request, next));

	let authServiceMock: { getToken: ReturnType<typeof vi.fn> }; // Injected service
	let http: HttpClient;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		authServiceMock = { getToken: vi.fn() };

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(withInterceptors([authInterceptor])),
				provideHttpClientTesting(),
				{ provide: AuthService, useValue: authServiceMock }
			]
		});

		http = TestBed.inject(HttpClient);
		httpMock = TestBed.inject(HttpTestingController);
	});

	it('should be created', () => {
		expect(interceptor).toBeTruthy();
	});

	it('should add Authorization header when token exists', () => {
		authServiceMock.getToken.mockReturnValue('abc123');

		http.get('/test').subscribe();

		const request: TestRequest = httpMock.expectOne('/test');

		expect(request.request.headers.get('Authorization')).toBe('Bearer abc123');

		request.flush({});
	});

	it('should NOT add Authorization header when token does not exist', () => {
		authServiceMock.getToken.mockReturnValue(null);

		http.get('/test').subscribe();

		const request: TestRequest = httpMock.expectOne('/test');

		expect(request.request.method).toBe('GET');
		expect(request.request.headers.has('Authorization')).toBe(false);

		request.flush({});
	});

	afterEach(() => {
		httpMock.verify();
	});
});
