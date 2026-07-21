import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardModel } from '../board-form/board-form';
import { ColumnModel } from '../columns/column-form/column-form';
import { Column } from './column-service';

const API_URL = 'http://localhost:3000/api/boards';

export interface Board {
	id: number,
	name: string,
	columns: Column[]
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

	createColumn(boardId: number, request: ColumnModel): Observable<Board> {
		return this.http.post<Board>(`${API_URL}/${boardId}/columns`, request);
	}
}
