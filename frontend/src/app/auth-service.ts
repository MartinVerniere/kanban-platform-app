import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

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

	login(request: LoginRequest): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(`${API_URL}/auth/login`, request);
	}

	register(request: RegisterRequest): Observable<RegisterResponse> {
		return this.http.post<RegisterResponse>(`${API_URL}/auth/register`, request);
	}

	me(): Observable<UserResponse> {
		return this.http.get<UserResponse>(`${API_URL}/auth/me`);
	}
}
