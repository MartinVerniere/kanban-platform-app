import { Component, inject } from '@angular/core';
import { Health } from '../services/health';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-home',
	imports: [RouterLink],
	templateUrl: './home.html',
	styleUrl: './home.css',
})
export class Home {
	private healthService = inject(Health);

	async onClick() {
		console.log('Checking health status...');
		const response = await this.healthService.getHealthStatus();
		console.log('Health status:', response.status);
	}
}
