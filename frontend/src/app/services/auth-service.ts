import { HttpClient } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

const API_URL = 'http://localhost:3000/api';

interface LoginResponse {
	token: string;
	user: {
		id: string;
		username: string;
		email: string;
	};
}

interface RegisterResponse {
	id: string;
	username: string;
	email: string;
}

interface UserResponse {
	id: string;
	username: string;
	email: string;
}

interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

interface LoginRequest {
	username: string;
	password: string;
}

@Service()
export class AuthService {
	private http: HttpClient = inject(HttpClient);
	private router: Router = inject(Router);

	private authToken = signal<string | null>(localStorage.getItem('authToken'));
	private currentUser = signal<any | null>(null);

	isLoggedIn = computed(() => !!this.authToken());
	user = this.currentUser.asReadonly();

	login(request: LoginRequest): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(`${API_URL}/auth/login`, request)
			.pipe(tap((response: LoginResponse) => { this.setToken(response.token); }))
			.pipe(tap((response: LoginResponse) => { this.currentUser.set(response.user); }));
	}

	register(request: RegisterRequest): Observable<RegisterResponse> {
		return this.http.post<RegisterResponse>(`${API_URL}/auth/register`, request);
	}

	me(): Observable<UserResponse> {
		return this.http.get<UserResponse>(`${API_URL}/auth/me`);
	}

	logout() {
		this.authToken.set(null);
		this.currentUser.set(null);
		localStorage.removeItem('authToken');

		this.router.navigate(['/login']);
	}

	private setToken(token: string): void {
		this.authToken.set(token);
		localStorage.setItem('authToken', token);
	}

	getToken(): string | null { return this.authToken(); }
	getCurrentUser(): UserResponse | null { return this.currentUser(); }
}
