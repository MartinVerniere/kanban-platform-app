import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardModel } from '../board-form/board-form';

const API_URL = 'http://localhost:3000/api/boards';

export interface Board {
	id: number,
	name: string,
}

@Service()
export class BoardService {
	private http = inject(HttpClient);

	getBoard(boardId: number): Observable<Board> {
		return this.http.get<Board>(`${API_URL}/${boardId}`);
	}

	updateBoard(boardId: number, request: BoardModel): Observable<Board> {
		return this.http.put<Board>(`${API_URL}/${boardId}`, request);
	}

	deleteBoard(boardId: number): Observable<void> {
		return this.http.delete<void>(`${API_URL}/${boardId}`);
	}
}
