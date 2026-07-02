import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000';

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

interface IRegister {
	username: string;
	email: string;
	password: string;
}

interface ILogin {
	username: string;
	password: string;
}

@Service()
export class AuthService {
	private http: HttpClient = inject(HttpClient);

	login(loginModel: ILogin): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(`${API_URL}/auth/login`, loginModel);
	}

	register(registerModel: IRegister): Observable<RegisterResponse> {
		return this.http.post<RegisterResponse>(`${API_URL}/auth/register`, registerModel);
	}

	me(): Observable<UserResponse> {
		return this.http.get<UserResponse>(`${API_URL}/auth/me`);
	}
}
