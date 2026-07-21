import { Component, inject, input, resource } from '@angular/core';
import { Column, ColumnService } from '../../services/columns/column-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-column-details',
  imports: [RouterLink],
  templateUrl: './column-details.html',
  styleUrl: './column-details.css',
})
export class ColumnDetails {
	route = inject(ActivatedRoute);
	columnService = inject(ColumnService)

	projectId = Number(this.route.snapshot.paramMap.get("projectId")!);
	boardId = Number(this.route.snapshot.paramMap.get("boardId")!);
	columnId = Number(this.route.snapshot.paramMap.get("columnId")!);
	
	column = resource({ loader: () => firstValueFrom(this.columnService.getColumn(this.columnId)) });
}
