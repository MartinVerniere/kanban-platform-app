import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:3000/api/users';

export interface User {
	id: number;
	username: string;
	email: string;
}

@Service()
export class UserService {
	private http = inject(HttpClient);

	getUsers(): Observable<User[]> {
		return this.http.get<User[]>(`${API_URL}`);
	}

	getUser(id: number): Observable<User> {
		return this.http.get<User>(`${API_URL}/${id}`);
	}
}
