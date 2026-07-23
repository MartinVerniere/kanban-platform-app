import { TestBed } from '@angular/core/testing';
import { ColumnService } from './column-service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

const columnA = {
	id: 1,
	name: "ToDo",
	order: 1,
}

const columnB = {
	id: 2,
	name: "Finished",
	order: 2,
}

describe('ColumnService', () => {
	let service: ColumnService;
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
		service = TestBed.inject(ColumnService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should get column by id', () => {
		const expectedResponse = columnA;

		service.getColumn(columnA.id).subscribe();

		const request = httpMock.expectOne(`http://localhost:3000/api/columns/${columnA.id}`);

		expect(request.request.method).toBe('GET');

		request.flush(expectedResponse);
	});

	it('should update column', () => {
		const updatedColumn  = { name: "Updated B" };

		service.updateColumn(columnB.id, updatedColumn).subscribe();

		const request = httpMock.expectOne(`http://localhost:3000/api/columns/${columnB.id}`);

		expect(request.request.method).toBe('PUT');

		request.flush({});
	});

	it('should delete column', () => {
		service.deleteColumn(columnA.id).subscribe();

		const request = httpMock.expectOne(`http://localhost:3000/api/columns/${columnA.id}`);

		expect(request.request.method).toBe('DELETE');

		request.flush({});
	});
});
