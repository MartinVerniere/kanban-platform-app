import { TestBed } from '@angular/core/testing';

import { BoardService } from './board-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

const boardA = {
	id: 1,
	name: "Board A"
}

const boardB = {
	id: 2,
	name: "Board B"
}

describe('BoardService', () => {
	let service: BoardService;
	let httpMock: HttpTestingController;

	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();

		TestBed.configureTestingModule({
			providers: [
				provideHttpClient(),
				provideHttpClientTesting(),
			]
		});

		httpMock = TestBed.inject(HttpTestingController);
		service = TestBed.inject(BoardService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should get board by id', () => {
		const expectedResponse = boardA;

		service.getBoard(boardA.id).subscribe();

		const request = httpMock.expectOne(`http://localhost:3000/api/boards/${boardA.id}`);

		expect(request.request.method).toBe('GET');

		request.flush(expectedResponse);
	});

	it('should update board', () => {
		const updatedBoard = { name: "Updated B" };

		service.updateBoard(boardB.id, updatedBoard).subscribe();

		const request = httpMock.expectOne(`http://localhost:3000/api/boards/${boardB.id}`);

		expect(request.request.method).toBe('PUT');

		request.flush({});
	});

	it('should delete board', () => {
		service.deleteBoard(boardB.id).subscribe();

		const request = httpMock.expectOne(`http://localhost:3000/api/boards/${boardB.id}`);

		expect(request.request.method).toBe('DELETE');

		request.flush({});
	});
});
